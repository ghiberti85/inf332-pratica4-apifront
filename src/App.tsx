// Frontend React Application for VagaGO using TypeScript

import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./App.css";

// Define Job Type
interface Job {
  id: number;
  title: string;
  company_name: string;
  location: string;
  required_skills: string[];
  expertise: string;
  job_type: string[];
  level: string;
  description?: string;
  salary?: string;
  published_date?: string;
  url?: string;
}

// Define Filters Type
interface Filters {
  skills: string;
  expertise: string;
}

const API_BASE_URL = "http://localhost:8000";

// Mock Data
const MOCK_JOBS: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    company_name: "TechCorp",
    location: "Remote",
    required_skills: ["React", "JavaScript", "CSS"],
    expertise: "Mid",
    description: "Develop user interfaces for modern web applications.",
    salary: "$70,000 - $90,000",
    published_date: "2023-01-15T00:00:00Z",
    job_type: ["Full-time"],
    level: "Intermediate",
    url: "https://example.com/job/1",
  },
  {
    id: 2,
    title: "Backend Developer",
    company_name: "CodeBase",
    location: "New York",
    required_skills: ["Node.js", "MongoDB", "Express"],
    expertise: "Senior",
    description: "Implement and maintain backend systems.",
    salary: "$90,000 - $120,000",
    published_date: "2023-01-20T00:00:00Z",
    job_type: ["Contract"],
    level: "Expert",
    url: "https://example.com/job/2",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company_name: "DesignHub",
    location: "San Francisco",
    required_skills: ["Figma", "Adobe XD", "Sketch"],
    expertise: "Junior",
    description: "Create intuitive designs for applications.",
    salary: "$60,000 - $80,000",
    published_date: "2023-01-25T00:00:00Z",
    job_type: ["Part-time"],
    level: "Beginner",
    url: "https://example.com/job/3",
  },
];

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<Filters>({ skills: "", expertise: "" });
  const [useMockData, setUseMockData] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const expertiseAliases: Record<string, string[]> = {
    Beginner: ["Beginner", "Junior", "Júnior", "junio", "jr"],
    Intermediate: ["Intermediate", "Mid", "Mid Level", "Pleno"],
    Expert: ["Expert", "Senior", "Sênior", "Sr"],
  };

  // Fetch jobs from API or use mock data
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

  // Handle filter change
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Open modal with job details
  const openModal = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options).replace(/\//g, "/");
  };

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const skillsMatch = job.required_skills.join(" ").toLowerCase().includes(filters.skills.toLowerCase());
    const expertiseMatch = filters.expertise
      ? expertiseAliases[filters.expertise]?.some((alias) => job.level.toLowerCase().includes(alias.toLowerCase()))
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
          name="expertise"
          value={filters.expertise}
          onChange={handleFilterChange}
          className="select"
        >
          <option value="">Select expertise level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
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
          <p><strong>Job Type:</strong> {selectedJob.job_type.join(", ")}</p>
          <p><strong>Description:</strong> {selectedJob.description}</p>
          <p><strong>Salary:</strong> {selectedJob.salary}</p>
          <p><strong>Posted Date:</strong> {selectedJob.published_date ? formatDate(selectedJob.published_date) : "N/A"}</p>
          <p><strong>Link:</strong> <a href={selectedJob.url} target="_blank" rel="noopener noreferrer">View Job Posting</a></p>
          <button onClick={closeModal} style={{ marginTop: "20px", display: "block", width: "15%" }}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default App;
