import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18/routing";
import { AuthProvider } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/_rtl.scss";
import { settingsService } from "@/services/settingsService";
import SettingsHydrator from "@/components/SettingsHydrator";
import NextAuthSessionProvider from "@/context/NextAuthSessionProvider";
import LocaleHydrator from "@/context/LocaleHydrator";

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
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  // Get direction and language attributes
  const direction = getTextDirection(locale);
  const lang = getLanguageCode(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Fetch settings on server (cached, revalidate hourly)
  // const settingsRes = await settingsService.getSettingsCached();
  // const setting = settingsRes.data.setting;

  return (
    <html lang={lang} dir={direction}>
      {/* <head>
        <link rel="icon" href={setting.favicon} />
      </head> */}
      <body>
        <NextIntlClientProvider messages={messages}>
          <NextAuthSessionProvider>
            <AuthProvider>
              <LocaleHydrator locale={locale} />
              {/* <SettingsHydrator setting={setting} /> */}
              {children}
              <ToastContainer />
            </AuthProvider>
          </NextAuthSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
