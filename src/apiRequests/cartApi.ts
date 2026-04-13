import http from "@/lib/http"
import { CartResponse } from "@/types/cart"

/**
 * 🧾 Type gợi ý (bạn có thể chỉnh theo backend)
 */
export type AddToCartBody = {
  skuId: number
  quantity: number
}

export type CartItem = {
  id: number
  skuId: number
  quantity: number
  price: number
  productName: string
  image: string
}

export type Cart = {
  items: CartItem[]
  totalPrice: number
}


export const cartApi = {

  getCart: (): Promise<CartResponse> => http.get('/cart'),

  addToCart: (body: AddToCartBody): Promise<Cart> =>
    http.post('/cart', body),


  updateQuantity: (
    id: number,
    skuId: number,
    quantity: number
  ): Promise<Cart> =>
    http.put(`/cart/${id}`, { skuId, quantity }),

  removeItems: (cartItemIds: number[]) =>
    http.post('/cart/delete', { cartItemIds }),

  // 👉 Clear cart
  clearCart: (): Promise<void> =>
    http.delete('/cart'),
}