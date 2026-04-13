
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import LoginForm from './LoginForm'
import { Metadata } from 'next';
import { loginWithGoogle } from '@/apiRequests/auth-google';
import { Button } from '@/components/ui/button';
import ButtonLoginGoogle from './Button';

export const metadata: Metadata = {
    metadataBase: new URL("http://localhost:3000"),
    title: "Đăng nhập",
    description:
        "Cửa hàng giày chính hãng với nhiều mẫu Nike, Adidas, Puma. Giá tốt, giao hàng toàn quốc.",
};

export default function page() {
    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-100 mt-20'>
            <Card className='w-full max-w-md mx-4 shadow-lg'>
                <CardHeader>
                    <CardTitle className='text-center text-2xl font-semibold'>
                        Đăng nhập
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <LoginForm></LoginForm>
                    <div className='flex items-center justify-between mt-3 text-sm'>
                        <Link href='/forgot-password' className='text-blue-500 hover:underline'>Quên mật khẩu</Link>
                        <Link href='/register' className='text-blue-500 hover:underline'>Đăng ký</Link>
                    </div>

                    <div className='flex items-center justify-center my-6'>
                        <div className='flex-1 border-t'></div>
                        <span className='px-3 text-gray-400 text-sm'>hoặc</span>
                        <div className='flex-1 border-t'></div>
                    </div>
                    <ButtonLoginGoogle></ButtonLoginGoogle>
                </CardContent>
            </Card>
        </div>
    )
}
