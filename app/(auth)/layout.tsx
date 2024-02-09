import "@styles/globals.css";
import { GeistSans } from "geist/font";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head />
      <body className={GeistSans.className}>{children}</body>
    </html>
  );
}
