import CmsPage from '@/components/CmsPage/CmsPage'

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  return <CmsPage slug={slug} />
}