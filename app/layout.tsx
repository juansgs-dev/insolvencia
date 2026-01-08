import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expertos en Insolvencia - Soluciones Legales Profesionales",
  description:
    "Asesoría especializada en procesos de insolvencia, quiebras y reestructuración financiera. Ayudamos a empresas y personas a recuperar su estabilidad económica.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
       <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
