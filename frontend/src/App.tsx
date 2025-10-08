import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Sheets from './pages/Sheets';
import Metadata from './pages/Metadata';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sheets" element={<Sheets />} />
          <Route path="/metadata" element={<Metadata />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;