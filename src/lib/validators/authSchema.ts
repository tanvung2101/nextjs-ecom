// lib/validators/registerSchema.ts
import { z } from "zod";

export const sendOtpSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
})

export const passwordSchema = z
  .string()
  .min(6, "Mật khẩu tối thiểu 6 ký tự")
  .max(50, "Mật khẩu phải dưới 50 ký tự")

export const registerSchema = z
  .object({
    name: z.string().min(2, "Tên phải ít nhất 2 ký tự"),
    email: sendOtpSchema.shape.email,
    password: passwordSchema,
    confirmPassword:passwordSchema,
    phoneNumber: z
      .string()
      .min(10, "Số điện thoại không hợp lệ")
      .max(10, "Số điện thoại không hợp lệ")
      .regex(/^[0-9]+$/, "Chỉ được nhập số"),
    code: z
      .string()
      .min(6, "Mã xác thực không hợp lệ")
      .max(6, "Mã xác thực không hợp lệ"),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword']
      })
    }
  })

  export const otpSchema = z
  .object({
    code: z
      .string()
      .min(6, "Mã xác thực không hợp lệ")
      .max(6, "Mã xác thực không hợp lệ"),
  })


  export const loginSchema = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(6, "Mật khẩu tối thiểu 6 ký tự")
      .max(50, "Mật khẩu phải dưới 50 ký tự"),
  })
  .strict()

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Tên tối thiểu 2 ký tự"),
  phoneNumber: z
    .string(),
    // .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ"),
  avatar: z.string().trim().nullable()
})
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type OTPFormValues = z.infer<typeof otpSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type sendOtpValues = z.infer<typeof sendOtpSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>