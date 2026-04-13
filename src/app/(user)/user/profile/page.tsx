"use client"

import { useState, useEffect } from "react"
import AccountSidebar from "@/components/AccountSidebar"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProfileFormValues, profileSchema } from "@/lib/validators/authSchema"
import { toast } from "react-toastify"
import { useAuthStore } from "@/store/auth"
import http from "@/lib/http"
import Image from "next/image"
import { accountApi } from "@/apiRequests/accountApi"

export default function ProfilePage() {
  const [file, setFile] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState("")
  const [preview, setPreview] = useState("")

  const { profile, setProfile } = useAuthStore((state) => state)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phoneNumber: "uuuu",
      avatar: "https://ecom-nest1.s3.ap-southeast-1.amazonaws.com/faae53f6-21df-4079-af58-5434eb34d176.png"
    }
  })
console.log(profile)
  useEffect(() => {
    if (!profile) return

    reset({
      name: profile.name || "",
      phoneNumber: profile.phoneNumber || "",
      avatar: profile.avatar || "https://ecom-nest1.s3.ap-southeast-1.amazonaws.com/faae53f6-21df-4079-af58-5434eb34d176.png"
    })

    setAvatarUrl(profile.avatar || "")
  }, [profile, reset])

  // ===== CLEANUP PREVIEW =====
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  // ===== UPDATE PROFILE =====
  const onSubmit = async (data: ProfileFormValues) => {
    console.log(data)
    try {
      const res = await accountApi.updateProfile(data)

      toast.success("Cập nhật thành công")
      console.log("res", res)
      setProfile(res)

    } catch (err: any) {
      if (err?.status === 401) {
        location.href = "/login"
        return
      }
      toast.error("Update thất bại")
    }
  }

  // ===== UPLOAD AVATAR =====
  const handleUpload = async () => {
    if (!file) return

    try {
      if (file.size > 1024 * 1024) {
        toast.error("File tối đa 1MB")
        return
      }

      // 1. lấy presigned url
      const res = await http.post<{
        url: string
        presignedUrl: string
      }>("/media/images/upload/presigned-url", {
        filename: file.name
      })

      // 2. upload lên S3
      const uploadRes = await fetch(res.presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type
        },
        body: file
      })

      if (!uploadRes.ok) {
        toast.error("Upload thất bại")
        return
      }

      // 3. set avatar
      setAvatarUrl(res.url)
      setFile(null)
      setPreview("")

      toast.success("Upload thành công")

    } catch (err) {
      console.error(err)
      toast.error("Upload lỗi")
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8 mt-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow flex gap-6">

        <AccountSidebar
          image={profile?.avatar || "/image.jpg"}
          name={profile?.name || "hello"}
        />

        <div className="w-3/4">
          <h2 className="text-xl font-semibold mb-1">
            Hồ Sơ Của Tôi
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Quản lý thông tin hồ sơ để bảo mật tài khoản
          </p>

          <div className="grid grid-cols-2 gap-6">

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  disabled
                  value={profile?.email || ""}
                  className="w-full border p-2 rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Tên</label>
                <input
                  {...register("name")}
                  className="w-full border p-2 rounded"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Số Điện Thoại
                </label>
                <input
                  {...register("phoneNumber")}
                  className="w-full border p-2 rounded"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
              >
                Lưu
              </button>
            </form>

            {/* AVATAR */}
            <div className="flex flex-col items-center justify-center border-l pl-6">

              <div className="w-28 h-28 rounded-full bg-gray-300 mb-4 overflow-hidden relative">
                {(preview || avatarUrl) && (
                  <Image
                    alt={profile?.name || "avatar"}
                    src={preview || avatarUrl}
                    fill
                    className="object-cover object-center"
                  />
                )}
              </div>

              <input
                id="upload-avatar"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (!f) return

                  setFile(f)

                  const previewUrl = URL.createObjectURL(f)
                  setPreview(previewUrl)

                  e.target.value = ""
                }}
              />

              <button
                type="button"
                onClick={() =>
                  document.getElementById("upload-avatar")?.click()
                }
                className="border px-4 py-2 rounded hover:bg-gray-100 mb-2"
              >
                Chọn ảnh
              </button>

              <button
                type="button"
                onClick={handleUpload}
                disabled={!file}
                className="border px-4 py-2 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Upload ảnh
              </button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                Dung lượng file tối đa 1 MB
                <br />
                Định dạng: JPEG, PNG
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}