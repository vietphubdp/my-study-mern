import { useEffect, useState } from 'react';
import { apiFetch } from '../api/http';

export const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');

  const load = () => apiFetch('/courses').then(setCourses);
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!title) return;
    await apiFetch('/courses', { method: 'POST', body: JSON.stringify({ title }) });
    setTitle('');
    load();
  };

  return (
    <section>
      <h2>Courses</h2>
      <form onSubmit={create} className="form-inline">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New course" />
        <button>Add</button>
      </form>
      <ul>{courses.map((c) => <li key={c._id}>{c.title}</li>)}</ul>
    </section>
  );
};
