import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { Toaster } from "sonner";
import Provider from "@/libs/provider";
import NavProvider from "@/libs/navProvider";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>
        <Provider>
          <NavProvider>
            <SidebarProvider>{children}</SidebarProvider>
            <Toaster position="top-right" />
          </NavProvider>
        </Provider>
      </body>
    </html>
  );
}
