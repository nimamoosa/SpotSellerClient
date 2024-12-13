import type { Metadata } from "next";
import SocketProvider from "../contexts/socketContext";
import ControllerProvider from "@/contexts/controllerContext";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/toast";
import AuthProvider from "@/contexts/authContext";
import CourseProvider from "@/contexts/courseContext";
import BotProvider from "@/contexts/botContext";
import BotVisitProvider from "@/contexts/botVisitContext";
import RegisteredUsersProvider from "@/contexts/registeredUsersContext";
import TransactionProvider from "@/contexts/transactionContext";
import BotSupportProvider from "@/contexts/botSupportContext";
import "./globals.css";
import MainResponsive from "@/components/main_responsive";
import LicenseProvider from "@/contexts/licenseContext";
import PaymentProvider from "@/contexts/paymentContext";

export const metadata: Metadata = {
  title: "Spot Seller - اسپات سلر",
  description: "سرویس مدیریت اسپات پلیر",
  // icons: "/icon.svg",
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
        <ToastProvider>
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
                              <ControllerProvider>
                                <MainResponsive>
                                  {children}
                                  <Toaster />
                                </MainResponsive>
                              </ControllerProvider>
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
        </ToastProvider>
      </body>
    </html>
  );
}
