import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { CoursesPage } from './pages/CoursesPage';
import { DashboardPage } from './pages/DashboardPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { QuizPage } from './pages/QuizPage';

const Protected = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

export const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<Protected><DashboardPage /></Protected>} />
        <Route path="/courses" element={<Protected><CoursesPage /></Protected>} />
        <Route path="/flashcards" element={<Protected><FlashcardsPage /></Protected>} />
        <Route path="/quiz" element={<Protected><QuizPage /></Protected>} />
      </Routes>
    </Layout>
  );
};
