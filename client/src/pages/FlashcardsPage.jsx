import { useEffect, useState } from 'react';
import { apiFetch } from '../api/http';

export const FlashcardsPage = () => {
  const [cards, setCards] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const load = () => apiFetch('/flashcards').then(setCards);
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await apiFetch('/flashcards', { method: 'POST', body: JSON.stringify({ question, answer }) });
    setQuestion('');
    setAnswer('');
    load();
  };

  const review = async (id, quality) => {
    await apiFetch(`/flashcards/${id}/review`, { method: 'POST', body: JSON.stringify({ quality }) });
    load();
  };

  return (
    <section>
      <h2>Flashcards</h2>
      <form onSubmit={create} className="form">
        <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Question" />
        <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Answer" />
        <button>Create card</button>
      </form>
      <ul>
        {cards.map((c) => (
          <li key={c._id}>
            <strong>{c.question}</strong> - {c.answer} (Box {c.leitnerBox})
            <button onClick={() => review(c._id, 4)}>Correct</button>
            <button onClick={() => review(c._id, 1)}>Wrong</button>
          </li>
        ))}
      </ul>
    </section>
  );
};
