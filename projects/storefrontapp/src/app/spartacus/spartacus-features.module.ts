import { NgModule } from '@angular/core';
import {
  AnonymousConsentsModule,
  AuthModule,
  CostCenterOccModule,
  ExternalRoutesModule,
  ProductModule,
  ProductOccModule,
  UserModule,
  UserOccModule,
} from '@spartacus/core';
import {
  ScrollToTopModule,
  AddressBookModule,
  AnonymousConsentManagementBannerModule,
  AnonymousConsentsDialogModule,
  BannerCarouselModule,
  BannerModule,
  BreadcrumbModule,
  CategoryNavigationModule,
  CmsParagraphModule,
  ConsentManagementModule,
  FooterNavigationModule,
  HamburgerMenuModule,
  HomePageEventModule,
  JsonLdBuilderModule,
  LinkModule,
  LoginRouteModule,
  LogoutModule,
  MyCouponsModule,
  MyInterestsModule,
  NavigationEventModule,
  NavigationModule,
  NotificationPreferenceModule,
  PageTitleModule,
  PaymentMethodsModule,
  ProductCarouselModule,
  ProductDetailsPageModule,
  ProductFacetNavigationModule,
  ProductImagesModule,
  ProductIntroModule,
  ProductListingPageModule,
  ProductListModule,
  ProductPageEventModule,
  ProductReferencesModule,
  ProductSummaryModule,
  ProductTabsModule,
  SearchBoxModule,
  SiteContextSelectorModule,
  StockNotificationModule,
  TabParagraphContainerModule,
  PDFModule,
  VideoModule,
} from '@spartacus/storefront';
import { environment } from '../../environments/environment';
import { AdministrationFeatureModule } from './features/administration-feature.module';
import { AsmFeatureModule } from './features/asm-feature.module';
import { BulkPricingFeatureModule } from './features/bulk-pricing-feature.module';
import { CartBaseFeatureModule } from './features/cart-base-feature.module';
import { CdcFeatureModule } from './features/cdc-feature.module';
import { CdsFeatureModule } from './features/cds-feature.module';
import { CheckoutFeatureModule } from './features/checkout-feature.module';
import { CheckoutScheduledReplenishmentFeatureModule } from './features/checkout-scheduled-replenishment-feature.module';
import { DigitalPaymentsFeatureModule } from './features/digital-payments-feature.module';
import { EpdVisualizationFeatureModule } from './features/epd-visualization-feature.module';
import { ImageZoomFeatureModule } from './features/image-zoom-feature.module';
import { ImportExportFeatureModule } from './features/import-export-feature.module';
import { OrderApprovalFeatureModule } from './features/order-approval-feature.module';
import { OrderFeatureModule } from './features/order-feature.module';
import { ProductConfiguratorRulebasedCpqFeatureModule } from './features/product-configurator-rulebased-cpq-feature.module';
import { ProductConfiguratorRulebasedFeatureModule } from './features/product-configurator-rulebased-feature.module';
import { ProductConfiguratorTextfieldFeatureModule } from './features/product-configurator-textfield-feature.module';
import { QualtricsFeatureModule } from './features/qualtrics-feature.module';
import { QuickOrderFeatureModule } from './features/quick-order-feature.module';
import { SavedCartFeatureModule } from './features/saved-cart-feature.module';
import { SmartEditFeatureModule } from './features/smartedit-feature.module';
import { StorefinderFeatureModule } from './features/storefinder-feature.module';
import { TrackingFeatureModule } from './features/tracking-feature.module';
import { UserFeatureModule } from './features/user-feature.module';
import { VariantsFeatureModule } from './features/variants-feature.module';
import { WishListFeatureModule } from './features/wish-list-feature.module';

const featureModules = [];

if (environment.b2b) {
  featureModules.push(
    AdministrationFeatureModule,
    BulkPricingFeatureModule,
    OrderApprovalFeatureModule
  );
}

let CheckoutFeature = CheckoutFeatureModule;

if (environment.b2b) {
  CheckoutFeature = CheckoutScheduledReplenishmentFeatureModule;
}

if (environment.cdc) {
  featureModules.push(CdcFeatureModule);
}
if (environment.cds) {
  featureModules.push(CdsFeatureModule);
}
if (environment.cpq) {
  featureModules.push(ProductConfiguratorRulebasedCpqFeatureModule);
} else {
  featureModules.push(ProductConfiguratorRulebasedFeatureModule);
}
if (environment.digitalPayments) {
  featureModules.push(DigitalPaymentsFeatureModule);
}
if (environment.epdVisualization) {
  featureModules.push(EpdVisualizationFeatureModule);
}

@NgModule({
  imports: [
    // Auth Core
    AuthModule.forRoot(),
    LogoutModule, // will be come part of auth package
    LoginRouteModule, // will be come part of auth package

    // Basic Cms Components
    HamburgerMenuModule,
    SiteContextSelectorModule,
    LinkModule,
    BannerModule,
    CmsParagraphModule,
    TabParagraphContainerModule,
    BannerCarouselModule,
    CategoryNavigationModule,
    NavigationModule,
    FooterNavigationModule,
    PageTitleModule,
    BreadcrumbModule,
    PDFModule,
    ScrollToTopModule,
    VideoModule,

    // User Core
    UserModule,
    UserOccModule,
    // User UI
    AddressBookModule,
    PaymentMethodsModule,
    NotificationPreferenceModule,
    MyInterestsModule,
    StockNotificationModule,
    ConsentManagementModule,
    MyCouponsModule,

    // Anonymous Consents Core
    AnonymousConsentsModule.forRoot(),
    // Anonymous Consents UI
    AnonymousConsentsDialogModule,
    AnonymousConsentManagementBannerModule,

    // Product Core
    ProductModule.forRoot(),
    ProductOccModule,

    // Product UI
    ProductDetailsPageModule,
    ProductListingPageModule,
    ProductListModule,
    SearchBoxModule,
    ProductFacetNavigationModule,
    ProductTabsModule,
    ProductCarouselModule,
    ProductReferencesModule,
    ProductImagesModule,
    ProductSummaryModule,
    ProductIntroModule,

    // Cost Center
    CostCenterOccModule,

    // Page Events
    NavigationEventModule,
    HomePageEventModule,
    ProductPageEventModule,

    /************************* Opt-in features *************************/

    ExternalRoutesModule.forRoot(), // to opt-in explicitly, is added by default schematics
    JsonLdBuilderModule,

    /************************* Feature libraries *************************/
    UserFeatureModule,

    CartBaseFeatureModule,
    WishListFeatureModule,
    SavedCartFeatureModule,
    QuickOrderFeatureModule,
    ImportExportFeatureModule,

    OrderFeatureModule,

    CheckoutFeature,

    TrackingFeatureModule,

    AsmFeatureModule,

    StorefinderFeatureModule,

    QualtricsFeatureModule,

    SmartEditFeatureModule,

    VariantsFeatureModule,
    ProductConfiguratorTextfieldFeatureModule,
    ImageZoomFeatureModule,

    ...featureModules,
  ],
})
export class SpartacusFeaturesModule {}
