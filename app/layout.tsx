import "~/styles/globals.css";

import type { Metadata } from "next";
import { ReactNode } from "react";
import { Toaster } from "~/components/ui/sonner";
import { mono, sans } from "~/fonts";
import { TRPCReactProvider } from "~/trpc/provider";

export const metadata: Metadata = {
  title: "Vocabulary Quiz",
  icons: "/favicon.ico",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable} antialiased`}>
        <TRPCReactProvider>
          {children}
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
