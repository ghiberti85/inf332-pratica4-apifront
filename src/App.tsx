// Frontend React Application for VagaGO using TypeScript

import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./App.css"; // Add a CSS file for custom styles

// Define Job Type
interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  skills: string[];
  expertise: string;
  description?: string;
  salary?: string;
  postedDate?: string;
}

// Define Filters Type
interface Filters {
  skills: string;
  expertise: string;
}

const API_BASE_URL = "https://app.swaggerhub.com/apis/inf332-grupo01-final/VagaGO-API/1.0.0";

// Mock Data
const MOCK_JOBS: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "Remote",
    skills: ["React", "JavaScript", "CSS"],
    expertise: "Mid",
    description: "Develop user interfaces for modern web applications.",
    salary: "$70,000 - $90,000",
    postedDate: "2023-01-15",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "CodeBase",
    location: "New York",
    skills: ["Node.js", "MongoDB", "Express"],
    expertise: "Senior",
    description: "Implement and maintain backend systems.",
    salary: "$90,000 - $120,000",
    postedDate: "2023-01-20",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "DesignHub",
    location: "San Francisco",
    skills: ["Figma", "Adobe XD", "Sketch"],
    expertise: "Junior",
    description: "Create intuitive designs for applications.",
    salary: "$60,000 - $80,000",
    postedDate: "2023-01-25",
  },
];

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<Filters>({ skills: "", expertise: "" });
  const [useMockData, setUseMockData] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const skillsMatch = job.skills.join(" ").toLowerCase().includes(filters.skills.toLowerCase());
    const expertiseMatch = filters.expertise ? job.expertise === filters.expertise : true;
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
          <option value="Junior">Junior</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
        </select>
      </div>

      <div className="jobs-grid">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card" onClick={() => openModal(job)}>
            <h2 className="job-title">{job.title}</h2>
            <p className="job-info"><strong>Company:</strong> {job.company}</p>
            <p className="job-info"><strong>Location:</strong> {job.location}</p>
            <p className="job-info"><strong>Skills:</strong> {job.skills.join(", ")}</p>
            <p className="job-info"><strong>Expertise:</strong> {job.expertise}</p>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && <p className="no-results">No jobs match the selected filters.</p>}

      {selectedJob && (
        <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Job Details">
          <h2>{selectedJob.title}</h2>
          <p><strong>Company:</strong> {selectedJob.company}</p>
          <p><strong>Location:</strong> {selectedJob.location}</p>
          <p><strong>Skills:</strong> {selectedJob.skills.join(", ")}</p>
          <p><strong>Expertise:</strong> {selectedJob.expertise}</p>
          <p><strong>Description:</strong> {selectedJob.description}</p>
          <p><strong>Salary:</strong> {selectedJob.salary}</p>
          <p><strong>Posted Date:</strong> {selectedJob.postedDate}</p>
          <button onClick={closeModal}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default App;
