import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BarChartIcon from '@mui/icons-material/BarChart';

/**
 * AppBar component with navigation links
 * @returns {JSX.Element} The AppBar component
 */
function AppBar() {
  return (
    <MuiAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PersonalTrainer
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/customers"
            startIcon={<PeopleIcon />}
          >
            Customers
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/trainings"
            startIcon={<FitnessCenterIcon />}
          >
            Trainings
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/calendar"
            startIcon={<CalendarMonthIcon />}
          >
            Calendar
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/statistics"
            startIcon={<BarChartIcon />}
          >
            Statistics
          </Button>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
}

export default AppBar; 