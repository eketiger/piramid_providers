import { defineDocs, defineConfig } from "fumadocs-mdx/config";

// Fumadocs collections — `docs` covers product documentation + help-center
// articles. Each MDX file lives under content/docs/<slug>.mdx.
export const docs = defineDocs({
  dir: "content/docs",
});

export default defineConfig();
