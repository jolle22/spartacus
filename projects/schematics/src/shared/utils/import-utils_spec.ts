import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import {
  Schema as ApplicationOptions,
  Style,
} from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import * as path from 'path';
import { Schema as SpartacusOptions } from '../../add-spartacus/schema';
import {
  CLI_CART_BASE_FEATURE,
  CLI_USER_ACCOUNT_FEATURE,
  CLI_USER_PROFILE_FEATURE,
  SPARTACUS_CHECKOUT,
  SPARTACUS_CORE,
  SPARTACUS_SCHEMATICS,
} from '../libs-constants';
import { addFeatures } from './feature-utils';
import {
  collectDynamicImports,
  createImports,
  getDynamicImportCallExpression,
  getDynamicImportImportPath,
  getDynamicImportPropertyAccess,
  importExists,
  isImportedFromSpartacusCoreLib,
  isImportedFromSpartacusLibs,
  isRelative,
} from './import-utils';
import { LibraryOptions } from './lib-utils';
import { createProgram } from './program';
import { getProjectTsConfigPaths } from './project-tsconfig-paths';
import { cartBaseFeatureModulePath } from './test-utils';

describe('Import utils', () => {
  const schematicRunner = new SchematicTestRunner(
    SPARTACUS_SCHEMATICS,
    path.join(__dirname, '../../collection.json')
  );

  let tree: Tree;
  let buildPath: string;

  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    version: '0.5.0',
  };

  const appOptions: ApplicationOptions = {
    name: 'schematics-test',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: Style.Scss,
    skipTests: false,
    projectRoot: '',
  };

  const spartacusDefaultOptions: SpartacusOptions = {
    project: 'schematics-test',
    lazy: true,
    features: [],
  };

  const BASE_OPTIONS: LibraryOptions = {
    project: 'schematics-test',
    lazy: true,
  };

  beforeEach(async () => {
    tree = await schematicRunner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'workspace',
        workspaceOptions
      )
      .toPromise();
    tree = await schematicRunner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'application',
        appOptions,
        tree
      )
      .toPromise();
    tree = await schematicRunner
      .runSchematicAsync(
        'add-spartacus',
        { ...spartacusDefaultOptions, name: 'schematics-test' },
        tree
      )
      .toPromise();

    buildPath = getProjectTsConfigPaths(tree, BASE_OPTIONS.project)
      .buildPaths[0];

    tree = await schematicRunner
      .callRule(
        addFeatures(BASE_OPTIONS, [
          CLI_USER_ACCOUNT_FEATURE,
          CLI_USER_PROFILE_FEATURE,
          CLI_CART_BASE_FEATURE,
        ]),
        tree
      )
      .toPromise();
  });

  describe('isImportedFromSpartacusLibs', () => {
    it('should return true if the provided lib is a spartacus lib', () => {
      expect(isImportedFromSpartacusLibs(SPARTACUS_CHECKOUT)).toBeTruthy();
    });
    it('should return false if the provided lib is NOT a spartacus lib', () => {
      expect(isImportedFromSpartacusLibs('xxx')).toBeFalsy();
    });
  });

  describe('isImportedFromSpartacusCoreLib', () => {
    it('should return true if the provided lib is a core spartacus lib', () => {
      expect(isImportedFromSpartacusCoreLib(SPARTACUS_CORE)).toBeTruthy();
    });
    it('should return false if the provided lib is NOT a core spartacus lib', () => {
      expect(isImportedFromSpartacusCoreLib(SPARTACUS_CHECKOUT)).toBeFalsy();
    });
  });

  describe('collectDynamicImports', () => {
    it('should collect all dynamic imports', async () => {
      const { program } = createProgram(tree, tree.root.path, buildPath);

      const cartFeatureModule = program.getSourceFileOrThrow(
        cartBaseFeatureModulePath
      );

      const result = collectDynamicImports(cartFeatureModule);
      expect(result.length).toBe(3);
      expect(result[0].print()).toEqual(
        `() => import('@spartacus/cart/base').then((m) => m.CartBaseModule)`
      );
      expect(result[1].print()).toEqual(
        `() => import('@spartacus/cart/base/components/mini-cart').then((m) => m.MiniCartModule)`
      );
      expect(result[2].print()).toEqual(
        `() => import('@spartacus/cart/base/components/add-to-cart').then((m) => m.AddToCartModule)`
      );
    });
  });

  describe('getDynamicImportCallExpression', () => {
    it('should return the import paths', async () => {
      const { program } = createProgram(tree, tree.root.path, buildPath);

      const cartFeatureModule = program.getSourceFileOrThrow(
        cartBaseFeatureModulePath
      );

      const dynamicImports = collectDynamicImports(cartFeatureModule);
      const result = getDynamicImportCallExpression(dynamicImports[0]);
      expect(result?.print()).toEqual(`import('@spartacus/cart/base')`);
    });
  });

  describe('getDynamicImportImportPath', () => {
    it('should return the import path', async () => {
      const { program } = createProgram(tree, tree.root.path, buildPath);

      const cartFeatureModule = program.getSourceFileOrThrow(
        cartBaseFeatureModulePath
      );

      const dynamicImports = collectDynamicImports(cartFeatureModule);
      const result = getDynamicImportImportPath(dynamicImports[0]);
      expect(result).toEqual(`@spartacus/cart/base`);
    });
  });

  describe('getDynamicImportPropertyAccess', () => {
    it('should return the module name', async () => {
      const { program } = createProgram(tree, tree.root.path, buildPath);

      const cartFeatureModule = program.getSourceFileOrThrow(
        cartBaseFeatureModulePath
      );

      const dynamicImports = collectDynamicImports(cartFeatureModule);
      const result = getDynamicImportPropertyAccess(dynamicImports[0]);
      expect(result?.print()).toEqual(`m.CartBaseModule`);
    });
  });

  describe('createImports', () => {
    it('should create the specified import', async () => {
      const { program } = createProgram(tree, tree.root.path, buildPath);

      const cartFeatureModule = program.getSourceFileOrThrow(
        cartBaseFeatureModulePath
      );

      const results = createImports(cartFeatureModule, {
        moduleSpecifier: SPARTACUS_CORE,
        namedImports: ['xxx'],
      });
      expect(results[0].print()).toEqual(
        `import { xxx } from "@spartacus/core";`
      );
    });
  });

  describe('importExists', () => {
    it('should create the specified import', async () => {
      const { program } = createProgram(tree, tree.root.path, buildPath);
      const cartFeatureModule = program.getSourceFileOrThrow(
        cartBaseFeatureModulePath
      );

      const result = importExists(
        cartFeatureModule,
        SPARTACUS_CORE,
        'I18nConfig'
      );
      expect(result).toBeTruthy();
    });
  });

  describe('isRelative', () => {
    it('should return true if starts with ./', async () => {
      const path = './something';
      const result = isRelative(path);
      expect(result).toBeTruthy();
    });
    it('should return true if starts with ../', async () => {
      const path = '../../something';
      const result = isRelative(path);
      expect(result).toBeTruthy();
    });
    it('should return false if NOT relative', async () => {
      const path = 'something';
      const result = isRelative(path);
      expect(result).toBeFalsy();
    });
  });
});
