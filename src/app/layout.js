import "./globals.css";
import Sidebar from "@/components/sidebar";

export const metadata = {
  title: "My App",
  description: "Sidebar example",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
