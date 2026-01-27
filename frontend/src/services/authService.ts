import api from "@/lib/axios";

export const authService = {
  signUp: async (
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    const res = await api.post(
      "/auth/signup",
      {
        username,
        password,
        email,
        firstName,
        lastName,
      },
      { withCredentials: true },
    );

    return res.data;
  },

  logIn: async (username: string, password: string) => {
    const res = await api.post(
      "/auth/login",
      { username, password },
      { withCredentials: true },
    );

    return res.data; // access token
  },

  logOut: async () => {
    await api.post("/auth/logout", {}, { withCredentials: true });
  },
};
