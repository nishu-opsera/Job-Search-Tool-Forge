import { sampleJobCard } from "@job-search/shared";

export function App() {
  return (
    <main className="app">
      <h1>Job Search Tool</h1>
      <p>Monorepo scaffold — frontend placeholder</p>
      <article className="job-card">
        <h2>{sampleJobCard.title}</h2>
        <p>
          {sampleJobCard.companyName} · {sampleJobCard.workArrangement}
        </p>
        <p>Match score: {sampleJobCard.matchScore}</p>
      </article>
    </main>
  );
}
