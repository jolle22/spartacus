import { isPlatformBrowser } from '@angular/common';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OccEndpointsService } from '../../occ/services/occ-endpoints.service';
import { StaticPersistenceService } from '../../util/static-persistence.service';
import { WindowRef } from '../../window/window-ref';
import { PersonalizationConfig } from '../config/personalization-config';

const PERSONALIZATION_ID_KEY = 'personalization-id';

@Injectable({ providedIn: 'root' })
export class OccPersonalizationIdInterceptor implements HttpInterceptor {
  private personalizationId: string;
  private requestHeader: string;
  private enabled = false;

  constructor(
    private config: PersonalizationConfig,
    private occEndpoints: OccEndpointsService,
    private winRef: WindowRef,
    @Inject(PLATFORM_ID) private platform: any,
    protected persistenceService: StaticPersistenceService
  ) {
    if (isPlatformBrowser(this.platform)) {
      this.enabled =
        (this.winRef.localStorage && this.config.personalization.enabled) ||
        false;

      if (this.enabled) {
        this.requestHeader = this.config.personalization.httpHeaderName.id.toLowerCase();
        this.personalizationId = this.persistenceService.readFromStorage(
          PERSONALIZATION_ID_KEY
        ) as string;
      } else if (
        this.persistenceService.readFromStorage(PERSONALIZATION_ID_KEY)
      ) {
        this.persistenceService.removeFromStorage(PERSONALIZATION_ID_KEY);
      }
    }
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.enabled) {
      return next.handle(request);
    }

    if (
      this.personalizationId &&
      request.url.includes(this.occEndpoints.getBaseEndpoint())
    ) {
      request = request.clone({
        setHeaders: {
          [this.requestHeader]: this.personalizationId,
        },
      });
    }

    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          if (event.headers.keys().includes(this.requestHeader)) {
            const receivedId = event.headers.get(this.requestHeader);
            if (this.personalizationId !== receivedId) {
              this.personalizationId = receivedId;
              // this.winRef.localStorage.setItem(
              //   PERSONALIZATION_ID_KEY,
              //   this.personalizationId
              // );
              this.persistenceService.persistToStorage(
                PERSONALIZATION_ID_KEY,
                this.personalizationId
              );
            }
          }
        }
      })
    );
  }
}
