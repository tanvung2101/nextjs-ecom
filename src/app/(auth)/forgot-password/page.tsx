
import { Metadata } from "next";
import ForgotPasswordForm from "./ForgotPasswordForm"

export const metadata: Metadata = {
    title: "Quên mật khẩu",
    description:
        "Cửa hàng giày chính hãng với nhiều mẫu Nike, Adidas, Puma. Giá tốt, giao hàng toàn quốc.",
};

export default function ForgotPasswordPage() {
 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Quên Mật Khẩu
        </h2>

        <ForgotPasswordForm></ForgotPasswordForm>
      </div>
    </div>
  )
}