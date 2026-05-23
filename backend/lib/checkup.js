export function computeNextCheckup(lastCheckup) {
  if (!lastCheckup) return null;
  const date = new Date(lastCheckup);
  if (isNaN(date.getTime())) return null;
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + 1);
  return next.toISOString();
}
