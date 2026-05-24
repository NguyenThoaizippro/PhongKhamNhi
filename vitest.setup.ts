// Vitest setup: stub "server-only" để cho phép test các module có khai báo
// `import "server-only"`. Module này sẽ throw nếu chạy trong client bundle,
// nhưng trong vitest (node env) thì noop là an toàn.
import { vi } from "vitest";

vi.mock("server-only", () => ({}));
