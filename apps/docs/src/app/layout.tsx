import { RootProvider } from "fumadocs-ui/provider";
import type { ReactNode } from "react";
import "fumadocs-ui/style.css";

export const metadata = {
  title: "Piramid Providers — Docs",
  description: "Product documentation, help center and API reference.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR" suppressHydrationWarning>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
