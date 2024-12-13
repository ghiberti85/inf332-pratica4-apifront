import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./App.css";

interface Job {
  id: number;
  title: string;
  company_name: string;
  location: string;
  required_skills: string[];
  level: string;
  job_type: string[];
  description?: string;
  salary?: string;
  published_date?: string;
  url?: string;
}

interface Filters {
  skills: string;
  level: string;
}

const API_BASE_URL = "http://localhost:8000";

const MOCK_JOBS: Job[] = [
  // Your mock data here
];

// Map for expertise level synonyms
const LEVEL_SYNONYMS: Record<string, string[]> = {
  "Junior": ["Junior", "Júnior", "junio", "jr"],
  "Mid": ["Mid", "Mid Level", "Pleno"],
  "Senior": ["Senior", "Sênior", "Sr"]
};

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<Filters>({ skills: "", level: "" });
  const [useMockData, setUseMockData] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchJobs = async () => {
    if (useMockData) {
      setJobs(MOCK_JOBS);
      return;
    }

    try {
      const response = await axios.get<Job[]>(`${API_BASE_URL}/jobs`);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [useMockData]);

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const openModal = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
  };

  const filteredJobs = jobs.filter((job) => {
    const skillsMatch = job.required_skills
      .join(" ")
      .toLowerCase()
      .includes(filters.skills.toLowerCase());

    const expertiseMatch = filters.level
      ? LEVEL_SYNONYMS[filters.level]?.some((synonym) =>
          job.level.toLowerCase().includes(synonym.toLowerCase())
        )
      : true;

    return skillsMatch && expertiseMatch;
  });

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">VagaGO Job Listings</h1>
      </header>

      <div className="toggle-container">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={useMockData}
            onChange={() => setUseMockData(!useMockData)}
          />
          <span>Use Mock Data</span>
        </label>
      </div>

      <div className="filters-container">
        <input
          type="text"
          name="skills"
          placeholder="Filter by skills"
          value={filters.skills}
          onChange={handleFilterChange}
          className="input"
        />
        <select
          name="level"
          value={filters.level}
          onChange={handleFilterChange}
          className="select"
        >
          <option value="">Select expertise level</option>
          <option value="Junior">Junior</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
        </select>
      </div>

      <div className="jobs-grid">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card" onClick={() => openModal(job)}>
            <h2 className="job-title">{job.title}</h2>
            <p className="job-info"><strong>Company:</strong> {job.company_name}</p>
            <p className="job-info"><strong>Location:</strong> {job.location}</p>
            <p className="job-info"><strong>Skills:</strong> {job.required_skills.join(", ")}</p>
            <p className="job-info"><strong>Level:</strong> {job.level}</p>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && <p className="no-results">No jobs match the selected filters.</p>}

      {selectedJob && (
        <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Job Details">
          <h2>{selectedJob.title}</h2>
          <p><strong>Company:</strong> {selectedJob.company_name}</p>
          <p><strong>Location:</strong> {selectedJob.location}</p>
          <p><strong>Skills:</strong> {selectedJob.required_skills.join(", ")}</p>
          <p><strong>Level:</strong> {selectedJob.level}</p>
          <p><strong>Description:</strong> {selectedJob.description}</p>
          <p><strong>Salary:</strong> {selectedJob.salary}</p>
          <p><strong>Posted Date:</strong> {selectedJob.published_date}</p>
          <button onClick={closeModal}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default App;
