import type { Metadata } from "next";
import "@/styles/index.scss";
import { AppProviders } from "./_providers";
import { Footer, Header } from "@/components/layout";
import { fontComfortaa } from "@/scripts/fonts";

export const metadata: Metadata = {
  title: "TalkCoffee",
  description: "Кофе с характером, десерты с душой. В самом сердце Чегема!",
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (<>
    <html lang="ru" className={fontComfortaa.variable}>
      <head>
        <link rel="icon" type="image/svg" href="/images/icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body>
        <AppProviders>
          <Header />
          {children}
          <Footer />
        </AppProviders>
      </body>
    </html>
  </>);
}
