import ViewPRPage from "./getAll_procurements";

export default function PendingPRs({ search, refreshKey }: any) {
  return (
    <ViewPRPage
      filter="PENDING"
      search={search}
      refreshKey={refreshKey}
    />
  );
}
