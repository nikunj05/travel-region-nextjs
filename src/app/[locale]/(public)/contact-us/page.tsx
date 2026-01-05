import { ContactUs } from "@/components/ContactUs/ContactUs";
// import { getTranslations } from "next-intl/server";
// import { Metadata } from 'next';

// export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
//     const t = await getTranslations({ locale, namespace: 'Contact' });

//     return {
//         title: t('title'),
//         description: t('description'),
//     };
// }

export default function ContactUsPage() {
    return <ContactUs />;
}
