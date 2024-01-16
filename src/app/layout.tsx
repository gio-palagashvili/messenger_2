import Provider from "@/components/Provider";
import "./globals.css";
import { Inter, Roboto } from "next/font/google";

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
      <html lang="en" className={`bg-main text-white z-0 w-full h-full`}>
        <head>
          <link
            rel="shortcut icon"
            href="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Facebook_Messenger_logo_2020.svg/2048px-Facebook_Messenger_logo_2020.svg.png"
            type="image/x-icon"
          />
        </head>
        <body className="w-full h-full">{children}</body>
      </html>
    </Provider>
  );
}
