import type { User } from "./user";

export interface authState {
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;
  setAccessToken: (accessToken: string) => void;
  clearState: () => void;

  signUp: (
    username: string,
    email: string,
    password: string,
  ) => Promise<boolean>;

  logIn: (username: string, password: string) => Promise<boolean>;
  logOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refresh: (options?: { silent?: boolean }) => Promise<boolean>;
}
