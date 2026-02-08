import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthPage = () => {
  const { user, login, register, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', displayName: '' });
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) await register(form.email, form.password, form.displayName);
      else await login(form.email, form.password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="card">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={submit} className="form">
        {isRegister && <input placeholder="Display name" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />}
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="error">{error}</p>}
        <button disabled={loading}>{loading ? 'Please wait...' : 'Submit'}</button>
      </form>
      <button onClick={() => setIsRegister((v) => !v)}>{isRegister ? 'Have account? Login' : 'No account? Register'}</button>
    </section>
  );
};
