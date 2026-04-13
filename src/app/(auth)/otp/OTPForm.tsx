"use client";


import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { OTPFormValues, otpSchema } from '@/lib/validators/authSchema';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import axios from "axios";


export default function OTPForm() {
    const router = useRouter();
     const data = useAuthStore((state) => state.data);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    mode: 'onChange',
    defaultValues: {
      code: ''
    }
  });

  const onSubmit = async (data: OTPFormValues) => {
    try {
      await axios.post("http://localhost:3009/auth/login", {
          ...data,
          code: data.code,
      });
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
    
  };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className="space-y-2">
                <Label>Mã OTP</Label>
                <Input
                    {...register('code')}
                    placeholder="OTP"
                />
                {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
            </div>


            <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
            >
                {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
            </Button>
        </form>
    )
}
