"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ReceiverFormValues, receiverSchema } from "../../lib/validators/orderSchema"

type OrderReceiverDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ReceiverFormValues) => void
  isPending?: boolean
  defaultValues?: Partial<ReceiverFormValues>
}

export default function OrderReceiverDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
  defaultValues,
}: OrderReceiverDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReceiverFormValues>({
    resolver: zodResolver(receiverSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      phone: defaultValues?.phone ?? "",
      address: defaultValues?.address ?? "",
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: defaultValues?.name ?? "",
        phone: defaultValues?.phone ?? "",
        address: defaultValues?.address ?? "",
      })
    }
  }, [open, defaultValues, reset])

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thông tin nhận hàng</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="receiver-name">Họ tên</Label>
            <Input
              id="receiver-name"
              placeholder="Nhập họ tên"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="receiver-phone">Số điện thoại</Label>
            <Input
              id="receiver-phone"
              placeholder="Nhập số điện thoại"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="receiver-address">Địa chỉ</Label>
            <Textarea
              id="receiver-address"
              placeholder="Nhập địa chỉ nhận hàng"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-orange-500"
              disabled={isPending}
            >
              {isPending ? "Đang đặt hàng..." : "Xác nhận đặt hàng"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}