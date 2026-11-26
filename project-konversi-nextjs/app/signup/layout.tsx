import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar | Bika Ambon",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}