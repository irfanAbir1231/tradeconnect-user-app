import { AuthForm } from "@/src/components/auth/AuthForm";

export const metadata = { title: "Create account | TradeConnect" };

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
