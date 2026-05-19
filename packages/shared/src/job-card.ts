/** Placeholder job listing card used by frontend and backend. */
export interface JobCard {
  id: string;
  title: string;
  company: string;
  location: string;
  postedAt: string;
}

export interface JobCardFilters {
  query?: string;
  location?: string;
}
