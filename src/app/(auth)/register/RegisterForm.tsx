"use client";


import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormValues, registerSchema } from '@/lib/validators/authSchema';
import { useAuthStore } from '@/store/auth';
import axios from "axios";
import { handleApiError } from "@/lib/handleApiError";
import { authApi } from "@/apiRequests/authApi ";


export default function RegisterForm() {
    const router = useRouter();
    const setData = useAuthStore((state) => state.setData);
    const {
        register,
        handleSubmit,
        watch,
        getValues,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            name: '',
            password: '',
            phoneNumber: '',
            confirmPassword: '',
            code: ""
        }
    });

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            await await authApi.register(data)

            setData(data)
            router.push("/");
        } catch (error) {
            console.log(error);
            handleApiError(error)
        }

    };

    const sendOTP = async () => {
        const email = getValues("email");

        if (!email) {
            setError("email", {
                type: "manual",
                message: "Vui lòng nhập email trước",
            });
            return;
        }
        try {
            await authApi.otp({email, type: 'REGISTER'})
        } catch (error) {
           handleApiError(error)
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className="space-y-2">
                <Label>Họ và Tên</Label>
                <Input
                    {...register('name')}
                    placeholder="Họ và Tên"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>Email</Label>
                <Input
                    {...register('email')}
                    placeholder="Email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>Mật khẩu</Label>
                <Input
                    type='password'
                    {...register('password')}
                    placeholder="password"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>Nhập lại mật khẩu</Label>
                <Input
                    type='password'
                    {...register('confirmPassword')}
                    placeholder="ConfirmPassword"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input
                    {...register('phoneNumber')}
                    placeholder="Phone"
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>OTP</Label>
                <div className="flex gap-2">
                    <div className="flex-8">
                        <Input
                            {...register('code')}
                            placeholder="OTP"
                        />
                        {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
                    </div>
                    <Button onClick={sendOTP} className="flex-2 bg-orange-500 hover:bg-orange-600" type="button">Send OTP</Button>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
            >
                {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
            </Button>
        </form>
    )
}
