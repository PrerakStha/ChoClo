import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";

const display = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: "ChoClo",
  description: "Clothing from Nepal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
            <RevealOnScroll />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}