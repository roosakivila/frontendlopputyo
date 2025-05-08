import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import AppBar from './components/layout/AppBar';
import CustomerList from './components/customers/CustomerList';
import TrainingList from './components/trainings/TrainingList';
import TrainingCalendar from './components/calendar/TrainingCalendar';
import Statistics from './components/statistics/Statistics';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar />
        <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
          <Routes>
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/trainings" element={<TrainingList />} />
            <Route path="/calendar" element={<TrainingCalendar />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/" element={<Navigate to="/customers" replace />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
