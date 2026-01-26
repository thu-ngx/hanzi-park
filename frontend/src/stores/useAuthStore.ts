import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { authState } from "@/types/store";

export const useAuthStore = create<authState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  signUp: async (username, email, password, firstName, lastName) => {
    try {
      set({ loading: true });

      // call api
      await authService.signUp(username, email, password, firstName, lastName);

      toast.success(
        "Sign up successfully! You will be redirected to log in page",
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign up.");
    } finally {
      set({ loading: false });
    }
  },
}));
