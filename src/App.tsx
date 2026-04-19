import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Groups from './pages/Groups';
import Knockout from './pages/Knockout';
import Teams from './pages/Teams';
import Predict from './pages/Predict';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1" id="main-content">
          <Routes>
            <Route path="/"         element={<Landing  />} />
            <Route path="/groups"   element={<Groups   />} />
            <Route path="/knockout" element={<Knockout />} />
            <Route path="/teams"    element={<Teams    />} />
            <Route path="/predict"  element={<Predict  />} />
            <Route path="/about"    element={<About    />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
