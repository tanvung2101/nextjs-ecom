"use client";

import AccountSidebar from "@/components/AccountSidebar";
import { useAuthStore } from "@/store/auth";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ordersApis } from "@/apiRequests/ordersApis";
import { OrdersResponse, Order } from "@/types/order";

const statusMap: Record<string, string> = {
  ALL: "Tất cả",
  PENDING_PAYMENT: "Chờ thanh toán",
  PENDING_PICKUP: "Chờ lấy hàng",
  PENDING_DELIVERY: "Đang giao",
  DELIVERED: "Đã giao",
  RETURNED: "Trả hàng",
  CANCELLED: "Đã huỷ",
};

export default function PurchasePage() {
  const { profile } = useAuthStore();
  const [status, setStatus] = useState("ALL");

  // ===== FETCH ORDERS =====
  const { data, isLoading, isError } = useQuery<OrdersResponse>({
    queryKey: ["orders"],
    queryFn: ordersApis.getOrders,
  });

  // ===== SAFE ORDERS ARRAY =====
  const orders: Order[] = data?.data ?? [];

  // ===== FILTER ORDERS =====
  const filteredOrders = useMemo(() => {
    if (status === "ALL") return orders;
    return orders.filter((o) => o.status === status);
  }, [orders, status]);

  return (
    <div className="bg-gray-100 min-h-screen py-8 mt-32">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow flex gap-6">

        {/* SIDEBAR */}
        <AccountSidebar
          image={profile?.avatar || "/image.jpg"}
          name={profile?.name || "hello"}
        />

        <div className="w-3/4">

          {/* TABS */}
          <div className="flex border-b mb-4 flex-wrap">
            {Object.entries(statusMap).map(([key, label]) => (
              <div
                key={key}
                onClick={() => setStatus(key)}
                className={`px-4 py-2 cursor-pointer text-sm ${
                  status === key
                    ? "text-red-500 border-b-2 border-red-500"
                    : "text-gray-600"
                }`}
              >
                {label}
              </div>
            ))}
          </div>

          {/* CONTENT */}
          <div className="space-y-4">

            {/* LOADING */}
            {isLoading && (
              <p className="text-center text-gray-400">
                Đang tải...
              </p>
            )}

            {/* ERROR */}
            {isError && (
              <p className="text-center text-red-500">
                Lỗi tải đơn hàng
              </p>
            )}

            {/* EMPTY */}
            {!isLoading && filteredOrders.length === 0 && (
              <p className="text-center text-gray-400">
                Không có đơn hàng
              </p>
            )}

            {/* ORDERS */}
            {!isLoading &&
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gray-50 p-4 rounded border"
                >

                  {/* STATUS */}
                  <div className="text-right text-sm text-gray-500 mb-2">
                    {statusMap[order.status] || order.status}
                  </div>

                  {/* ITEMS */}
                  {order.items?.length > 0 ? (
                    order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 mb-3"
                      >
                        <div className="w-20 h-20 bg-gray-300 rounded overflow-hidden">
                          <img
                            src={item.image || "/image.jpg"}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <p className="font-medium">
                            {item.productName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.skuValue} x{item.quantity}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-red-500 font-medium">
                            ₫
                            {(item.skuPrice || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">
                      Không có sản phẩm
                    </p>
                  )}

                  {/* TOTAL */}
                  <div className="text-right mt-4">
                    <span className="text-sm text-gray-500 mr-2">
                      Tổng giá tiền
                    </span>
                    <span className="text-red-500 font-semibold text-lg">
                      ₫
                      {order.items
                        ?.reduce(
                          (sum, item) =>
                            sum +
                            (item.skuPrice || 0) *
                              item.quantity,
                          0
                        )
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}