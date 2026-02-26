import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/Navbar";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "vi" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html
        lang={locale}
        className={`${inter.variable} ${jetbrainsMono.variable}`}
      >
        <head>
          <title>VizStack — Interactive 3D Tech Education</title>
          <meta
            name="description"
            content="Learn tech stacks through interactive 3D visualizations. Master Next.js, React, Node.js and more by seeing how they work from the inside."
          />
        </head>
        <body>
          <ConvexClientProvider>
            <NextIntlClientProvider messages={messages}>
              <Navbar />
              <main>{children}</main>
            </NextIntlClientProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
