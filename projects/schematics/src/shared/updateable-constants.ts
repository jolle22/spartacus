// TODO:#schematics - [at the end] rename the file?
import { SchematicsException } from '@angular-devkit/schematics';
import { ASM_SCHEMATICS_CONFIG } from './lib-configs/asm-schematics-config';
import {
  CART_BASE_SCHEMATICS_CONFIG,
  CART_IMPORT_EXPORT_SCHEMATICS_CONFIG,
  CART_QUICK_ORDER_SCHEMATICS_CONFIG,
  CART_SAVED_CART_SCHEMATICS_CONFIG,
  CART_WISHLIST_SCHEMATICS_CONFIG,
} from './lib-configs/cart-schematics-config';
import {
  CHECKOUT_B2B_SCHEMATICS_CONFIG,
  CHECKOUT_BASE_SCHEMATICS_CONFIG,
  CHECKOUT_SCHEDULED_REPLENISHMENT_SCHEMATICS_CONFIG,
} from './lib-configs/checkout-schematics-config';
import { CDC_SCHEMATICS_CONFIG } from './lib-configs/integration-libs/cdc-schematics-config';
import { CDS_SCHEMATICS_CONFIG } from './lib-configs/integration-libs/cds-schematics-config';
import { DIGITAL_PAYMENTS_SCHEMATICS_CONFIG } from './lib-configs/integration-libs/digital-payments-schematics-config';
import { EPD_SCHEMATICS_CONFIG } from './lib-configs/integration-libs/epd-schematics-config';
import { ORDER_SCHEMATICS_CONFIG } from './lib-configs/order-schematics-config';
import {
  ORGANIZATION_ADMINISTRATION_SCHEMATICS_CONFIG,
  ORGANIZATION_ORDER_APPROVAL_SCHEMATICS_CONFIG,
} from './lib-configs/organization-schematics-config';
import {
  PRODUCT_CONFIGURATOR_CPQ_SCHEMATICS_CONFIG,
  PRODUCT_CONFIGURATOR_RULEBASED_CPQ_SCHEMATICS_CONFIG,
  PRODUCT_CONFIGURATOR_RULEBASED_SCHEMATICS_CONFIG,
  PRODUCT_CONFIGURATOR_TEXTFIELD_SCHEMATICS_CONFIG,
} from './lib-configs/product-configurator-schematics-config';
import {
  PRODUCT_BULK_PRICING_SCHEMATICS_CONFIG,
  PRODUCT_IMAGE_ZOOM_SCHEMATICS_CONFIG,
  PRODUCT_VARIANTS_SCHEMATICS_CONFIG,
} from './lib-configs/product-schematics-config';
import { QUALTRICS_SCHEMATICS_CONFIG } from './lib-configs/qualtrics-schematics-config';
import { SMARTEDIT_SCHEMATICS_CONFIG } from './lib-configs/smartedit-schematics-config';
import { STOREFINDER_SCHEMATICS_CONFIG } from './lib-configs/storefinder-schematics-config';
import {
  TRACKING_AEP_SCHEMATICS_CONFIG,
  TRACKING_GTM_SCHEMATICS_CONFIG,
  TRACKING_PERSONALIZATION_SCHEMATICS_CONFIG,
} from './lib-configs/tracking-schematics-config';
import {
  USER_ACCOUNT_SCHEMATICS_CONFIG,
  USER_PROFILE_SCHEMATICS_CONFIG,
} from './lib-configs/user-schematics-config';
import { FeatureConfig, Module } from './utils/lib-utils';

/**
 * A list of all schematics feature configurations.
 * _Must_ be updated when adding a new schematics
 * library or a feature.
 */
export const SCHEMATICS_CONFIGS: FeatureConfig[] = [
  // feature libraries start
  ASM_SCHEMATICS_CONFIG,

  CART_BASE_SCHEMATICS_CONFIG,
  CART_IMPORT_EXPORT_SCHEMATICS_CONFIG,
  CART_QUICK_ORDER_SCHEMATICS_CONFIG,
  CART_WISHLIST_SCHEMATICS_CONFIG,
  CART_SAVED_CART_SCHEMATICS_CONFIG,

  CHECKOUT_BASE_SCHEMATICS_CONFIG,
  CHECKOUT_B2B_SCHEMATICS_CONFIG,
  CHECKOUT_SCHEDULED_REPLENISHMENT_SCHEMATICS_CONFIG,

  ORDER_SCHEMATICS_CONFIG,

  ORGANIZATION_ADMINISTRATION_SCHEMATICS_CONFIG,
  ORGANIZATION_ORDER_APPROVAL_SCHEMATICS_CONFIG,

  PRODUCT_CONFIGURATOR_TEXTFIELD_SCHEMATICS_CONFIG,
  PRODUCT_CONFIGURATOR_RULEBASED_SCHEMATICS_CONFIG,
  PRODUCT_CONFIGURATOR_RULEBASED_CPQ_SCHEMATICS_CONFIG,
  PRODUCT_CONFIGURATOR_CPQ_SCHEMATICS_CONFIG,

  PRODUCT_BULK_PRICING_SCHEMATICS_CONFIG,
  PRODUCT_IMAGE_ZOOM_SCHEMATICS_CONFIG,
  PRODUCT_VARIANTS_SCHEMATICS_CONFIG,

  QUALTRICS_SCHEMATICS_CONFIG,

  SMARTEDIT_SCHEMATICS_CONFIG,

  STOREFINDER_SCHEMATICS_CONFIG,

  TRACKING_PERSONALIZATION_SCHEMATICS_CONFIG,
  TRACKING_GTM_SCHEMATICS_CONFIG,
  TRACKING_AEP_SCHEMATICS_CONFIG,

  USER_ACCOUNT_SCHEMATICS_CONFIG,
  USER_PROFILE_SCHEMATICS_CONFIG,

  // integration libraries start
  CDC_SCHEMATICS_CONFIG,

  CDS_SCHEMATICS_CONFIG,

  DIGITAL_PAYMENTS_SCHEMATICS_CONFIG,

  EPD_SCHEMATICS_CONFIG,
];

