import http from "@/lib/http";
import { CategoryResponse } from "@/types/product";

export const productApis = {
    getCategory: () => http.get<CategoryResponse>("/categories?parentCategoryId=1")
}