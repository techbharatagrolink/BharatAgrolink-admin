import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata = {
  title: {
    default: "BharatAgrolink Admin",
    template: "%s | BharatAgrolink Admin",
  },
  description: "BharatAgrolink marketplace admin panel",
  robots: { index: false, follow: false },
};

export const viewport = {
  themeColor: "#0e3b26",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const themeScript = `try{if(localStorage.getItem('ba-admin-theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
