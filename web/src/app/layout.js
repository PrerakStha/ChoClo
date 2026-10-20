import { Lilita_One, Fredoka } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const display = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Fredoka({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "ChoClo.",
  description: "Simple and fast store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        <AuthProvider>
        <Header />
        {children}
        <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}