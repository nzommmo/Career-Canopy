// DashboardStats.jsx - Dark Theme Stats and Filters
import { useEffect, useState } from "react";
import { Briefcase, Calendar, CheckCircle, XCircle, Search } from "lucide-react";
import API from "../../api";

export default function DashboardStats({ 
  activeFilter, 
  onFilterChange,
  searchQuery = "",
  onSearchChange,
  refreshTrigger = 0
}) {
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    offers: 0,
    rejected: 0,
    statuses: {
      APPLIED: 0,
      INTERVIEWING: 0,
      OFFER: 0,
      REJECTED: 0,
      WITHDRAWN: 0
    }
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await API.get("applications/summary/");
        setSummary(res.data);
      } catch (err) {
        console.error("Failed to fetch summary:", err);
      }
    };
    fetchSummary();
  }, [refreshTrigger]);

  const filters = [
    { id: "all", label: "All", count: summary.total },
    { id: "APPLIED", label: "Applied", count: summary.statuses.APPLIED || 0 },
    { id: "INTERVIEW_SCHEDULED", label: "Interview Scheduled", count: summary.statuses.INTERVIEW_SCHEDULED || 0 },
    { id: "INTERVIEWING", label: "Interviewing", count: summary.statuses.INTERVIEWING || 0 },
    { id: "OFFER", label: "Offer", count: summary.statuses.OFFER || 0 },
    { id: "REJECTED", label: "Rejected", count: summary.statuses.REJECTED || 0 },
    { id: "WITHDRAWN", label: "Withdrawn", count: summary.statuses.WITHDRAWN || 0 },
  ];

  return (
    <div className="mb-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Applications */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Applications</p>
              <p className="text-3xl font-bold text-white">{summary.total}</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Active</p>
              <p className="text-3xl font-bold text-white">{summary.active}</p>
            </div>
            <div className="bg-orange-500/10 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Offers */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Offers</p>
              <p className="text-3xl font-bold text-white">{summary.offers}</p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-white">{summary.rejected}</p>
            </div>
            <div className="bg-red-500/10 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs and Search */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-750 border border-gray-700"
              }`}
            >
              {filter.label}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeFilter === filter.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search applications..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-500 text-sm"
          />
        </div>
      </div>
    </div>
  );
}