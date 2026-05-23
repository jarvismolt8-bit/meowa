export function computeNextCheckup(lastCheckup) {
  if (!lastCheckup) return null;
  const date = new Date(lastCheckup);
  if (isNaN(date.getTime())) return null;
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + 1);
  return next.toISOString();
}

export function bucketByStatus(cats, options = {}) {
  const windowDays = options.windowDays ?? 30;
  const now = new Date();
  const overdue = [];
  const dueSoon = [];
  const upcoming = [];

  for (const cat of cats) {
    const due = cat.next_checkup_due;
    if (!due) continue;
    const dueDate = new Date(due);
    if (isNaN(dueDate.getTime())) continue;
    const diffMs = dueDate.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays < 0) {
      overdue.push(cat);
    } else if (diffDays <= windowDays) {
      dueSoon.push(cat);
    } else {
      upcoming.push(cat);
    }
  }

  return { overdue, due_soon: dueSoon, upcoming };
}
