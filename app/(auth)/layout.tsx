import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Genius | Authentication",
  description: "AI SaaS Platform.",
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center h-full">{children}</div>
  );
};

export default AuthLayout;
