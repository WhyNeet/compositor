import { AnyBeanDefinition, AnyBeanWrapper, Bean, Ctor } from "../../../ioc";
import { METADATA_KEY } from "../../constants";
import { ApplicationContext } from "../../context";
import {
  AdviceIgnore,
  Context,
  MetadataProcessor,
  isIgnored,
} from "../../decorator";
import { ApplicationEvent } from "../events/event-data";
import { MetadataHandler, MetadataProcessorBean } from "../metadata-processor";
import { ControllerExceptionWrapper } from "./controller-setup-aspect";

@Bean()
@AdviceIgnore()
export class AdviceSetup {
  constructor(
    @MetadataProcessor() private metadataProcessor: MetadataProcessorBean,
    @Context() cx: ApplicationContext,
  ) {
    this.metadataProcessor.addHandler(
      METADATA_KEY.APPLICATION_ADVICE,
      this.setupAdvice.bind(this),
    );
    cx.applicationEvents().emit({
      type: ApplicationEvent.HandlersPreparationFinished,
      payload: {},
    });
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
            } catch (exception) {
              const ex =
                exception instanceof ControllerExceptionWrapper
                  ? exception.error()
                  : exception;
              const { key: exceptionHandlerKey } = adviceExceptionHandlers.find(
                ({ exceptions }) => !!exceptions.find((e) => ex instanceof e),
              );
              const exceptionHandler =
                adviceWrapper.getInstance()[exceptionHandlerKey];
              if (exception instanceof ControllerExceptionWrapper)
                return exceptionHandler(
                  exception.error(),
                  exception.request(),
                  exception.response(),
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
