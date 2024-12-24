import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RouteGuard from './RouteGaurd';
import PasswordReset from './Pages/PasswordReset';
import ForgotPassword from './Pages/ForgotPassword';
import Home from './Pages/Home';
import { TaskProvider } from './contexts/TaskContext';
import EmailRecovery from './Pages/EmailRecovery';
import LogIn from './Pages/LogIn';
import SignUp from './Pages/SignUp';
import NotFound from './Pages/NotFound';
import Loading from './Pages/Loading';

function App() {
  return (
    <Router>
      <RouteGuard>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                <TaskProvider>
                  <Home />
                </TaskProvider>
              }
            />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/email-recovery" element={<EmailRecovery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </RouteGuard>
    </Router>
  );
}

export default App;
