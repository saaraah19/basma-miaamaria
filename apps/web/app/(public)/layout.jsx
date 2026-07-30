// after
import { Suspense } from "react";
import NavBar from "@/components/public/NavBar";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";

export default function PublicLayout({ children }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer />
      <Suspense fallback={null}>
        <WhatsAppButton />
      </Suspense>
    </>
  );
}