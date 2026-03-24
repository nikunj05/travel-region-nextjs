import HomePage from '@/components/HomePage/HomePage';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  
  const baseUrl = 'https://travelregions.sa';
  const canonicalUrl = `${baseUrl}/${locale}/`;

  const alternates = {
    canonical: canonicalUrl,
    languages: {
      'ar': `${baseUrl}/ar/`,
      'en': `${baseUrl}/en/`,
      'x-default': `${baseUrl}/`,
    },
  };

  if (locale === 'ar') {
    return {
      title: 'مناطق السفر | حجز الفنادق بأفضل قيمة',
      description:
        'مناطق السفر منصة مختصه في حجز الفنادق مع اختيار دقيق لأفضل قيمة لضمان تجربة إقامة مريحة بأسعار مناسبة',
      alternates,
    };
  }

  return {
    title: 'Travel Regions | Carefully Selected Hotels with Best Value',
    description:
      'Travel Regions is a hotel booking platform offering carefully selected hotels with great value and comfortable stays',
    alternates,
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const siteName = locale === 'ar' ? 'مناطق السفر' : 'Travel Regions';
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: 'https://travelregions.sa/',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage />
    </>
  );
}