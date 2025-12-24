
import { Box } from '@mui/material';
import TopNavbar from './components/Navbar/TopNavbar.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage.jsx';
import NewHypothesis from './pages/NewHypothesis.jsx';

export default function App() {
  return (
    <Box sx={{ width: '100%', margin: 0, padding: 0 }}>
      <Router>
        <TopNavbar />
        <Routes>
          <Route path='/' element={<DashboardPage />} />
          <Route path='/new' element={<NewHypothesis />} />
        </Routes>
      </Router>
    </Box>
  );
}
