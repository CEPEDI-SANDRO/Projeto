import { PageSkeleton } from "@/components/common/PageSkeleton";

export default function FuncionariosLoading() {
  return (
    <PageSkeleton
      cards={0}
      showChart={false}
      rows={6}
    />
  );
}