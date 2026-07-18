import QueryProvider from "@/components/admin/QueryProvider";

export const metadata = {
  robots: { index: false, follow: false }, // admin routes are also blocked in robots.js, this is belt-and-suspenders
};

export default function AdminRootLayout({ children }) {
  return (
    <div data-surface="admin" style={{ minHeight: "100vh" }}>
      <QueryProvider>{children}</QueryProvider>
    </div>
  );
}
