import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function RegistrosLoading() {
  return (
    <PageSkeleton
      cards={0}
      showChart={false}
      rows={7}
    />
  );
}