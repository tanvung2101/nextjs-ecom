"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import Image from "next/image"

const menu = [
  {
    label: "Tài Khoản Của Tôi",
    href: "/user/profile",
  },
  {
    label: "Đổi Mật Khẩu",
    href: "/user/password",
  },
  {
    label: "Đơn Mua",
    href: "/user/purchase",
  },
]

export default function AccountSidebar({image, name}: {image: string, name: string}) {
  const pathname = usePathname()

  return (
    <div className="w-1/4 border-r pr-4">
      {/* USER */}
      <div className="flex items-center gap-3 mb-6">
        <Image width={48} height={48} src={image} alt={name} className="w-12 h-12 rounded-full bg-gray-300"></Image>
        <div>
          <p className="font-semibold">tan vung</p>
          <p className="text-sm text-gray-500 cursor-pointer">
            ✏️ Sửa Hồ Sơ
          </p>
        </div>
      </div>

      {/* MENU */}
      <ul className="space-y-4 text-sm">
        {menu.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={clsx(
                "cursor-pointer",
                pathname === item.href
                  ? "text-red-500 font-medium"
                  : "text-gray-600 hover:text-black"
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}