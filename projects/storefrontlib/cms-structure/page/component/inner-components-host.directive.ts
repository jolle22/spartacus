import {
  Directive,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  StaticProvider,
  ViewContainerRef,
} from '@angular/core';
import {
  CmsComponent,
  DynamicAttributeService,
  EventService,
  InnerHostMapping,
} from '@spartacus/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { CmsComponentsService } from '../../services/cms-components.service';
import { CmsComponentData } from '../model/cms-component-data';
import { ComponentWrapperDirective } from './component-wrapper.directive';
import { CmsInjectorService } from './services/cms-injector.service';
import { ComponentHandlerService } from './services/component-handler.service';

@Directive({
  selector: '[cxInnerComponentsHost]',
})
export class InnerComponentsHostDirective implements OnInit, OnDestroy {
  @Input()
  additionalProviders?: Array<StaticProvider>;

  protected innerComponents$ = this.data.data$.pipe(
    map((data) => data?.composition?.inner ?? []),
    distinctUntilChanged()
  );

  protected componentWrappers: any[] = [];
  protected subscription?: Subscription;

  constructor(
    protected data: CmsComponentData<CmsComponent>,
    protected vcr: ViewContainerRef,
    // dependencies required for ComponentWrapper directive
    protected cmsComponentsService: CmsComponentsService,
    protected injector: Injector,
    protected dynamicAttributeService: DynamicAttributeService,
    protected renderer: Renderer2,
    protected componentHandler: ComponentHandlerService,
    protected cmsInjector: CmsInjectorService,
    protected eventService: EventService
  ) {}

  ngOnInit(): void {
    this.subscription = this.innerComponents$.subscribe((x) => {
      this.renderComponents(x);
    });
  }

  protected renderComponents(components: Array<InnerHostMapping | string>) {
    this.clearComponents();
    components.forEach((component) => this.renderComponent(component));
  }

  protected renderComponent(component: InnerHostMapping | string) {
    const providers = [
      ...(this.additionalProviders ?? []),
    ];

    const componentWrapper = new ComponentWrapperDirective(
      this.vcr,
      this.cmsComponentsService,
      Injector.create({
        providers,
        parent: this.injector
      }),
      this.dynamicAttributeService,
      this.renderer,
      this.componentHandler,
      this.cmsInjector,
      this.eventService
    );

    let flexType: string;

    if (typeof component === 'string') {
      flexType = component;
    } else {
      flexType = component.component;
      componentWrapper.data = component.data;
    }

    componentWrapper.cxComponentWrapper = { flexType, uid: '' };
    componentWrapper.ngOnInit();
    this.componentWrappers.push(componentWrapper);
  }

  protected clearComponents() {
    this.componentWrappers.forEach((wrapper) => wrapper.ngOnDestroy());
    this.componentWrappers = [];
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.clearComponents();
  }
}
