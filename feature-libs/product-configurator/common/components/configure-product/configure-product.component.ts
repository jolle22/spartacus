import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { CmsComponent, Product } from '@spartacus/core';
import {
  CmsComponentData,
  CurrentProductService,
  ProductListItemContext,
} from '@spartacus/storefront';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonConfigurator } from '../../core/model/common-configurator.model';
import { ConfiguratorProductScope } from '../../core/model/configurator-product-scope';

@Component({
  selector: 'cx-configure-product',
  templateUrl: './configure-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigureProductComponent {
  nonConfigurable: Product = { configurable: false };
  product$: Observable<Product> = (this.productListItemContext
    ? this.productListItemContext.product$
    : this.currentProductService
    ? this.currentProductService.getProduct(
        ConfiguratorProductScope.CONFIGURATOR
      )
    : of(null)
  ).pipe(
    //needed because also currentProductService might return null
    map((product) => (product ? product : this.nonConfigurable))
  );

  icon$: Observable<string | undefined> = this.component.data$.pipe(map(data => data.icon));

  ownerTypeProduct: CommonConfigurator.OwnerType =
    CommonConfigurator.OwnerType.PRODUCT;

  constructor(
    protected component: CmsComponentData<{ icon: string } & CmsComponent>,
    @Optional() protected productListItemContext: ProductListItemContext, // when on PLP
    @Optional() protected currentProductService: CurrentProductService // when on PDP
  ) {}
}
