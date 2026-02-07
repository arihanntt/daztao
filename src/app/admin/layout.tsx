import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DAZTAO Admin",
  description: "Restricted Access",
  // ⛔️ THIS LINES STOPS GOOGLE ⛔️
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root">
      {children}
    </div>
  );
}