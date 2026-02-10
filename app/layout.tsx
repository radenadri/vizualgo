import type { Metadata, Viewport } from "next";
import type { PropsWithChildren } from "react";
import "./index.css";
import Script from "next/script";

const APP_NAME = "VizualGo";
const APP_DEFAULT_TITLE = "VizualGo";
const APP_TITLE_TEMPLATE = "%s | VizualGo";
const APP_DESCRIPTION =
  "Interactive algorithm visualizer for sorting, pathfinding, and data structures. Learn how algorithms work through step-by-step animations.";
const APP_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_BASE_URL),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    url: APP_BASE_URL,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "VizualGo - Algorithm Visualizer",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  authors: [{ name: "Adriana Eka Prayudha", url: "https://radenadri.xyz" }],
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: PropsWithChildren) {
  const projectId = "vfawnimyld";

  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
      <Script
        id="microsoft-clarity-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(c,l,a,r,i,t,y){
                      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                  })(window, document, "clarity", "script", "${projectId}");`,
        }}
      />
    </html>
  );
}
