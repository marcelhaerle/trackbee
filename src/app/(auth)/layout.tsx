import { SessionProvider } from "next-auth/react";

import { SideMenu } from "@/components/side-menu";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SessionProvider>
        <SideMenu />
        <div className="main-content content">
          <div className="p-5 ml-6">{children}</div>
        </div>
      </SessionProvider>
    </>
  );
}
