import { RegisterFormValues } from "@/lib/validators/authSchema";
import { Profile } from "@/types/profile";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type RegisterData = RegisterFormValues;

interface AuthStore {
  accessToken: string | null;
  refreshToken: string | null;
  profile: Profile | null;
  setTokens: (access: string, refresh: string) => void;
  clear: () => void;
  data: RegisterData | null;
  setData: (data: RegisterData) => void;
  clearData: () => void;
  setProfile: (profile: Profile) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      profile: null,

      setTokens: (access, refresh) =>
        set({
          accessToken: access,
          refreshToken: refresh,
        }),

      clear: () =>
        set({
          accessToken: null,
          refreshToken: null,
          profile: null,
        }),

      data: null,
      setData: (data) => set({ data }),
      clearData: () => set({ data: null }),

      setProfile: (profile) =>
        set({
          profile,
        }),
    }),
    {
      name: "auth-storage", // localStorage key
    }
  )
);