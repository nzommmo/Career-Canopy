// DashHome.jsx - Updated with Secure Downloads
import { useEffect, useState } from "react";
import API from "../../api";
import Main from "../Dashboard/Main";
import AddApplication from "../Dashboard/AddApplication";
import EditApplication from "../Dashboard/EditApplication";
import DashboardStats from "./DashboardStats";
import { Pencil, Trash2, Calendar, FileText, Download } from "lucide-react";

export default function DashHome() {
  const [applications, setApplications] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshStats, setRefreshStats] = useState(0);
  const [user, setUser] = useState(null);

  const fetchApplications = async () => {
    try {
      const res = await API.get("applications/");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await API.get("users/me/");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchUser();
  }, []);

  const handleModalSuccess = () => {
    fetchApplications();
    setRefreshStats(prev => prev + 1);
  };

  const handleEdit = (app) => {
    setSelectedApplication(app);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (appId) => {
    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }

    try {
      await API.delete(`applications/${appId}/`);
      fetchApplications();
      setRefreshStats(prev => prev + 1);
    } catch (err) {
      console.error("Failed to delete application:", err);
      alert("Failed to delete application. Please try again.");
    }
  };

  const handleDownload = async (appId, fileType) => {
    try {
      const endpoint = fileType === 'resume' 
        ? `applications/${appId}/resume/` 
        : `applications/${appId}/cover-letter/`;
      
      const response = await API.get(endpoint, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      let filename = fileType === 'resume' ? 'resume.pdf' : 'cover-letter.pdf';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`Failed to download ${fileType}:`, err);
      alert(`Failed to download ${fileType}. Please try again.`);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (activeFilter !== "all" && app.status !== activeFilter) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        app.company_name.toLowerCase().includes(query) ||
        app.position.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const statusColors = {
    APPLIED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    INTERVIEW_SCHEDULED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    INTERVIEWING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    OFFER: "bg-green-500/20 text-green-400 border-green-500/30",
    REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
    WITHDRAWN: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  const statusIcons = {
    APPLIED: "📋",
    INTERVIEW_SCHEDULED: "📅",
    INTERVIEWING: "💼",
    OFFER: "🎉",
    REJECTED: "❌",
    WITHDRAWN: "↩️",
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Main>
      {/* Greeting */}
      {user && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-1">
            {getGreeting()}, {user.first_name}! 👋
          </h1>
          <p className="text-gray-400">
            Here's an overview of your job applications
          </p>
        </div>
      )}

      {/* Header with Add Button */}
      <div className="flex lg:flex-row flex-col justify-between lg:items-center items-start mb-6">
        <h2 className="text-2xl font-bold text-white">My Applications</h2>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 lg:my-0 my-4 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span className="text-lg">+</span>
          <span>Add Application</span>
        </button>
      </div>

      {/* Stats and Filter Component */}
      <DashboardStats
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        refreshTrigger={refreshStats}
      />

      {/* Applications Grid */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
          <p className="text-gray-400 mb-4">
            {applications.length === 0
              ? "No applications yet. Start by adding one."
              : "No applications match your current filter."}
          </p>
          {applications.length === 0 && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Add Your First Application
            </button>
          )}
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApplications.map((app) => (
            <li
              key={app.id}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition relative group"
            >
              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(app)}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-1.5 rounded transition"
                  title="Edit application"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1.5 rounded transition"
                  title="Delete application"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Company Icon and Name */}
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-blue-500/10 p-2.5 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white truncate">
                    {app.company_name}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">{app.position}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-3">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border ${
                    statusColors[app.status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
                  }`}
                >
                  <span>{statusIcons[app.status] || "📄"}</span>
                  {app.status.replace("_", " ")}
                </span>
              </div>

              {/* Application Date */}
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                <Calendar className="w-4 h-4" />
                <span>{new Date(app.application_date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}</span>
              </div>

              {/* Documents */}
              <div className="flex gap-2 pt-3 border-t border-gray-800">
                {app.resume && (
                  <button
                    onClick={() => handleDownload(app.id, 'resume')}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-400 transition cursor-pointer"
                    title="Download resume"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[100px]">
                      {app.resume.split('/').pop().split('_').slice(1).join('_') || 'Resume'}
                    </span>
                    <Download className="w-3 h-3" />
                  </button>
                )}
                {app.cover_letter && (
                  <button
                    onClick={() => handleDownload(app.id, 'cover_letter')}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-400 transition cursor-pointer"
                    title="Download cover letter"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[100px]">
                      {typeof app.cover_letter === 'string' && app.cover_letter.includes('/') 
                        ? app.cover_letter.split('/').pop().split('_').slice(1).join('_') 
                        : 'Cover Letter'}
                    </span>
                    <Download className="w-3 h-3" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add Application Modal */}
      <AddApplication
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      {/* Edit Application Modal */}
      <EditApplication
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleModalSuccess}
        application={selectedApplication}
      />
    </Main>
  );
}