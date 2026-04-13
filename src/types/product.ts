export interface Product {
  id: number
  publishedAt: string
  name: string
  basePrice: number
  virtualPrice: number
  brandId: number

  images: string[]

  variants: Variant[]

  createdById: number
  updatedById: number | null
  deletedById: number | null
  deletedAt: string | null

  createdAt: string
  updatedAt: string

  productTranslations: any[]

  skus: SKU[]

  categories: Category[]

  brand: Brand
}

export interface Variant {
  value: string
  options: string[]
}

export interface SKU {
  id: number
  value: string
  price: number
  stock: number
  image: string
  productId: number

  createdById: number
  updatedById: number | null
  deletedById: number | null
  deletedAt: string | null

  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  parentCategoryId: number
  name: string
  logo: string

  createdById: number
  updatedById: number | null
  deletedById: number | null
  deletedAt: string | null

  createdAt: string
  updatedAt: string

  categoryTranslations: any[]
}

export type CategoryResponse = {
  data: Category[]
  totalItems: number
}

export interface Brand {
  id: number
  name: string
  logo: string

  createdById: number
  updatedById: number | null
  deletedById: number | null
  deletedAt: string | null

  createdAt: string
  updatedAt: string

  brandTranslations: any[]
}