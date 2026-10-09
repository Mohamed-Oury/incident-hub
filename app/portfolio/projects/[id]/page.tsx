import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PortfolioProjectRedirect({ params }: PageProps) {
  const { id } = await params;
  redirect(`/projets/${id}`);
}
