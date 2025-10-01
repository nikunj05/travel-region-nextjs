import CmsPage from "@/components/CmsPage/CmsPage";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  return <CmsPage slug={resolvedParams.slug} />;
}
