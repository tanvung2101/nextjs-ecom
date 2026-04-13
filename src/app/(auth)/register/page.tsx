import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import RegisterForm from './RegisterForm'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Đăng kí",
  description:
    "Cửa hàng giày chính hãng với nhiều mẫu Nike, Adidas, Puma. Giá tốt, giao hàng toàn quốc.",
};

export default function page() {
    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-100'>
            <Card className='w-full max-w-md mx-4 shadow-lg'>
                <CardHeader>
                    <CardTitle className='text-center text-2xl font-semibold'>Đăng ký</CardTitle>
                </CardHeader>

                <CardContent>
                    <RegisterForm></RegisterForm>
                    <div className="flex items-center justify-center my-6">
                        <div className="flex-1 border-t" />
                        <span className="px-3 text-gray-400 text-sm">HOẶC</span>
                        <div className="flex-1 border-t" />
                    </div>

                    <div className="text-center mt-6 text-sm">
                        Bạn đã có tài khoản?{" "}
                        <Link href='/login'
                            className="text-orange-500 hover:underline cursor-pointer"
                        // onClick={() => router.push("/auth/login")}
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
