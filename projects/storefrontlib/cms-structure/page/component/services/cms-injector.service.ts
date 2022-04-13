import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { CmsComponentsService } from '../../../services/cms-components.service';
import { CmsComponentData } from '../../model/cms-component-data';
import { ComponentDataProvider } from './component-data.provider';

/**
 * Used to prepare injector for CMS components.
 *
 * Injector will take into account configured providers and provides CmsComponentData
 * for specified component's uid
 */
@Injectable({
  providedIn: 'root',
})
export class CmsInjectorService {
  constructor(
    protected cmsComponentsService: CmsComponentsService,
    protected injector: Injector
  ) {}

  public getInjector(
    type: string,
    uid: string,
    config?: {
      parentInjector?: Injector,
      /** Static data for a specific instance. */
      data?: Object,
    }
  ): Injector {
    const configProviders =
      this.cmsComponentsService.getMapping(type)?.providers ?? [];

    return Injector.create({
      providers: [
        {
          provide: CmsComponentData,
          useFactory: (dataProvider: ComponentDataProvider) => {
            let data$ = dataProvider.get(uid, type);

            if (config?.data) {
              const overwrittenData$ = new Observable(subscriber => {
                let data: unknown;

                data$.subscribe({
                  next: value => data = value,
                  error: error => subscriber.error(error),
                  complete: () => {
                    if (!data) {
                      subscriber.next(config.data);
                    } else if (typeof data === 'object') {
                      subscriber.next({...config.data, ...data });
                    } else {
                      subscriber.next(data);
                    }
                    subscriber.complete();
                  },
                });
              });

              return { uid, data$: overwrittenData$ };
            }

            return { uid, data$ };
          },
          deps: [ComponentDataProvider],
        },
        ...configProviders,
      ],
      parent: config?.parentInjector ?? this.injector,
    });
  }
}
