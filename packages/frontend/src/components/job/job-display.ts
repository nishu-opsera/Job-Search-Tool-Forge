export function formatSalaryRange(
  min: number,
  max: number,
  currency: string,
): string {
  if (min === 0 && max === 0) {
    return "Salary not specified";
  }

  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 0,
  });

  return `${formatter.format(min)} – ${formatter.format(max)} ${currency}`;
}

export function formatWorkArrangement(value: string): string {
  if (value === "on-site") {
    return "On-site";
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatPostedDate(isoDate: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(isoDate),
  );
}

export function sortJobsFeaturedFirst<T extends { isFeatured: boolean }>(
  jobs: T[],
): T[] {
  return [...jobs].sort(
    (a, b) => Number(b.isFeatured) - Number(a.isFeatured),
  );
}
