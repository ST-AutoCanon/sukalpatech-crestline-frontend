import { useState } from "react";
import AllPRs from "../req_pages/requestpages";
import FinanceApprovedPR from "../finance/UpdateFinance";
import ViewPR from "./ViewFinanceRequests";

const filters = ["All PR", "Pending", "Rejected", "Completed"] as const;
type FilterType = (typeof filters)[number];

const FinancePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All PR");
  const [showUpdatePage, setShowUpdatePage] = useState(false);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="px-4 sm:px-6 w-full">
      {/* ================= FILTER BAR ================= */}
      <div className="mt-6 py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
          {/* FILTER TABS */}
          <div className="flex overflow-x-auto gap-3 sm:gap-1 text-sm font-medium text-white w-full sm:w-auto">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setShowUpdatePage(false);
                }}
                className={` pb-1 px-2 sm:px-4  ${activeFilter === filter
                  ? "border-b-2 border-white text-white"
                  : "text-white/70 "
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* UPDATE PR BUTTON */}
          <div className="flex gap-2 sm:gap-4 w-full sm:w-auto justify-start sm:justify-end mt-2 sm:mt-0">
            <button
              onClick={() => setShowUpdatePage(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded text-white w-full sm:w-auto whitespace-nowrap"
            >
              Update PR
            </button>
          </div>
        </div>
      </div>

      {/* ================= PR LIST ================= */}
      {!showUpdatePage && (
        <div className="overflow-x-hidden">
          <ViewPR
            status={
  activeFilter === "All PR"
    ? "ALL"
    : activeFilter === "Completed"
      ? "APPROVED"
      : activeFilter.toUpperCase() as "PENDING" | "REJECTED"
}
          />
        </div>
      )}

      {/* ================= UPDATE PAGE ================= */}
      {showUpdatePage && (
        <FinanceApprovedPR onClose={() => setShowUpdatePage(false)} />
      )}
    </div>
  );
};

export default FinancePage;
