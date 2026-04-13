"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { io } from "socket.io-client";
import Image from "next/image";

import http from "@/lib/http"; // 🔥 dùng fetch chuẩn
import { Order, Receiver, SepayWebhook } from "@/types/order";
import { toast } from "react-toastify";
import { handleApiError } from "@/lib/handleApiError";
import { paymentApi } from "@/lib/api";

type OrderDetail = Order & {
  receiver: Receiver;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

export default function PaymentPage() {
  const { paymentId } = useParams();
  const router = useRouter();

  // ===== GET ORDER =====
  const { data: order, isLoading } = useQuery<OrderDetail>({
    queryKey: ["order", paymentId],
    queryFn: () => http.get(`/orders/${paymentId}`),
    enabled: !!paymentId,
  });

  // ===== REDIRECT KHI ĐÃ THANH TOÁN =====
  useEffect(() => {
    if (!order) return;

    if (order.status === "PENDING_PICKUP") {
      router.replace("/"); // không cho back
    }
  }, [order, router]);

  // ===== TOTAL =====
  const total = useMemo(() => {
    if (!order) return 0;

    return order.items.reduce(
      (sum, item) => sum + item.skuPrice * item.quantity,
      0
    );
  }, [order]);

  // ===== SOCKET (KHÔNG CẦN ACCESS TOKEN NỮA) =====
  useEffect(() => {
    if (!paymentId) return;

    const socket = io("http://localhost:3009/payment", {
      transports: ["websocket"],
      withCredentials: true, // 🔥 cookie tự gửi
    });

    socket.on("connect", () => {
      console.log("✅ connected:", socket.id);
    });

    socket.on("payment", (data) => {
      console.log(data)
      if (data.status === "success" || data.orderId === Number(paymentId)) {
        toast.success("Thanh toán thành công");
        router.replace("/user/purchase");
      }
    });

    socket.on("connect_error", (err) => {
      console.log("❌ socket error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [paymentId, router]);

  // ===== COPY =====
  const handleCopy = () => {
    if (!order) return;
    navigator.clipboard.writeText(`DH${order.id}`);
    toast.success("Đã copy nội dung chuyển khoản!");
  };

  // ===== LOADING =====
  if (isLoading) {
    return (
      <div className="p-10 animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 w-1/3 rounded" />
        <div className="h-20 bg-gray-200 rounded" />
        <div className="h-40 bg-gray-200 rounded" />
      </div>
    );
  }

  // ===== NOT FOUND =====
  if (!order) return <p className="p-10">Không tìm thấy đơn</p>;

  if (order.status === "PENDING_PICKUP") return null;

  const handleTestPayment = async () => {
    if (!order) return;

    const payload: SepayWebhook = {
      id: 9,
      gateway: "MBBank",
      transactionDate: "2026-01-16 14:02:37",
      accountNumber: "8277877899",
      code: null,
      content: `DH${order.paymentId}`,
      transferType: "in",
      transferAmount: total,
      accumulated: total,
      subAccount: null,
      referenceCode: "TEST_" + Date.now(),
      description: `DH${order.id}`,
    };

    

    try {
      // await ordersApis.payment(payload)
      await paymentApi.post("/payment/receiver", payload);
      // toast.success("Đã gửi request test thanh toán");
    } catch (err) {
      handleApiError(err)
    }

  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 mt-32">
      <button
        onClick={handleTestPayment}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        Test thanh toán
      </button>
      <div className="mx-auto max-w-4xl bg-white p-6 rounded-2xl shadow space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-xl font-bold">
            Đơn hàng #{order.id}
          </h1>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* RECEIVER */}
        <div>
          <h2 className="font-semibold mb-2">Người nhận</h2>
          <p>{order.receiver?.name}</p>
          <p>{order.receiver?.phone}</p>
          <p>{order.receiver?.address}</p>
        </div>

        {/* ITEMS */}
        <div>
          <h2 className="font-semibold mb-2">Sản phẩm</h2>

          <div className="border rounded-xl overflow-hidden">
            {order.items.map((item, i) => (
              <div
                key={item.id}
                className={`flex justify-between p-3 ${i !== order.items.length - 1 ? "border-b" : ""
                  }`}
              >
                <span>
                  {item.productName} ({item.skuValue}) x{item.quantity}
                </span>
                <span>
                  {formatCurrency(item.skuPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PAYMENT INFO */}
        <div className="bg-gray-50 p-4 rounded-xl space-y-2">
          <h2 className="font-semibold">Thông tin chuyển khoản</h2>

          <div className="flex justify-between">
            <span>Ngân hàng</span>
            <span>MBBank</span>
          </div>

          <div className="flex justify-between">
            <span>Số tài khoản</span>
            <span className="font-medium">8277877899</span>
          </div>

          <div className="flex justify-between">
            <span>Nội dung</span>
            <div className="flex gap-2 items-center">
              <span className="text-blue-600 font-medium">
                DH{order.id}
              </span>
              <button
                onClick={handleCopy}
                className="text-xs bg-gray-200 px-2 py-1 rounded"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="flex justify-between font-semibold text-red-600">
            <span>Số tiền</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* QR */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="font-semibold">Quét QR</h2>

          <Image
            width={220}
            height={220}
            src={`https://qr.sepay.vn/img?acc=8277877899&bank=MBBank&amount=${total}&des=DH${order.id}`}
            alt="QR"
          />

          <p className="text-sm text-gray-500 text-center">
            Quét bằng app ngân hàng để thanh toán nhanh
          </p>
        </div>
      </div>
    </div>
  );
}