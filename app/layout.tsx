// app/layout.tsx
import { Poppins } from "next/font/google";
import "./globals.css";
import AppProvider from "@/Provider/AppProvider";
import LayoutShell from "./layout-shell";
import { SocketProvider } from "@/Provider/SocketProvider";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import StripeProvider from "@/components/pyment/StripeProvider";
import ScrollToTop from "@/hooks/scrolltotop";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Walk Throughz",
  description:
    "Discover what truly makes your city special with Walk Throughz through short, personal experiences led by the people who shape it.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Walk Throughz",
    description:
      "See your city differently through authentic, small-group experiences hosted by the people who bring it to life.",
    url: "https://walkthroughz.com",
    siteName: "Walk Throughz",
    images: [
      {
        url: "https://res.cloudinary.com/dftvlksve/image/upload/v1756129458/Image20250819174530_hjqear.jpg",
        width: 1200,
        height: 630,
        alt: "Walk Throughz preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Walk Throughz",
    description:
      "Discover new perspectives and experience your city in a new way with Walk Throughz.",
    images: [
      "https://res.cloudinary.com/dftvlksve/image/upload/v1756129458/Image20250819174530_hjqear.jpg",
    ],
    creator: "@walkthroughz",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  return (
    <html lang="en" className="hyphens-auto">
      <body
        className={`${poppins.variable} font-poppins antialiased bg-[var(--site-bg)] text-[var(--site-muted-strong)]`}
      >
        {paypalClientId && (
          <Script
            src={`https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=EUR&intent=capture&disable-funding=paylater,venmo`}
            data-sdk-integration-source="button-factory"
            strategy="afterInteractive"
          />
        )}

        <AppProvider>
          <SocketProvider>
            <Toaster position="top-right" />
            <ScrollToTop />
            <LayoutShell>
              <StripeProvider>{children}</StripeProvider>
            </LayoutShell>
          </SocketProvider>
        </AppProvider>
      </body>
    </html>
  );
}
