// This file is required by karma.conf.js and loads recursively all the .spec and framework files

// Zone.js and zone.js/testing should be imported as FIRST and in this ORDER:
import 'zone.js';
import 'zone.js/testing';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    teardown: { destroyAfterEach: false },
  }
);
// Then we find all the tests.
const CONTEXT = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
CONTEXT.keys().map(CONTEXT);
