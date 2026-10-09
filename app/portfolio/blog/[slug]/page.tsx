import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PortfolioBlogRedirect({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/blog/${slug}`);
}
