import { Product, SKU } from "./product";

export interface CartShop {
  id: number;
  name: string;
  avatar: string;
}

export type CartProduct = Pick<
  Product,
  "id" | "publishedAt" | "name" | "basePrice" | "virtualPrice" | "brandId" | "images" | "variants" | "productTranslations"
>;

export type CartSKU = Pick<
  SKU,
  "id" | "value" | "price" | "stock" | "image" | "productId"
> & {
  product: CartProduct;
};

export interface CartItem {
  id: number;
  quantity: number;
  skuId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  sku: CartSKU;
}

export interface CartGroup {
  shop: CartShop;
  cartItems: CartItem[];
}

export interface CartResponse {
  data: CartGroup[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
}