import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      // Stub Next.js server-only marker for tests (jsdom env not server)
      "server-only": new URL("./tests/stubs/empty.ts", import.meta.url).pathname,
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/lib/**/*.{ts,tsx}", "src/components/**/*.tsx", "src/app/**/route.ts"],
      exclude: [
        "src/lib/firebase/**",
        "src/lib/auth/AuthProvider.tsx",
        "src/**/*.d.ts",
      ],
    },
  },
});

