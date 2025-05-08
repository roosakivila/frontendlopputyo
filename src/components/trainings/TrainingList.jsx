import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TrainingService from '../../services/TrainingService';
import { formatDate, formatCustomerName } from '../../utils/formatters';
import ConfirmDialog from '../common/ConfirmDialog';
import Notification from '../common/Notification';
import { AgGridReact } from 'ag-grid-react';

/**
 * TrainingList component that displays a list of trainings in a grid
 * @returns {JSX.Element} The TrainingList component
 */
function TrainingList() {

  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const columnDefs = [
    {
      field: 'date',
      headerName: 'Date',
      filter: 'agDateColumnFilter',
      valueFormatter: (params) => formatDate(params.value),
      filterValueGetter: (params) => {
        return params.data ? new Date(params.data.date) : null;
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        defaultOption: 'equals',
        defaultDate: null,
        clearButton: true,
        comparator: (filterDate, cellDateValue) => {
          if (!cellDateValue) return -1;

          const cellDate = new Date(cellDateValue);

          const filterYear = filterDate.getFullYear();
          const filterMonth = filterDate.getMonth();
          const filterDay = filterDate.getDate();

          const cellYear = cellDate.getFullYear();
          const cellMonth = cellDate.getMonth();
          const cellDay = cellDate.getDate();

          // Create comparison values as YYYYMMDD numbers
          const filterValue = filterYear * 10000 + filterMonth * 100 + filterDay;
          const cellValue = cellYear * 10000 + cellMonth * 100 + cellDay;

          if (filterValue === cellValue) {
            return 0;
          }
          if (cellValue < filterValue) {
            return -1;
          }
          return 1;
        }
      }
    },
    {
      field: 'duration',
      headerName: 'Duration (min)',
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      field: 'activity',
      headerName: 'Activity',
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Customer',
      valueGetter: (params) => formatCustomerName(params.data.customer),
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Actions',
      field: 'actions',
      filter: false,
      sortable: false,
      width: 100,
      cellRenderer: (params) => {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => handleDeleteTraining(params.data)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      }
    }
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
    floatingFilter: true
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await TrainingService.getTrainings();
      setTrainings(data);
    } catch (error) {
      console.error('Error fetching trainings:', error);
      setError('Failed to fetch trainings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTraining = (training) => {
    setTrainingToDelete(training);
    setConfirmDialogOpen(true);
  };

  const confirmDeleteTraining = async () => {
    try {
      await TrainingService.deleteTraining(trainingToDelete.id);
      showNotification('Training deleted successfully', 'success');
      fetchTrainings();
    } catch (error) {
      console.error('Error deleting training:', error);
      showNotification('Error deleting training', 'error');
    } finally {
      setConfirmDialogOpen(false);
      setTrainingToDelete(null);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Trainings
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <div className="ag-theme-quartz" style={{ height: 600, width: '100%' }}>
            <AgGridReact
              rowData={trainings}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
              suppressMenuHide={true}
              enableCellTextSelection={true}
              ensureDomOrder={true}
              debounceVerticalScrollbar={true}
            />
          </div>
        )}
      </Box>

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Delete Training"
        message="Are you sure you want to delete this training? This action cannot be undone."
        onConfirm={confirmDeleteTraining}
        onCancel={() => setConfirmDialogOpen(false)}
      />

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </Container>
  );
}

export default TrainingList; 