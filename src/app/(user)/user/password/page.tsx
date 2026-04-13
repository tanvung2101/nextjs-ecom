"use client"

import { useState } from "react"
import AccountSidebar from "@/components/AccountSidebar"
import { useAuthStore } from "@/store/auth"
import { useRouter } from "next/navigation"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Eye, EyeOff } from "lucide-react"
import { toast } from "react-toastify"
import { api } from "@/lib/api"
import { handleApiError } from "@/lib/handleApiError"
import { authApi } from "@/apiRequests/authApi "


const schema = z.object({
  password: z.string().min(6, "Mật khẩu cũ tối thiểu 6 ký tự"),
  newPassword: z.string().min(6, "Mật khẩu mới tối thiểu 6 ký tự"),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmNewPassword"],
})

export type FormData = z.infer<typeof schema>

export default function ChangePasswordPage() {
  const { profile } = useAuthStore()

  
  const [show, setShow] = useState({
    password: false,
    newPassword: false,
    confirmNewPassword: false,
  })

  const toggle = (field: keyof typeof show) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await authApi.resetPassword(data)

      toast.success("Đổi mật khẩu thành công")

      reset()
    } catch (error) {
      console.log(error)
      handleApiError(error)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow flex gap-6">

        <AccountSidebar
          image={profile?.avatar || "/image.jpg"}
          name={profile?.name || "hello"}
        />

        <div className="w-3/4">
          <h2 className="text-xl font-semibold mb-1">
            Đổi Mật Khẩu
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md space-y-5"
          >

            {/* Password cũ */}
            <div className="relative">
              <input
                type={show.password ? "text" : "password"}
                placeholder="Mật khẩu cũ"
                className="w-full border p-2 rounded pr-10"
                {...register("password")}
              />
              <span
                onClick={() => toggle("password")}
                className="absolute right-3 top-2.5 cursor-pointer"
              >
                {show.password ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              <p className="text-red-500 text-sm">
                {errors.password?.message}
              </p>
            </div>

            {/* Password mới */}
            <div className="relative">
              <input
                type={show.newPassword ? "text" : "password"}
                placeholder="Mật khẩu mới"
                className="w-full border p-2 rounded pr-10"
                {...register("newPassword")}
              />
              <span
                onClick={() => toggle("newPassword")}
                className="absolute right-3 top-2.5 cursor-pointer"
              >
                {show.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              <p className="text-red-500 text-sm">
                {errors.newPassword?.message}
              </p>
            </div>

            {/* Confirm */}
            <div className="relative">
              <input
                type={show.confirmNewPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                className="w-full border p-2 rounded pr-10"
                {...register("confirmNewPassword")}
              />
              <span
                onClick={() => toggle("confirmNewPassword")}
                className="absolute right-3 top-2.5 cursor-pointer"
              >
                {show.confirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              <p className="text-red-500 text-sm">
                {errors.confirmNewPassword?.message}
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            >
              {isSubmitting ? "Đang xử lý..." : "Lưu"}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}