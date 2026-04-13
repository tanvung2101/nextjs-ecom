export type Profile = {
  id: number
  email: string
  name: string
  phoneNumber: string
  avatar: string | null
  status: string
  roleId: number

  createdById: number | null
  updatedById: number | null
  deletedById: number | null

  deletedAt: string | null
  createdAt: string
  updatedAt: string

  role: Role
}

export type Role = {
  id: number
  name: string
  permissions: Permission[]
}

export type Permission = {
  id: number
  name: string
  module: string
  path: string
  method: string
}