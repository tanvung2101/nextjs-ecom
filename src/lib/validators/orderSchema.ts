import { z } from "zod"

export const receiverSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập họ tên"),

  phone: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập số điện thoại")
    .regex(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),

  address: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập địa chỉ"),
})

export type ReceiverFormValues = z.infer<typeof receiverSchema>