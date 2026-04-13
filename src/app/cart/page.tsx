"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CartResponse } from '@/types/cart'
import { toast } from 'react-toastify'
import type { ReceiverFormValues } from '../../lib/validators/orderSchema'
import OrderReceiverDialog from './OrderReceiverDialog'
import { handleApiError } from '@/lib/handleApiError'
import http from '@/lib/http'
import { cartApi } from '@/apiRequests/cartApi'

export default function Page() {
    const queryClient = useQueryClient()
    const router = useRouter()

    const [updatingItemId, setUpdatingItemId] = useState<number | null>(null)
    const [openOrderDialog, setOpenOrderDialog] = useState(false)
    const [selectedItems, setSelectedItems] = useState<number[]>([])

    // ===== GET CART =====
    const { data, isLoading } = useQuery({
        queryKey: ["cart"],
        queryFn: cartApi.getCart,
    })

    const carts: CartResponse["data"] = data?.data || []
    console.log(carts)
    // ===== UPDATE =====
    const updateMutation = useMutation({
        mutationFn: ({
            itemId,
            skuId,
            quantity,
        }: {
            itemId: number
            skuId: number
            quantity: number
        }) => cartApi.updateQuantity(itemId,skuId, quantity),

        onMutate: async ({ itemId, quantity }) => {
            setUpdatingItemId(itemId)
            await queryClient.cancelQueries({ queryKey: ["cart"] })

            const prev = queryClient.getQueryData<CartResponse>(["cart"])

            queryClient.setQueryData<CartResponse>(["cart"], (old) => {
                if (!old) return old

                return {
                    ...old,
                    data: old.data.map((shop) => ({
                        ...shop,
                        cartItems: shop.cartItems.map((item) =>
                            item.id === itemId ? { ...item, quantity } : item
                        ),
                    })),
                }
            })

            return { prev }
        },

        onError: (error: any, _variables, context) => {
            if (error?.status === 401) {
                router.push('/login')
                return
            }

            queryClient.setQueryData(["cart"], context?.prev)
            handleApiError(error)
        },

        onSettled: () => {
            setUpdatingItemId(null)
            queryClient.invalidateQueries({ queryKey: ["cart"] })
        },
    })

    // ===== DELETE =====
    const deleteMutation = useMutation({
        mutationFn: (cartItemIds: number[]) =>
            cartApi.removeItems(cartItemIds),

        onMutate: async (cartItemIds) => {
            await queryClient.cancelQueries({ queryKey: ["cart"] })

            const prev = queryClient.getQueryData<CartResponse>(["cart"])

            queryClient.setQueryData<CartResponse>(["cart"], (old) => {
                if (!old) return old

                return {
                    ...old,
                    data: old.data.map((shop) => ({
                        ...shop,
                        cartItems: shop.cartItems.filter(
                            (item) => !cartItemIds.includes(item.id)
                        ),
                    })),
                }
            })

            setSelectedItems((prevSelected) =>
                prevSelected.filter((id) => !cartItemIds.includes(id))
            )

            return { prev }
        },

        onError: (error: any, _variables, context) => {
            if (error?.status === 401) {
                router.push('/login')
                return
            }

            queryClient.setQueryData(["cart"], context?.prev)
            handleApiError(error)
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] })
        },
    })

    // ===== CREATE ORDER =====
    const createOrderMutation = useMutation({
        mutationFn: (payload: {
            shopId: number
            cartItemIds: number[]
            receiver: ReceiverFormValues
        }[]) => http.post("/orders", payload),

        onSuccess: () => {
            toast.success("Đặt hàng thành công")
            setOpenOrderDialog(false)
            setSelectedItems([])
            queryClient.invalidateQueries({ queryKey: ["cart"] })
            router.push("/payment")
        },

        onError: (error: any) => {
            if (error?.status === 401) {
                router.push('/login')
                return
            }

            toast.error("Đặt hàng thất bại")
        },
    })

    // ===== HANDLER =====
    const updateQuantity = (
        itemId: number,
        skuId: number,
        currentQty: number,
        type: "inc" | "dec"
    ) => {
        const newQty = type === "inc" ? currentQty + 1 : currentQty - 1
        if (newQty < 1) return

        updateMutation.mutate({
            itemId,
            skuId,
            quantity: newQty,
        })
    }

    const deleteItem = (itemId: number) => {
        deleteMutation.mutate([itemId])
    }

    // ===== SELECT =====
    const toggleItem = (id: number) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        )
    }

    const toggleShop = (items: CartResponse["data"][number]["cartItems"]) => {
        const ids = items.map(i => i.id)
        const allSelected = ids.every(id => selectedItems.includes(id))

        if (allSelected) {
            setSelectedItems(prev => prev.filter(id => !ids.includes(id)))
        } else {
            setSelectedItems(prev => [...new Set([...prev, ...ids])])
        }
    }

    const allIds = carts.flatMap(s => s.cartItems.map(i => i.id))

    const toggleAll = () => {
        if (selectedItems.length === allIds.length) {
            setSelectedItems([])
        } else {
            setSelectedItems(allIds)
        }
    }

    // ===== TOTAL =====
    const totalPrice = carts
        .flatMap(s => s.cartItems)
        .filter(i => selectedItems.includes(i.id))
        .reduce((sum, i) => sum + i.quantity * i.sku.price, 0)

    const handleOpenOrderDialog = () => {
        if (selectedItems.length === 0) {
            toast.warning("Vui lòng chọn ít nhất 1 sản phẩm")
            return
        }
        setOpenOrderDialog(true)
    }

    const handleCreateOrder = (values: ReceiverFormValues) => {
        const payload = carts
            .map((shop) => {
                const cartItemIds = shop.cartItems
                    .filter((item) => selectedItems.includes(item.id))
                    .map((item) => item.id)

                if (!cartItemIds.length) return null

                return {
                    shopId: shop.shop.id,
                    cartItemIds,
                    receiver: values,
                }
            })
            .filter(Boolean) as {
                shopId: number
                cartItemIds: number[]
                receiver: ReceiverFormValues
            }[]

        if (!payload.length) {
            toast.warning("Không có sản phẩm hợp lệ")
            return
        }

        createOrderMutation.mutate(payload)
    }

    return (
        <div className="container mx-auto p-6 mt-32">

            <Card>
                <CardContent className="p-0">

                    {/* HEADER */}
                    <div className="grid grid-cols-6 p-4 bg-muted font-semibold">
                        <Checkbox
                            className="border-black/60 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500 data-[state=checked]:text-white h-5 w-5"
                            checked={allIds.length > 0 && selectedItems.length === allIds.length}
                            onCheckedChange={toggleAll}
                        />
                        <div>Sản phẩm</div>
                        <div>Phân loại</div>
                        <div>Giá</div>
                        <div>Số lượng</div>
                        <div className="text-right">Tạm tính</div>
                    </div>

                    {/* BODY */}
                    {isLoading ? (
                        <div className="p-4 text-center">Loading...</div>
                    ) : carts.length > 0 ? (
                        carts.map(cart => {
                            const ids = cart.cartItems.map(i => i.id)
                            const checked = ids.every(id => selectedItems.includes(id))

                            return (
                                <div key={cart.shop.id} className="border-t">

                                    <div className="flex items-center gap-2 p-3 bg-gray-100">
                                        <Checkbox
                                            checked={checked}
                                            onCheckedChange={() => toggleShop(cart.cartItems)}
                                            className="border-black/60 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500 data-[state=checked]:text-white h-5 w-5"
                                        />
                                        <span className="font-bold">{cart.shop.name}</span>
                                    </div>

                                    {cart.cartItems.map(item => (
                                        <div key={item.id} className="grid grid-cols-6 p-4 border-t">

                                            <Checkbox
                                                checked={selectedItems.includes(item.id)}
                                                onCheckedChange={() => toggleItem(item.id)}
                                                className="border-black/60 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500 data-[state=checked]:text-white h-5 w-5"
                                            />

                                            <div>{item.sku.product.name}</div>
                                            <div>{item.sku.value}</div>

                                            <div className="text-red-500">
                                                ₫{item.sku.price}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="icon"
                                                    onClick={() =>
                                                        updateQuantity(item.id, item.sku.id, item.quantity, "dec")
                                                    }
                                                >
                                                    <Minus />
                                                </Button>

                                                {item.quantity}

                                                <Button
                                                    size="icon"
                                                    onClick={() =>
                                                        updateQuantity(item.id, item.sku.id, item.quantity, "inc")
                                                    }
                                                >
                                                    <Plus />
                                                </Button>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-red-500">
                                                    ₫{item.quantity * item.sku.price}
                                                </span>

                                                <Button
                                                    variant="ghost"
                                                    onClick={() => deleteItem(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            )
                        })
                    ) : (
                        <div className='text-center p-6'>Chưa có sản phẩm nào</div>
                    )}

                </CardContent>
            </Card>

            {/* FOOTER */}
            <div className="flex justify-between mt-6">

                <div className="flex items-center gap-3">
                    <Checkbox
                        checked={selectedItems.length === allIds.length}
                        onCheckedChange={toggleAll}
                        className="border-black/60 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500 data-[state=checked]:text-white h-5 w-5"
                    />
                    <span>Chọn tất cả</span>

                    <Button
                        variant="destructive"
                        disabled={selectedItems.length === 0}
                        onClick={() => deleteMutation.mutate(selectedItems)}
                        className="bg-orange-500"
                    >
                        Xóa đã chọn
                    </Button>
                </div>

                <div className="flex items-center gap-6">
                    <Link href='/'>Tiếp tục mua sắm</Link>

                    <div className="text-lg font-bold">
                        Tổng: ₫{totalPrice.toLocaleString()}
                    </div>

                    <Button
                        className="bg-orange-500"
                        onClick={handleOpenOrderDialog}
                    >
                        Đặt hàng
                    </Button>
                </div>

            </div>

            <OrderReceiverDialog
                open={openOrderDialog}
                onOpenChange={setOpenOrderDialog}
                onSubmit={handleCreateOrder}
                isPending={createOrderMutation.isPending}
            />
        </div>
    )
}