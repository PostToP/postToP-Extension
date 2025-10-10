import {createAuthClient} from "better-auth/client";
export const authClient = createAuthClient({
  baseURL: "http://localhost:8000",
}) as ReturnType<typeof createAuthClient>;
