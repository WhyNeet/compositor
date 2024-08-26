import { AnyBeanDefinition, AnyBeanWrapper, Bean, Ctor } from "../../../ioc";
import { METADATA_KEY } from "../../constants";
import { AdviceIgnore, MetadataProcessor, isIgnored } from "../../decorator";
import { MetadataHandler, MetadataProcessorBean } from "../metadata-processor";
import { ControllerExceptionWrapper } from "./controller-setup-aspect";

@Bean()
@AdviceIgnore()
export class AdviceSetup {
  constructor(
    @MetadataProcessor() private metadataProcessor: MetadataProcessorBean,
  ) {
    this.metadataProcessor.addHandler(
      METADATA_KEY.APPLICATION_ADVICE,
      this.setupAdvice.bind(this),
    );
  }

  private setupAdvice(
    adviceDef: AnyBeanDefinition,
    adviceWrapper: AnyBeanWrapper,
  ) {
    const adviceDecorators: string[] = Reflect.getOwnMetadata(
      METADATA_KEY.APPLICATION_ADVICE,
      adviceDef.getClass(),
    );

    const adviceExceptionHandlers: { key: string; exceptions: Ctor[] }[] =
      Reflect.getOwnMetadata(
        METADATA_KEY.ADVICE_EXCEPTION_HANDLERS,
        adviceDef.getClass(),
      ) ?? [];

    for (const decorator of adviceDecorators) {
      this.metadataProcessor.addHandler(decorator, (def, wrapper) => {
        // avoid infinite loop
        if (wrapper.getInstance() instanceof adviceDef.getClass()) return;
        // handle ignored beans
        if (isIgnored(def.getClass())) return;
        if (!adviceExceptionHandlers.length) return;
        const objectKeys = Object.getOwnPropertyNames(
          Object.getPrototypeOf(wrapper.getInstance()),
        );
        // setup exception handlers
        for (const key of objectKeys) {
          if (key === "constructor") continue;
          const func = wrapper.getInstance()[key];
          if (typeof func !== "function") continue;

          const wrappedHandler = async (...args: unknown[]) => {
            try {
              return await func.bind(wrapper.getInstance())(...args);
            } catch (ex) {
              const { key: exceptionHandlerKey } = adviceExceptionHandlers.find(
                ({ exceptions }) => !!exceptions.find((e) => ex instanceof e),
              );
              const exceptionHandler =
                adviceWrapper.getInstance()[exceptionHandlerKey];
              if (ex instanceof ControllerExceptionWrapper)
                return exceptionHandler(
                  ex.error(),
                  ex.request(),
                  ex.response(),
                );
              return exceptionHandler(ex);
            }
          };
          wrapper.getInstance()[key] = wrappedHandler;
        }
      });
    }
  }
}
