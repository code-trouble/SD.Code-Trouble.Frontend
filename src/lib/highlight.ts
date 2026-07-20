// The full highlight.js build ships ~190 languages (~1MB minified — it was the
// single biggest chunk in the bundle). We use the core build and register only
// the languages a dev Q&A platform actually posts.
// https://highlightjs.readthedocs.io/en/latest/readme.html
import hljs from "highlight.js/lib/core";

import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import css from "highlight.js/lib/languages/css";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import kotlin from "highlight.js/lib/languages/kotlin";
import php from "highlight.js/lib/languages/php";
import python from "highlight.js/lib/languages/python";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml"; // HTML/JSX/XML
import yaml from "highlight.js/lib/languages/yaml";

const languages: Record<string, any> = {
  bash,
  c,
  cpp,
  csharp,
  css,
  go,
  java,
  javascript,
  json,
  kotlin,
  php,
  python,
  ruby,
  rust,
  sql,
  typescript,
  xml,
  yaml,
};

for (const [name, language] of Object.entries(languages)) {
  hljs.registerLanguage(name, language);
}

/**
 * Highlights code blocks inside `root`, skipping ones already processed —
 * re-running highlightElement on the same node logs the "Element previously
 * highlighted" warning and can double-wrap the markup.
 */
export const highlightCodeBlocks = (root: ParentNode = document) => {
  root.querySelectorAll("pre").forEach((block) => {
    const el = block as HTMLElement;
    if (el.dataset.highlighted === "yes") return;
    hljs.highlightElement(el);
  });
};

export default hljs;
