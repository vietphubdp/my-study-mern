import { useEffect, useState } from 'react';
import { apiFetch } from '../api/http';

export const DashboardPage = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    apiFetch('/dashboard/summary').then(setSummary).catch(() => {});
  }, []);

  if (!summary) return <p>Loading dashboard...</p>;

  return (
    <section className="grid">
      <article className="card"><h3>Streak</h3><p>{summary.streak} days</p></article>
      <article className="card"><h3>Due cards</h3><p>{summary.dueCards}</p></article>
      <article className="card"><h3>Accuracy</h3><p>{summary.avgAccuracy}%</p></article>
      <article className="card"><h3>Study time</h3><p>{Math.round(summary.totalStudySec / 60)} mins</p></article>
    </section>
  );
};
