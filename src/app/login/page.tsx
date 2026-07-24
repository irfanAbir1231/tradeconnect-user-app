import { AuthForm } from "@/src/components/auth/AuthForm";

export const metadata = { title: "Login | TradeConnect" };

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
