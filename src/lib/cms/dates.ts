/** Parse flexible CMS dates: YYYY-MM-DD, YYYY-MM, YYYY. */
export function tournamentDateValue(date: string): number {
  const trimmed = date.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return Date.parse(trimmed);
  }
  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    return Date.parse(`${trimmed}-01`);
  }
  if (/^\d{4}$/.test(trimmed)) {
    return Date.parse(`${trimmed}-01-01`);
  }
  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => tournamentDateValue(b.date) - tournamentDateValue(a.date),
  );
}

export function sortByDateAsc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => tournamentDateValue(a.date) - tournamentDateValue(b.date),
  );
}

export function youtubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (
      parsed.hostname.includes("youtu.be") ||
      parsed.hostname.includes("youtube.com")
    ) {
      const id =
        parsed.searchParams.get("v") ||
        parsed.pathname.split("/").filter(Boolean).pop() ||
        "";
      if (id && /^[\w-]{11}$/.test(id)) {
        return `https://www.youtube.com/embed/${id}`;
      }
    }
  } catch {
    return null;
  }
  return null;
}
