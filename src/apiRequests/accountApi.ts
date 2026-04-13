import { ProfileFormValues } from "@/lib/validators/authSchema";
import http from "@/lib/http";
import { Profile } from "@/types/profile";

export const accountApi = {
  getProfile: ():Promise<Profile> => http.get('profile'),
  updateProfile: (body: ProfileFormValues):Promise<Profile> => http.put('profile', body),
}