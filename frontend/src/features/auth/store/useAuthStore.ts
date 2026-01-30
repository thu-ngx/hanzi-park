import { create } from "zustand";
import { toast } from "@/lib/toast";
import { authService } from "@/features/auth/services/authService";
import type { authState } from "@/types/store";

export const useAuthStore = create<authState>((set, get) => ({
  accessToken: null,
  user: null,
  isLoading: false,

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  clearState: () => {
    set({ accessToken: null, user: null, isLoading: false });
  },

  signUp: async (username, email, password) => {
    try {
      set({ isLoading: true });
      await authService.signUp(username, email, password);
      toast.success(
        "Sign up successfully! You will be redirected to log in page",
      );
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign up.");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logIn: async (username, password) => {
    try {
      set({ isLoading: true });
      const { accessToken } = await authService.logIn(username, password);
      get().setAccessToken(accessToken);
      await get().fetchMe();
      toast.success("Welcome back to Hanzi Park!");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to log in.");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logOut: async () => {
    try {
      get().clearState();
      await authService.logOut();
      toast.success("Log out successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to log out. Try again.");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMe: async () => {
    try {
      set({ isLoading: true });
      const user = await authService.fetchMe();
      set({ user });
    } catch (error) {
      console.error(error);
      set({ accessToken: null, user: null });
      toast.error("Error when fetching user data. Try again");
    } finally {
      set({ isLoading: false });
    }
  },

  refresh: async (options) => {
    try {
      set({ isLoading: true });
      const { user, fetchMe, setAccessToken } = get();
      const accessToken = await authService.refresh();
      setAccessToken(accessToken);

      if (!user) {
        await fetchMe();
      }
      return true;
    } catch (error) {
      console.error(error);
      if (!options?.silent) {
        toast.error("Your session has expired. Please log in again");
      }
      get().clearState();
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
