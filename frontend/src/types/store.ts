import type { User } from "./user";

export interface authState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  clearState: () => void;

  signUp: (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;

  logIn: (username: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
}
