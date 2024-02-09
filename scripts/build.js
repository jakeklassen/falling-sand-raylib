import "zx/globals";

await $`npx packager --include '["src/**/*.js", "assets/**/*", "package*.json"]' --out-dir dist`;