/**
 * Maps sub-features to their parent feature.
 */
export const {
  /**
   * Mapping of features to Spartacus library.
   *
   * E.g.:
   *
   * {
   * ...,
   *  '@spartacus/checkout': ['Checkout', 'Checkout-B2B', 'Checkout-Scheduled-Replenishment'],
   * ...
   * }
   */
  libraryFeatureMapping,
  /**
   * Mapping of feature-modules to the Spartacus library.
   *
   * E.g.:
   *
   * {
   * ...,
   * 'Checkout': ['CheckoutModule'],
   * 'Checkout-B2B': ['CheckoutB2BModule'],
   * 'Checkout-Scheduled-Replenishment': ['CheckoutScheduledReplenishmentModule'],
   * ...
   * }
   */
  featureFeatureModuleMapping,
  /**
   * Mapping of root feature-modules to the Spartacus library.
   *
   * E.g.:
   *
   * {
   * ...,
   * 'Checkout': ['CheckoutRootModule'],
   * 'Checkout-B2B': ['CheckoutB2BRootModule'],
   * 'Checkout-Scheduled-Replenishment': ['CheckoutScheduledReplenishmentRootModule'],
   * ...
   * }
   */
  featureRootModuleMapping,
  /**
   * Mapping of schematics configurations to the Spartacus library.
   *
   * E.g.:
   *
   * {
   * ...,
   * '@spartacus/checkout': [baseConfig, b2bConfig, scheduledReplenishmentConfig],
   * ...
   * }
   */
  featureSchematicConfigMapping,
} = generateMappings();

export function generateMappings(): {
  libraryFeatureMapping: Map<string, string[]>;
  featureFeatureModuleMapping: Map<string, string[]>;
  featureRootModuleMapping: Map<string, string[]>;
  featureSchematicConfigMapping: Map<string, FeatureConfig>;
} {
  const featureMapping: Map<string, string[]> = new Map();
  const featureModuleMapping: Map<string, string[]> = new Map();
  const rootModuleMapping: Map<string, string[]> = new Map();
  const configMapping: Map<string, FeatureConfig> = new Map();

  for (const featureConfig of SCHEMATICS_CONFIGS) {
    populateFeatureMapping(featureMapping, featureConfig);
    populateFeatureModuleMapping(featureModuleMapping, featureConfig);
    populateRootModulesMapping(rootModuleMapping, featureConfig);
    populateConfigMapping(configMapping, featureConfig);
  }

  return {
    libraryFeatureMapping: featureMapping,
    featureFeatureModuleMapping: featureModuleMapping,
    featureRootModuleMapping: rootModuleMapping,
    featureSchematicConfigMapping: configMapping,
  };
}

function populateFeatureMapping(
  mapping: Map<string, string[]>,
  featureConfig: FeatureConfig
): void {
  const feature = featureConfig.library.mainScope;
  const featureName = featureConfig.library.cli;

  const existingMapping = mapping.get(feature) ?? [];
  // avoid adding duplicates
  if (existingMapping.includes(featureName)) {
    return;
  }

  mapping.set(feature, [...existingMapping, featureName]);
}

function populateFeatureModuleMapping(
  mapping: Map<string, string[]>,
  featureConfig: FeatureConfig
): void {
  const feature = featureConfig.library.cli;

  const existingMapping = mapping.get(feature) ?? [];
  const featureModules = ([] as Module[])
    .concat(featureConfig.featureModule)
    .map((fm) => fm.name);

  // avoid adding duplicates
  if (existingMapping.some((existing) => featureModules.includes(existing))) {
    return;
  }

  mapping.set(feature, [...existingMapping, ...featureModules]);
}

function populateRootModulesMapping(
  mapping: Map<string, string[]>,
  featureConfig: FeatureConfig
): void {
  const feature = featureConfig.library.cli;

  const existingMapping = mapping.get(feature) ?? [];
  const rooModules = ([] as Module[])
    .concat(featureConfig.rootModule ?? [])
    .map((rm) => rm.name);

  // avoid adding duplicates
  if (existingMapping.some((existing) => rooModules.includes(existing))) {
    return;
  }

  mapping.set(feature, [...existingMapping, ...rooModules]);
}

function populateConfigMapping(
  mapping: Map<string, FeatureConfig>,
  featureConfig: FeatureConfig
): void {
  mapping.set(featureConfig.library.cli, featureConfig);
}

/**
 * Based on the given value,
 * it returns the key of the given object.
 */
// TODO:#schematics - test?
export function getKeyByMappingValueOrThrow(
  mapping: Map<string, string[]>,
  value: string
): string {
  for (const key of Array.from(mapping.keys())) {
    if ((mapping.get(key) ?? []).includes(value)) {
      return key;
    }
  }

  throw new SchematicsException(`Value ${value} not found in the given map.`);
}

// TODO:#schematics - comment
// TODO:#schematics - test
export function getSchematicsConfigByFeatureOrThrow(
  feature: string
): FeatureConfig {
  const featureConfig = featureSchematicConfigMapping.get(feature);
  if (!featureConfig) {
    throw new SchematicsException(
      `Config not found for the given feature '${feature}'`
    );
  }

  return featureConfig;
}
