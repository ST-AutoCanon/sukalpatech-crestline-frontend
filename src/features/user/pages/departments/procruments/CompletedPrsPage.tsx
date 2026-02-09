import ViewPRPage from "./getAll_procurements";

export default function CompletedPRs({ search, refreshKey }: any) {
  return (
    <ViewPRPage
      filter="APPROVED"
      search={search}
      refreshKey={refreshKey}
    />
  );
}
