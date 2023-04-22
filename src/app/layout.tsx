import Provider from "@/components/Provider";
import "./globals.css";

export const metadata = {
  title: "Messenger",
  description: "nextjs messenger app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider>
      <html lang="en" className="bg-main text-white z-0 w-full h-full">
        <body className="w-full h-full">{children}</body>
      </html>
    </Provider>
  );
}
