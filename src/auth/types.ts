export type Role = "admin" | "user";

export type User = {
  id: number;
  email: string;
  password: string;
  role: Role;
  name: string;
};