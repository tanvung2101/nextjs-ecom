"use client";

import { Trash2 } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Order } from "@/types/order";
import { useRouter } from "next/navigation";
import http from "@/lib/http";
import { toast } from "react-toastify";
import { handleApiError } from "@/lib/handleApiError";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

export default function CheckoutPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // ===== GET ORDERS =====
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => http.get<{ data: Order[] }>("/orders"),
  });

  const orders: Order[] = data?.data || [];

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING_PAYMENT"
  );

  // ===== DELETE ORDER =====
  const deleteMutation = useMutation({
    mutationFn: (orderId: number) =>
      http.put(`/orders/${orderId}`),

    onSuccess: () => {
      toast.success("Đã xoá đơn hàng");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },

    onError: (error: any) => {
      handleApiError(error)
      if (error?.status === 401) {
        router.push("/login");
        return;
      }
      toast.error("Xoá đơn thất bại");
    },
  });

  // ===== ACTION =====
  const handlePay = (orderId: number) => {
    router.push(`/payment/${orderId}`);
  };

  const handleDelete = (orderId: number) => {
    console.log(orderId)
    deleteMutation.mutate(orderId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-32">
      <div className="mx-auto max-w-6xl px-4">

        <div className="bg-white p-5 rounded-2xl shadow-sm">

          {/* HEADER */}
          <div className="grid grid-cols-5 font-semibold border-b pb-2 mb-4">
            <div>Sản phẩm</div>
            <div className="text-center">SL</div>
            <div className="text-center">Giá</div>
            <div className="text-center">Tổng</div>
            <div className="text-right">Hành động</div>
          </div>

          {isLoading ? (
            <p>Đang tải...</p>
          ) : (
            <div>

              {pendingOrders.map((order, idx) => {
                const orderTotal = order.items.reduce(
                  (sum, item) => sum + item.skuPrice * item.quantity,
                  0
                );

                return (
                  <div
                    key={order.id}
                    className={`grid grid-cols-5 items-start py-4 ${
                      idx !== pendingOrders.length - 1 ? "border-b" : ""
                    }`}
                  >
                    {/* PRODUCTS */}
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id}>
                          {item.productName} ({item.skuValue})
                        </div>
                      ))}
                    </div>

                    {/* QUANTITY */}
                    <div className="text-center space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id}>{item.quantity}</div>
                      ))}
                    </div>

                    {/* PRICE */}
                    <div className="text-center space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id}>
                          {formatCurrency(item.skuPrice)}
                        </div>
                      ))}
                    </div>

                    {/* TOTAL */}
                    <div className="text-center font-semibold text-red-600">
                      {formatCurrency(orderTotal)}
                    </div>

                    {/* ACTION */}
                    <div className="text-right space-x-2">
                      <button
                        onClick={() => handlePay(order.id)}
                        className="bg-orange-500 text-white px-3 py-1 rounded"
                      >
                        Thanh toán
                      </button>

                      <button
                        onClick={() => handleDelete(order.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {pendingOrders.length === 0 && (
                <div className="text-center py-6">
                  Không có đơn hàng chờ thanh toán
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}