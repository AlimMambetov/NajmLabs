import type { Metadata } from "next";
import "@/styles/index.scss";
import { AppProviders } from "./_providers";
import { fonts } from "@/scripts/fonts";
import { Footer, Header, Particles } from "@/components/layout";
import { CSSProperties } from "react";

const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  pointerEvents: 'none'
} as CSSProperties


export const metadata: Metadata = {
  title: "NajmLabs | Cтудия разработки IT-продуктов",
  description: "Разработка корпоративных сайтов, бизнес-приложений, создание игровых проектов и профессиональный дизайн.",
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

          <Header />
          {children}
          <Footer />

          <div id="modals" />
          <div id="overlay" style={overlayStyles}>
            <Particles variant={1} />
          </div>
        </AppProviders>
      </body>
    </html>
  </>);
}
