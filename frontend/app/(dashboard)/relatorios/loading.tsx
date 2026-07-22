import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function RelatoriosLoading() {
  return (
    <PageSkeleton
      cards={4}
      showChart
      rows={5}
    />
  );
}