import "./globals.css";

export const metadata = {
  title: "Papà, Si Fa Così!",
  description: "Sartoria e abbinamento capi su misura",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Papà Si Fa Così",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="antialiased bg-[#FAF8F5]">
        {children}
      </body>
    </html>
  );
}