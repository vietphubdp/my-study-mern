import { useState } from 'react';
import { apiFetch } from '../api/http';

export const QuizPage = () => {
  const [prompt, setPrompt] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const addQuestion = async (e) => {
    e.preventDefault();
    await apiFetch('/quiz/questions', {
      method: 'POST',
      body: JSON.stringify({ type: 'fill_blank', prompt, correctAnswer }),
    });
    setPrompt('');
    setCorrectAnswer('');
  };

  const start = async () => {
    const data = await apiFetch('/quiz/start', { method: 'POST', body: JSON.stringify({ count: 5 }) });
    setAttempt(data);
    setAnswers({});
    setResult(null);
  };

  const submit = async () => {
    const payload = {
      answers: (attempt.questions || []).map((q) => ({ questionId: q.id, userAnswer: answers[q.id] || '' })),
    };
    const data = await apiFetch(`/quiz/${attempt.attemptId}/submit`, { method: 'POST', body: JSON.stringify(payload) });
    setResult(data);
  };

  return (
    <section>
      <h2>Quiz</h2>
      <form onSubmit={addQuestion} className="form-inline">
        <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Question prompt" />
        <input value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} placeholder="Correct answer" />
        <button>Add question</button>
      </form>

      <button onClick={start}>Start random quiz</button>

      {attempt && (
        <div className="card">
          {attempt.questions.map((q) => (
            <div key={q.id}>
              <p>{q.prompt}</p>
              <input value={answers[q.id] || ''} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} placeholder="Your answer" />
            </div>
          ))}
          <button onClick={submit}>Submit</button>
        </div>
      )}

      {result && <p>Score: {result.score} | Accuracy: {result.accuracy}%</p>}
    </section>
  );
};
