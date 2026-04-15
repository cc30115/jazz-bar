import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Editorial from './pages/Editorial';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import AdminLayout from './pages/admin/AdminLayout';
import AdminEvents from './pages/admin/AdminEvents';
import AdminArticles from './pages/admin/AdminArticles';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editorial/:id" element={<Editorial />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/events" replace />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="settings" element={<div className="text-cream p-8">Admin Settings (Coming Soon)</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
