import type { Metadata } from "next";
import "bulma/css/bulma.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trackbee | Track your time",
  description: "Trackbee time tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
