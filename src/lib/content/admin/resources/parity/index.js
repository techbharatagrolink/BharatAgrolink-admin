import * as seller from "./seller";
import * as marketing from "./marketing";
import * as crm from "./crm";
import * as ops from "./ops";
import * as supportAdmin from "./support-admin";
import * as bulk from "./bulk";

const groups = [seller, marketing, crm, ops, supportAdmin, bulk];

export const parityResources = Object.assign({}, ...groups.map((g) => g.resources));
export const parityRoutes = Object.assign({}, ...groups.map((g) => g.routes));
export const parityLive = Object.assign({}, ...groups.map((g) => g.live));
export const parityPages = Object.assign({}, ...groups.map((g) => g.pages));
export const parityLivePaths = groups.flatMap((g) => g.livePaths);
