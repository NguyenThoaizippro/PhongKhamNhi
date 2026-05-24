import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
