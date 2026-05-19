import type { JobCard } from "@job-search/shared";

const PLACEHOLDER_JOB: JobCard = {
  id: "placeholder-1",
  title: "Job Search Tool",
  company: "Forge",
  location: "Remote",
  postedAt: new Date().toISOString(),
};

export function App() {
  return (
    <main className="app">
      <h1>Job Search Tool</h1>
      <p>Monorepo scaffold — frontend placeholder</p>
      <article className="job-card">
        <h2>{PLACEHOLDER_JOB.title}</h2>
        <p>
          {PLACEHOLDER_JOB.company} · {PLACEHOLDER_JOB.location}
        </p>
      </article>
    </main>
  );
}
