import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import TrainingService from '../../services/TrainingService';

/**
 * Statistics component that displays a bar chart showing
 * total time (in minutes) booked for each activity type
 */
function Statistics() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const trainings = await TrainingService.getTrainings();

        // Group trainings by activity type
        const groupedByActivity = groupBy(trainings, 'activity');

        // Calculate total duration for each activity type
        const data = Object.keys(groupedByActivity).map(activity => ({
          activity,
          minutes: sumBy(groupedByActivity[activity], 'duration')
        }));

        setChartData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching statistics data:', err);
        setError('Failed to load statistics data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Training Statistics
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Total time (in minutes) booked for each activity type
        </Typography>

        <Box sx={{ height: 400, mt: 4 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="activity" />
              <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="minutes">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Container>
  );
}

export default Statistics; 