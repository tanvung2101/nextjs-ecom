import { toast } from "react-toastify"
import { errorMap } from "./errorMap"

type HttpError = {
  status: number
  message: string
}

export const handleApiError = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    const err = error as HttpError

    toast.error(errorMap[err.message] ?? err.message)
    return
  }

  toast.error("Có lỗi xảy ra")
}