import "./globals.css";
import Sidebar from "@/components/sidebar";

export const metadata = {
  title: {
    default: "BharatAgrolink Admin",
    template: "%s | BharatAgrolink Admin",
  },
  description: "BharatAgrolink marketplace admin panel",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col md:flex-row">
          <Sidebar />
          <main className="flex-1 min-w-0 p-4 md:p-6">
            <p role="note" className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Preview: these pages show sample data and are not connected to live marketplace data yet.
            </p>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
