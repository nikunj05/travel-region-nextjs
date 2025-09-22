import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.scss";
import "../styles/_responsive.scss";

export const metadata: Metadata = {
  title: "Travel Region",
  description: "Your travel companion for regional exploration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
