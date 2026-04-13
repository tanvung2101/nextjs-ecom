"use client"
import { sendOtpSchema, sendOtpValues } from '@/lib/validators/authSchema'
import { ForgotPasswordFormValues, forgotPasswordSchema } from '@/lib/validators/forgotPasswordSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function ForgotPasswordForm() {
     const [step, setStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 phút

  // ===== FORM =====
  const formSendOtp = useForm<sendOtpValues>({
    resolver: zodResolver(sendOtpSchema),
  })

  const formForgotPassword = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  // ===== COUNTDOWN =====
  useEffect(() => {
    if (step !== 2) return
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, step])

  // cảnh báo gần hết hạn
  useEffect(() => {
    if (timeLeft === 30) {
      toast.warning("OTP sắp hết hạn")
    }
  }, [timeLeft])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  // ===== STEP 1: SEND OTP =====
  const handleSendOtp = async (data: sendOtpValues) => {
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          type: "FORGOT_PASSWORD",
        }),
      })

      const result = await res.json()

      if (res.ok) {
        toast.success("Đã gửi mã OTP về email")
        formForgotPassword.setValue("email", data.email)

        setTimeLeft(300) // reset 5 phút
        setStep(2)
      } else {
        toast.error(result.message || "Gửi OTP thất bại")
      }
    } catch {
      toast.error("Lỗi kết nối server")
    }

    setLoading(false)
  }

  // ===== STEP 2: RESET PASSWORD =====
  const handleReset = async (data: ForgotPasswordFormValues) => {
    if (timeLeft === 0) {
      toast.error("OTP đã hết hạn")
      return
    }

    setLoading(true)
    const toastId = toast.loading("Đang xử lý...")

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )

      const result = await res.json()

      if (res.ok) {
        toast.update(toastId, {
          render: "Đổi mật khẩu thành công 🎉",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        })

        setTimeout(() => {
          window.location.href = "/login"
        }, 1500)
      } else {
        toast.update(toastId, {
          render: result.message || "Đổi mật khẩu thất bại",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        })
      }
    } catch {
      toast.update(toastId, {
        render: "Lỗi server",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      })
    }

    setLoading(false)
  }
  return (
    <>
        {/* STEP 1 */}
        {step === 1 && (
          <form
            onSubmit={formSendOtp.handleSubmit(handleSendOtp)}
            className="space-y-4"
          >
            <div>
              <input
                placeholder="Email"
                {...formSendOtp.register("email")}
                className="w-full border p-3 rounded"
              />
              {formSendOtp.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formSendOtp.formState.errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? "Đang gửi..." : "Gửi mã OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form
            onSubmit={formForgotPassword.handleSubmit(handleReset)}
            className="space-y-4"
          >
            <input
              disabled
              {...formForgotPassword.register("email")}
              className="w-full border p-3 rounded bg-gray-100"
            />

            {/* OTP + COUNTDOWN */}
            <div>
              <input
                placeholder="Mã OTP"
                {...formForgotPassword.register("code")}
                className="w-full border p-3 rounded"
              />
              {formForgotPassword.formState.errors.code && (
                <p className="text-red-500 text-sm">
                  {formForgotPassword.formState.errors.code.message}
                </p>
              )}

              <div className="text-sm text-gray-500 flex justify-between mt-1">
                {timeLeft > 0 ? (
                  <span>
                    Hết hạn sau: {minutes}:{seconds
                      .toString()
                      .padStart(2, "0")}
                  </span>
                ) : (
                  <span className="text-red-500">Mã đã hết hạn</span>
                )}

                {timeLeft === 0 && (
                  <button
                    type="button"
                    onClick={formSendOtp.handleSubmit(handleSendOtp)}
                    className="text-blue-500 hover:underline"
                  >
                    Gửi lại mã
                  </button>
                )}
              </div>
            </div>

            <div>
              <input
                type="password"
                placeholder="Mật khẩu mới"
                {...formForgotPassword.register("newPassword")}
                className="w-full border p-3 rounded"
              />
              {formForgotPassword.formState.errors.newPassword && (
                <p className="text-red-500 text-sm">
                  {formForgotPassword.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                {...formForgotPassword.register("confirmNewPassword")}
                className="w-full border p-3 rounded"
              />
              {formForgotPassword.formState.errors.confirmNewPassword && (
                <p className="text-red-500 text-sm">
                  {
                    formForgotPassword.formState.errors.confirmNewPassword
                      .message
                  }
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || timeLeft === 0}
              className="w-full bg-red-500 text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </form>
        )}
    </>
  )
}
