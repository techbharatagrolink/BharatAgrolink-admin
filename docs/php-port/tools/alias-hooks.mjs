// Node module hooks so the inventory tool can import the admin app's data modules
// ("@/..." imports, extensionless relative imports, "server-only").
import { pathToFileURL, fileURLToPath } from "url";
import fs from "fs";
import path from "path";

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../src");

function withExt(p) {
  if (/\.(m?js|jsx|json)$/.test(p) && fs.existsSync(p)) return p;
  for (const ext of [".js", ".jsx", "/index.js"]) if (fs.existsSync(p + ext)) return p + ext;
  return p;
}

export async function resolve(specifier, context, next) {
  if (specifier === "server-only") return { url: "data:text/javascript,export default 1", shortCircuit: true };
  if (specifier.startsWith("@/")) return next(pathToFileURL(withExt(path.join(SRC, specifier.slice(2)))).href, context);
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:")) {
    return next(pathToFileURL(withExt(path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier))).href, context);
  }
  return next(specifier, context);
}
