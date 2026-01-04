// AddApplicationModal.jsx - Dark Theme with Interview Rounds
import { useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import API from "../../api";

export default function AddApplicationModal({ isOpen, onClose, onSuccess }) {
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [applicationDate, setApplicationDate] = useState("");
  const [status, setStatus] = useState("APPLIED");
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [notes, setNotes] = useState("");
  const [interviewRounds, setInterviewRounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addInterviewRound = () => {
    setInterviewRounds([
      ...interviewRounds,
      {
        id: Date.now(),
        interview_type: "TECHNICAL",
        interview_date: "",
        notes: ""
      }
    ]);
  };

  const removeInterviewRound = (id) => {
    setInterviewRounds(interviewRounds.filter(round => round.id !== id));
  };

  const updateInterviewRound = (id, field, value) => {
    setInterviewRounds(interviewRounds.map(round =>
      round.id === id ? { ...round, [field]: value } : round
    ));
  };

  const handleSubmit = async () => {
    if (!companyName || !position || !applicationDate) {
      setError("Please fill in all required fields");
      return;
    }

    for (const round of interviewRounds) {
      if (!round.interview_date) {
        setError("Please fill in all interview dates");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("company_name", companyName);
      formData.append("position", position);
      formData.append("application_date", applicationDate);
      formData.append("status", status);
      formData.append("notes", notes);

      if (resume) {
        formData.append("resume", resume);
      }
      if (coverLetter) {
        formData.append("cover_letter", coverLetter);
      }

      const appResponse = await API.post("applications/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const applicationId = appResponse.data.id;

      for (const round of interviewRounds) {
        await API.post(`applications/${applicationId}/interviews/`, {
          interview_type: round.interview_type,
          interview_date: round.interview_date,
          notes: round.notes
        });
      }

      setCompanyName("");
      setPosition("");
      setApplicationDate("");
      setStatus("APPLIED");
      setResume(null);
      setCoverLetter(null);
      setNotes("");
      setInterviewRounds([]);
      setError("");

      onSuccess();
      onClose();
    } catch (err) {
    console.error(err.response?.data);
    setError(JSON.stringify(err.response?.data, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm shadow-2xl bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center rounded-t-lg z-10">
          <h2 className="text-xl font-semibold text-white">Add New Application</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 text-red-400 bg-red-900/20 p-3 rounded-md border border-red-800">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-500"
                placeholder="Google, Meta, etc."
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-500"
                placeholder="Software Engineer"
              />
            </div>

            {/* CV / Resume */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                CV / Resume
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResume(e.target.files[0])}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="w-full bg-gray-800 border border-gray-700 text-gray-400 rounded-md p-2.5 flex items-center justify-center cursor-pointer hover:bg-gray-750 transition"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {resume ? resume.name : "Upload CV"}
                  </span>
                </label>
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Cover Letter
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCoverLetter(e.target.files[0])}
                  className="hidden"
                  id="cover-letter-upload"
                />
                <label
                  htmlFor="cover-letter-upload"
                  className="w-full bg-gray-800 border border-gray-700 text-gray-400 rounded-md p-2.5 flex items-center justify-center cursor-pointer hover:bg-gray-750 transition"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {coverLetter ? coverLetter.name : "Upload Cover Letter"}
                  </span>
                </label>
              </div>
            </div>

            {/* Application Date */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Application Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEWING">Interviewing</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
                <option value="WITHDRAWN">Withdrawn</option>
              </select>
            </div>
          </div>

          {/* Interview Rounds */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-300">
                Interview Rounds
              </label>
              <button
                onClick={addInterviewRound}
                className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium px-3 py-1.5 bg-gray-800 rounded-md border border-gray-700 hover:border-blue-500 transition"
              >
                <Plus className="w-4 h-4" />
                Add Round
              </button>
            </div>

            {interviewRounds.length > 0 && (
              <div className="space-y-3">
                {interviewRounds.map((round) => (
                  <div key={round.id} className="border border-gray-700 rounded-md p-3 bg-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-400">
                          Type
                        </label>
                        <select
                          value={round.interview_type}
                          onChange={(e) => updateInterviewRound(round.id, "interview_type", e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 text-white rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="TECHNICAL">Technical</option>
                          <option value="BEHAVIORAL">Behavioral</option>
                          <option value="HR">HR</option>
                          <option value="ONSITE">Onsite</option>
                          <option value="PHONE">Phone Screen</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-400">
                          Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={round.interview_date}
                          onChange={(e) => updateInterviewRound(round.id, "interview_date", e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 text-white rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => removeInterviewRound(round.id)}
                          className="w-full bg-red-900/30 hover:bg-red-900/50 text-red-400 p-2 rounded-md transition flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none placeholder-gray-500"
              placeholder="Additional notes about this application..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition font-medium"
            >
              {loading ? "Saving..." : "Save Application"}
            </button>

            <button
              onClick={onClose}
              disabled={loading}
              className="border border-gray-700 text-gray-300 px-6 py-2.5 rounded-md hover:bg-gray-800 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}