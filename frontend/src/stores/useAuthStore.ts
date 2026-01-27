import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { authState } from "@/types/store";

export const useAuthStore = create<authState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },

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

  logIn: async (username, password) => {
    try {
      set({ loading: true });

      // call api & set access token
      const { accessToken } = await authService.logIn(username, password);
      set({ accessToken });

      await get().fetchMe();

      toast.success("Welcome back to Chatty!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to log in.");
    } finally {
      set({ loading: false });
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
      set({ loading: false });
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();
      set({ user });
    } catch (error) {
      console.error(error);
      set({ accessToken: null, user: null });
      toast.error("Error when fetching user data. Try again");
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get();
      const accessToken = await authService.refresh();

      setAccessToken(accessToken);

      if (!user) {
        await fetchMe();
      }
    } catch (error) {
      console.error(error);
      toast.error("Your session has expired. Please log in again");
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },
}));
