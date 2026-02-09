import ViewPRPage from "./getAll_procurements";

export default function RejectedPRs({ search, refreshKey }: any) {
  return (
    <ViewPRPage
      filter="REJECTED"
      search={search}
      refreshKey={refreshKey}
    />
  );
}
