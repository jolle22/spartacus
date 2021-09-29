import { formats } from '../sample-data/viewports';

const viewportConfigs: Viewport[] = Object.entries(formats).map(
  ([key, value]) => {
    return {
      viewport: key,
      ...value,
    } as Viewport;
  }
);

type Viewports = keyof typeof formats;

interface Viewport {
  viewport: Viewports;
  width: number;
  height: number;
}

function capitalize(str: string) {
  return str[0].toUpperCase() + str.substr(1);
}

/**
 * Runs the same tests against all the provided viewports
 *
 * @param viewportList list of viewports you want to test
 * @param callback test body
 */
export function viewportContext(
  viewportList: Viewports[],
  callback: () => unknown
) {
  // When we set `CYPRESS_VIEWPORT` with one of the viewport name value we only want to run tests in this viewport.
  // eg. with `CYPRESS_VIEWPORT="desktop" tests will be run only in desktop viewport size
  const viewportFromConfig = Cypress.env('VIEWPORT');
  const viewports = viewportConfigs
    .filter((conf) => viewportList.includes(conf.viewport))
    .filter((conf) =>
      viewportFromConfig ? conf.viewport === viewportFromConfig : true
    );
  viewports.forEach((viewport: Viewport) => {
    context(
      `${capitalize(viewport.viewport)}`,
      { viewportWidth: viewport.width, viewportHeight: viewport.height },
      () => {
        callback();
      }
    );
  });
}

/**
 * Gets the current viewport name.
 *
 * @param callback returns viewport name.
 */
export function getViewport(callback: (viewport: string) => unknown) {
  return cy.window().then((window) => {
    const viewport: Viewport = viewportConfigs.find(
      (viewport: Viewport) => viewport.width === window.innerWidth
    );
    return callback(viewport.viewport);
  });
}
