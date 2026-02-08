import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div>
      <header className="header">
        <h1>My Study MERN</h1>
        {user && (
          <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/flashcards">Flashcards</Link>
            <Link to="/quiz">Quiz</Link>
            <button onClick={logout}>Logout</button>
          </nav>
        )}
      </header>
      <main className="container">{children}</main>
    </div>
  );
};
