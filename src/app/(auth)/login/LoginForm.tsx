"use client";


import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginFormValues, loginSchema } from '@/lib/validators/authSchema';
import { useAuthStore } from '@/store/auth';
import { handleApiError } from "@/lib/handleApiError";
import { accountApi } from "@/apiRequests/accountApi";
import { authApi } from "@/apiRequests/authApi ";


export default function LoginForm() {
    const router = useRouter();
     const {setTokens,setProfile} = useAuthStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await authApi.login(data)
      // 🔥 2. gọi profile để lấy user
      const profile = await accountApi.getProfile();

      // 🔥 3. lưu vào store
      setProfile(profile);

      // 🔥 4. redirect
      router.push("/");
      router.refresh();

    } catch (error) {
      console.log(error)
      handleApiError(error);
    }
  };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className="space-y-2">
                <Label>Email</Label>
                <Input
                    {...register('email')}
                    placeholder="Nhập email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>Mật khẩu</Label>
                <Input
                    {...register('password')}
                    placeholder="mật khẩu"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>


            <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
            >
                {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
        </form>
    )
}
