// Vitest setup: stub "server-only" + jest-dom matchers
import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("server-only", () => ({}));

// Stub next/navigation (router) for components that import useRouter
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Stub next/image — render <img>
vi.mock("next/image", async () => {
  const React = await import("react");
  return {
    default: (props: Record<string, unknown>) =>
      React.createElement("img", {
        ...props,
        // strip Next-specific props
        priority: undefined,
        fill: undefined,
        sizes: undefined,
      }),
  };
});

// Stub Firebase client to avoid init errors in tests
vi.mock("@/lib/firebase/client", () => ({
  auth: {},
  db: {},
}));
