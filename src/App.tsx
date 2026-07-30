import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Groups from './pages/Groups';
import Knockout from './pages/Knockout';
import Teams from './pages/Teams';
import Predict from './pages/Predict';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="relative flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1" id="main-content">
            <Routes>
              <Route path="/"          element={<Landing   />} />
              <Route path="/groups"    element={<Groups    />} />
              <Route path="/knockout"  element={<Knockout  />} />
              <Route path="/teams"     element={<Teams     />} />
              <Route path="/predict"   element={<Predict   />} />
              <Route path="/about"     element={<About     />} />
              <Route path="/pricing"   element={<Pricing   />} />
              <Route path="/signup"    element={<Signup    />} />
              <Route path="/login"     element={<Login     />} />
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
