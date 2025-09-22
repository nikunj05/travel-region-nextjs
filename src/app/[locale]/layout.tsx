import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18/routing";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/_rtl.scss";

// Function to determine text direction based on locale
function getTextDirection(locale: string): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

// Function to get language code for lang attribute
function getLanguageCode(locale: string): string {
  return locale === 'ar' ? 'ar' : 'en';
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Get direction and language attributes
  const direction = getTextDirection(locale);
  const lang = getLanguageCode(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={lang} dir={direction}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            {children}
            <ToastContainer />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
