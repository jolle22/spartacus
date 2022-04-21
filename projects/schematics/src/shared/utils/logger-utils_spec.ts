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
  CLI_USER_PROFILE_FEATURE,
  SPARTACUS_SCHEMATICS,
} from '../libs-constants';
import {
  debugLog,
  formatFeatureComplete,
  formatFeatureStart,
} from './logger-utils';

describe('Logger utils', () => {
  const schematicRunner = new SchematicTestRunner(
    SPARTACUS_SCHEMATICS,
    path.join(__dirname, '../../collection.json')
  );

  let appTree: Tree;

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
    features: [CLI_USER_PROFILE_FEATURE],
    debug: true,
  };

  beforeEach(async () => {
    appTree = await schematicRunner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'workspace',
        workspaceOptions
      )
      .toPromise();
    appTree = await schematicRunner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'application',
        appOptions,
        appTree
      )
      .toPromise();
    appTree = await schematicRunner
      .runSchematicAsync(
        'add-spartacus',
        { ...spartacusDefaultOptions, name: 'schematics-test' },
        appTree
      )
      .toPromise();
  });

  describe('debugLog', () => {
    let lastLogMessage: string | undefined;
    beforeEach(() => {
      schematicRunner.logger.subscribe((log) => {
        lastLogMessage = log.message;
      });
    });

    it('should NOT log the message if the debug is false', async () => {
      await schematicRunner
        .callRule(debugLog(`xxx`, false), appTree)
        .toPromise();
      expect(lastLogMessage).not.toEqual(`xxx`);
    });
  });

  describe('formatFeatureStart', () => {
    it('should format the message', () => {
      const message = formatFeatureStart('featurename', 'xxx');
      expect(message).toEqual(`⌛️ featurename: xxx`);
    });
  });

  describe('formatFeatureComplete', () => {
    it('should format the message', () => {
      const message = formatFeatureComplete('featurename', 'xxx');
      expect(message).toEqual(`✅ featurename: xxx`);
    });
  });
});
