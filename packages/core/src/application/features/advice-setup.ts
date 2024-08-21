import { AnyBeanDefinition, AnyBeanWrapper, Bean, Ctor } from "../../ioc";
import { METADATA_KEY } from "../constants";
import { MetadataProcessor } from "../decorator";
import { MetadataHandler, MetadataProcessorBean } from "./metadata-processor";

@Bean()
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
        if (!adviceExceptionHandlers.length) return;
        // setup exception handlers
        for (const key of wrapper.getInstance()) {
          const func = wrapper.getInstance()[key];
          if (typeof func !== "function") continue;
          const wrappedHandler = (...args: unknown[]) => {
            try {
              func(...args);
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
