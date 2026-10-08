import * as catalog from "./catalog";

/**
 * Screens ported from the PHP admin after the parity pass (docs/php-port).
 * Each group exports resources, routes (admin path -> resource key), live
 * (resource key -> { path, page, permission }), pages (permission -> PHP pages
 * for custom screens) and livePaths, like the parity groups.
 */
const groups = [catalog];

export const portResources = Object.assign({}, ...groups.map((g) => g.resources));
export const portRoutes = Object.assign({}, ...groups.map((g) => g.routes));
export const portLive = Object.assign({}, ...groups.map((g) => g.live));
export const portPages = Object.assign({}, ...groups.map((g) => g.pages));
export const portLivePaths = groups.flatMap((g) => g.livePaths);
