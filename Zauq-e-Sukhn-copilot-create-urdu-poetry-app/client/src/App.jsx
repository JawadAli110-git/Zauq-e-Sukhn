import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Poets from './pages/Poets';
import PoetDetail from './pages/PoetDetail';
import Poetry from './pages/Poetry';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Qafiya from './pages/Qafiya';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/admin/Dashboard';
import ManagePoets from './pages/admin/ManagePoets';
import ManagePoetry from './pages/admin/ManagePoetry';
import ManageQafiya from './pages/admin/ManageQafiya';
import ManageCourses from './pages/admin/ManageCourses';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-page transition-colors duration-300">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/poets" element={<Poets />} />
                <Route path="/poets/:id" element={<PoetDetail />} />
                <Route path="/poetry" element={<Poetry />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/qafiya" element={<Qafiya />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/admin" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
                <Route path="/admin/poets" element={<ProtectedRoute adminOnly><ManagePoets /></ProtectedRoute>} />
                <Route path="/admin/poetry" element={<ProtectedRoute adminOnly><ManagePoetry /></ProtectedRoute>} />
                <Route path="/admin/qafiya" element={<ProtectedRoute adminOnly><ManageQafiya /></ProtectedRoute>} />
                <Route path="/admin/courses" element={<ProtectedRoute adminOnly><ManageCourses /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
