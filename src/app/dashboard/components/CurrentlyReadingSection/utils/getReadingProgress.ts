interface ReadingProgress {
  pagesRead: number;
  progressPercentage: number;
  hasPageCount: boolean;
}

const clampPercentage = (value: number): number => {
  if (Number.isNaN(value) || !Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
};

/**
 * `progress` can come as ratio (0..1) or absolute pages (>1).
 * When there is no page count, keep ratio-based percentage to avoid 0/0 states.
 */
export const getReadingProgress = (
  progress: number,
  pageCount: number
): ReadingProgress => {
  const normalizedProgress = Number.isFinite(progress)
    ? Math.max(progress, 0)
    : 0;
  const normalizedPageCount =
    Number.isFinite(pageCount) && pageCount > 0 ? Math.round(pageCount) : 0;
  const hasPageCount = normalizedPageCount > 0;

  if (normalizedProgress <= 1) {
    const progressPercentage = clampPercentage(normalizedProgress * 100);
    const pagesRead = hasPageCount
      ? Math.round((progressPercentage / 100) * normalizedPageCount)
      : 0;

    return { pagesRead, progressPercentage, hasPageCount };
  }

  const pagesRead = Math.round(normalizedProgress);
  const progressPercentage = hasPageCount
    ? clampPercentage((pagesRead / normalizedPageCount) * 100)
    : 0;

  return { pagesRead, progressPercentage, hasPageCount };
};
