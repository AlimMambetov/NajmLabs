import type { Metadata } from "next";
import "@/styles/index.scss";
import { AppProviders } from "./_providers";
import { fonts } from "@/scripts/fonts";
import { Particles } from "@/components/layout";


export const metadata: Metadata = {
  title: "NajmLabs",
  description: "",
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (<>
    <html lang="ru" className={fonts.join(' ')}>
      <head>
        <link rel="icon" type="image/svg" href="/images/icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
        <Particles variant={1} />
      </body>
    </html>
  </>);
}
