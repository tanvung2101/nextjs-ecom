import { FormData } from "@/app/(user)/user/password/page";
import http from "@/lib/http";
import { RegisterFormValues } from "@/lib/validators/authSchema";

export const authApi = {
  login: (body: {email: string, password: string, code?: string}) => http.post('auth/login', body),
  register: (body: RegisterFormValues) => http.post('auth/register', body),
  logout: () => http.post('auth/logout'),
  resetPassword: (body: FormData) => http.post("/auth/reset-password", body),
  otp: (body: {email: string, type: string}) => http.post('/auth/otp', body),
}