import { AnyBeanDefinition, AnyBeanWrapper, Bean, Ctor } from "../../ioc";
import { METADATA_KEY } from "../constants";
import { AdviceIgnore, MetadataProcessor, isIgnored } from "../decorator";
import { MetadataHandler, MetadataProcessorBean } from "./metadata-processor";

@Bean()
@AdviceIgnore()
export class AdviceSetup {
  constructor(
    @MetadataProcessor() private metadataProcessor: MetadataProcessorBean,
  ) {
    this.metadataProcessor.addHandler(
      METADATA_KEY.APPLICATION_ADVICE,
      this.setupAspect.bind(this),
    );
  }

  private setupAspect(
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

          const wrappedHandler = (...args: unknown[]) => {
            try {
              return func.bind(wrapper.getInstance())(...args);
            } catch (ex) {
              const { key: exceptionHandlerKey } = adviceExceptionHandlers.find(
                ({ exceptions }) => !!exceptions.find((e) => ex instanceof e),
              );
              const exceptionHandler =
                adviceWrapper.getInstance()[exceptionHandlerKey];
              exceptionHandler(ex);
            }
          };
          wrapper.getInstance()[key] = wrappedHandler;
        }
      });
    }
  }
}
