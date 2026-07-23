import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function ExportarLoading() {
  return (
    <PageSkeleton
      cards={0}
      rows={0}
      showChart
    />
  );
}