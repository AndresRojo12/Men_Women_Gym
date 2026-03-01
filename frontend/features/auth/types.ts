export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "TRAINER";
}

export interface LoginResponse {
  user: User;
  token: string;
}
