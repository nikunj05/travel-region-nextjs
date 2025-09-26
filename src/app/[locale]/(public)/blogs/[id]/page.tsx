import BlogDetails from "@/components/BlogsPage/BlogDetails";
import React from "react";
import { use } from "react";


export default function BlogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = use(params);

  return <BlogDetails blogId={resolved.id} />;
}
