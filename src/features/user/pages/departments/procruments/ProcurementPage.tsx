


import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import AllPRs from "./getAll_procurements";
import Procurement from "./Procurement";
import FinanceApprovedPR from "./ProcurementFinanceApprovedPRs";

const filters = ["PR Raised", "Pending", "Rejected", "Completed"] as const;

const ProcurementPage: React.FC = () => {
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]>("PR Raised");

  const [openCreatePR, setOpenCreatePR] = useState(false);
  const [showUpdatePage, setShowUpdatePage] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <>
      {/* ================= FILTER BAR ================= */}
      <div className="mt-6 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* LEFT FILTERS */}
          <div className="flex gap-8 text-sm font-medium text-white">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setShowUpdatePage(false); // <<< IMPORTANT FIX
                }}
                className={`relative pb-1 transition-all ${
                  activeFilter === filter
                    ? "font-semibold text-white after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex items-center gap-4">
          

            {/* UPDATE PR PAGE BUTTON */}
            <button
              onClick={() => setShowUpdatePage(true)}
              className="
                 flex items-center gap-2
                rounded-lg
                bg-gradient-to-r from-blue-500 to-purple-600
                px-5 py-2.5
                text-sm font-medium text-white
                shadow-md
                hover:from-blue-600 hover:to-purple-700
                transition
              "
            >
              Update PR
            </button>

            {/* CREATE NEW PR */}
            <button
              onClick={() => setOpenCreatePR(true)}
              className="
                flex items-center gap-2
                rounded-lg
                bg-gradient-to-r from-blue-500 to-purple-600
                px-5 py-2.5
                text-sm font-medium text-white
                shadow-md
                hover:from-blue-600 hover:to-purple-700
                transition
              "
            >
              <Plus size={16} />
              Create New PR
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}

      {/* VIEW ALL PRs */}
      {!showUpdatePage && (
        <div className="mt-6">
          <AllPRs filter={activeFilter} search={search} />
        </div>
      )}

      {/* UPDATE PAGE */}
      {showUpdatePage && (
        <FinanceApprovedPR onClose={() => setShowUpdatePage(false)} />
      )}

      {/* ================= CREATE MODAL ================= */}
      {openCreatePR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Procurement onClose={() => setOpenCreatePR(false)} />
        </div>
      )}
    </>
  );
};

export default ProcurementPage;
