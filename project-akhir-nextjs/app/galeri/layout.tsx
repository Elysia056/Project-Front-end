import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri | Bika Ambon",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
