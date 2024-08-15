// eslint-disable-next-line @typescript-eslint/no-require-imports
const PACKAGE_VERSION = require("../package.json").version;

console.log(`export const PACKAGE_VERSION = "${PACKAGE_VERSION}";`);

console.log(`export default { PACKAGE_VERSION };`);

console.error("package.json version:", PACKAGE_VERSION);
