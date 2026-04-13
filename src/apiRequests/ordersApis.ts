
import http from "@/lib/http";
import { OrderItem, OrdersResponse, SepayWebhook } from "@/types/order";

export const ordersApis = {
  getOrders: ():Promise<OrdersResponse> => http.get('orders'),
  getOrderDetails: (id: number):Promise<OrderItem> => http.get(`orders/${id}`),
  payment: (body:SepayWebhook) => http.post("/payment/receiver", body)
}