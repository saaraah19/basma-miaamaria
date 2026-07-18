import NavBar from "@/components/public/NavBar";
import Footer from "@/components/public/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
