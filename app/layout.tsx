import { ReactNode } from "react";
import "./globals.css";
import Header from "../components/shared/Header";
import ClientLayout from "../components/shared/ClientLayout";
import Providers from "../components/shared/Providers";

export const metadata = {
  title: "Finmunity",
  description: "A financial community platform for news, discussions, and Q&A",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50" suppressHydrationWarning>
        <Providers>
          <Header />
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
