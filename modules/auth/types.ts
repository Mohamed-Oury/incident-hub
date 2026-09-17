export type UserRole = "VIEWER" | "OPERATOR" | "EXPERT" | "VALIDATOR" | "ADMIN";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export const DEMO_USERS: SessionUser[] = [
  {
    id: "usr-ourykohkoun",
    email: "ourykohkoun@gmail.com",
    name: "Oury Kohkoun",
    role: "ADMIN",
  },
];
