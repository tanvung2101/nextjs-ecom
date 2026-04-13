// "use client"

// import { useQuery } from '@tanstack/react-query'
// import { useAuthStore } from '@/store/auth'
// import { useEffect, useState } from 'react'
// import { Button } from './ui/button'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger
// } from './ui/dropdown-menu'
// import { authApi } from '@/apiRequests/authApi '

// export default function AuthSection() {
//   const {clear} = useAuthStore((state) => state)
//   const profile = useAuthStore((state) => state.profile)
//   const router = useRouter()
//   const [open, setOpen] = useState(false)

//   const logout = async () => {
//     clear()
//     await authApi.logout()
//     router.refresh()
//   }

//   // ⏳ loading
//   // if (isLoading) return null

//   return (
//     <>
//       {profile ? (
//         <DropdownMenu open={open} onOpenChange={setOpen}>
//           <div
//             onMouseEnter={() => setOpen(true)}
//             onMouseLeave={() => setOpen(false)}
//           >
//             <DropdownMenuTrigger asChild>
//               <div>{profile.name}</div>
//             </DropdownMenuTrigger>

//             <DropdownMenuContent align="end" className="w-40">
//               <DropdownMenuItem asChild>
//                 <Link href="/user/profile">Tài khoản của tôi</Link>
//               </DropdownMenuItem>

//               <DropdownMenuItem asChild>
//                 <Link href="/user/purchase">Đơn mua</Link>
//               </DropdownMenuItem>

//               <DropdownMenuItem onClick={logout}>
//                 Đăng xuất
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </div>
//         </DropdownMenu>
//       ) : (
//         <>
//           <Button variant="ghost">
//             <Link href="/login">Đăng nhập</Link>
//           </Button>

//           <Button variant="ghost">
//             <Link href="/register">Đăng ký</Link>
//           </Button>
//         </>
//       )}
//     </>
//   )
// }

"use client"

import { useAuthStore } from '@/store/auth'
import { useState } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from './ui/popover'
import { authApi } from '@/apiRequests/authApi '

export default function AuthSection() {
  const { clear } = useAuthStore((state) => state)
  const profile = useAuthStore((state) => state.profile)
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const logout = async () => {
    clear()
    await authApi.logout()
    router.refresh()
  }

  return (
    <>
      {profile ? (
        <Popover open={open} onOpenChange={setOpen}>
          <div
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <PopoverTrigger asChild>
              <div className="cursor-pointer">{profile.name}</div>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              className="w-40 p-2"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              <div className="flex flex-col">
                <Link
                  href="/user/profile"
                  className="px-2 py-1 rounded hover:bg-gray-100"
                >
                  Tài khoản của tôi
                </Link>

                <Link
                  href="/user/purchase"
                  className="px-2 py-1 rounded hover:bg-gray-100"
                >
                  Đơn mua
                </Link>

                <button
                  onClick={logout}
                  className="text-left px-2 py-1 rounded hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            </PopoverContent>
          </div>
        </Popover>
      ) : (
        <>
          <Button variant="ghost">
            <Link href="/login">Đăng nhập</Link>
          </Button>

          <Button variant="ghost">
            <Link href="/register">Đăng ký</Link>
          </Button>
        </>
      )}
    </>
  )
}