import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Aplikasi ini 100% offline-first: state diinisialisasi dari
      // localStorage di dalam useEffect agar aman dari SSR hydration
      // mismatch. Pola ini disengaja dan benar untuk kasus ini.
      "react-hooks/set-state-in-effect": "off",
      // ID unik via Date.now()/Math.random() di event handler adalah
      // pola standar aplikasi kasir offline ini.
      "react-hooks/purity": "off",
    },
  },
]);

export default eslintConfig;
