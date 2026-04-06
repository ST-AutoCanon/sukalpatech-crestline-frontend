import React, { useState } from "react";
import { Plus } from "lucide-react";
// import AllPRs from "../req_pages/requestpages";
import AllPRs from "../req_pages/ViewPRPage";
import Procurement from "./Procurement";
import FinanceApprovedPR from "./ProcurementFinanceApprovedPRs";

const filters = ["PR Raised", "Pending", "Rejected", "Completed"] as const;

const ProcurementPage: React.FC = () => {
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]>("PR Raised");

  const [openCreatePR, setOpenCreatePR] = useState(false);
  const [showUpdatePage, setShowUpdatePage] = useState(false);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); // 🔥 IMPORTANT

  return (
    <>
      {/* ================= FILTER BAR ================= */}
      <div className="mt-6 px-6 py-4">
        <div className="flex flex-wrap sm:flex-nowrap sm:justify-between sm:items-center gap-2 sm:gap-0">

          {/* FILTER TABS */}
          <div className="flex flex-wrap gap-3 sm:gap-7 text-sm font-medium text-white">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setShowUpdatePage(false);
                }}
                className={`pb-1 ${activeFilter === filter
                    ? "border-b-2 border-white text-white"
                    : "text-white/70"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-2 sm:gap-4 flex-shrink-0">
            <button
              onClick={() => setShowUpdatePage(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded text-white whitespace-nowrap"
            >
              Update PR
            </button>

            <button
              onClick={() => setOpenCreatePR(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded text-white flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={16} />
              Create New PR
            </button>
          </div>
        </div>
      </div>



      {/* ================= PR LIST ================= */}
{!showUpdatePage && (
  <AllPRs filter={activeFilter} search={search} refreshKey={refreshKey} />
)}


      {/* ================= UPDATE PAGE ================= */}
      {showUpdatePage && (
        <FinanceApprovedPR onClose={() => setShowUpdatePage(false)} />
      )}

      {/* ================= CREATE MODAL ================= */}
      {openCreatePR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Procurement
            onClose={() => setOpenCreatePR(false)}
            onCreated={() => {
              setRefreshKey((prev) => prev + 1); // 🔥 FORCE RELOAD
              setOpenCreatePR(false);
            }}
          />
        </div>
      )}
    </>
  );
};

export default ProcurementPage;
