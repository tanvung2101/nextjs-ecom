import z from "zod"
import { passwordSchema, sendOtpSchema } from "./authSchema"

export const forgotPasswordSchema = z
  .object({
    email: sendOtpSchema.shape.email,
    code: z
      .string()
      .min(6, "Mã xác thực không hợp lệ")
      .max(6, "Mã xác thực không hợp lệ"),
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .strict()
  .superRefine(({ confirmNewPassword, newPassword }, ctx) => {
    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp",
        path: ["confirmNewPassword"],
      })
    }
  })

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>