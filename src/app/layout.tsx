import type { Metadata } from "next";
import SocketProvider from "../contexts/socketContext";
import ControllerProvider from "@/contexts/controllerContext";
import AuthProvider from "@/contexts/authContext";
import CourseProvider from "@/contexts/courseContext";
import BotProvider from "@/contexts/botContext";
import BotVisitProvider from "@/contexts/botVisitContext";
import RegisteredUsersProvider from "@/contexts/registeredUsersContext";
import TransactionProvider from "@/contexts/transactionContext";
import BotSupportProvider from "@/contexts/botSupportContext";
import MainResponsive from "@/components/main_responsive";
import LicenseProvider from "@/contexts/licenseContext";
import PaymentProvider from "@/contexts/paymentContext";
import FileProvider from "@/contexts/fileContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import CooperationSalesProvider from "@/contexts/cooperationSaleContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://spotseller.ir"),
  title: "Spot Seller - اسپات سلر",
  description: "سرویس مدیریت اسپات پلیر",
  icons: "/icon.svg",
  authors: [{ name: "nima", url: "https://github.com/nimamoosa/" }],
  creator: "pixel",
  keywords: [
    "spot",
    "seller",
    "اسپات",
    "سلر",
    "اسپات سلر",
    "spot seller",
    "اسپات سلر",
    "spot",
    "seller",
    "اسپات",
    "سلر",
    "اسپات سلر",
    "spot seller",
    "اسپات سلر",
  ],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://spotseller.ir",
    siteName: "Spot Seller",
    title: "Spot Seller - اسپات سلر",
    description: "سرویس مدیریت اسپات پلیر",
    images: [
      {
        url: "/Frame 1.jpg",
        width: 1080,
        height: 1080,
        alt: "SpotSeller",
      },
    ],
    phoneNumbers: ["+989131695571"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="rtl">
      <body
        className={`min-h-full flex items-center font-sans justify-center overflow-hidden bg-[#CEBEE4] text-black`}
      >
        <head>
          <link rel="preload" href="/logo.png" as="image" />
        </head>

        <ControllerProvider>
          <SocketProvider>
            <AuthProvider>
              <CourseProvider>
                <BotProvider>
                  <BotVisitProvider>
                    <RegisteredUsersProvider>
                      <BotSupportProvider>
                        <TransactionProvider>
                          <LicenseProvider>
                            <PaymentProvider>
                              <FileProvider>
                                <CooperationSalesProvider>
                                  <MainResponsive>
                                    {children}
                                    <Analytics />
                                    <SpeedInsights />
                                  </MainResponsive>
                                </CooperationSalesProvider>
                              </FileProvider>
                            </PaymentProvider>
                          </LicenseProvider>
                        </TransactionProvider>
                      </BotSupportProvider>
                    </RegisteredUsersProvider>
                  </BotVisitProvider>
                </BotProvider>
              </CourseProvider>
            </AuthProvider>
          </SocketProvider>
        </ControllerProvider>
      </body>
    </html>
  );
}
