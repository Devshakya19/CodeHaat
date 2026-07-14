import { BrowsePage } from "@/features/browse";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  return <BrowsePage searchParams={searchParams} />;
}
