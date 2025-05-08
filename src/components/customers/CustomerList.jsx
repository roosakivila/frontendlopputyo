import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  Tooltip,
  IconButton,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CustomerService from '../../services/CustomerService';
import TrainingService from '../../services/TrainingService';
import CustomerDialog from './CustomerDialog';
import TrainingDialog from '../trainings/TrainingDialog';
import ConfirmDialog from '../common/ConfirmDialog';
import Notification from '../common/Notification';
import { exportToCSV } from '../../utils/csvExport';
import { AgGridReact } from 'ag-grid-react';

/**
 * CustomerList component that displays a list of customers in a grid
 * @returns {JSX.Element} The CustomerList component
 */
function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [trainingDialogOpen, setTrainingDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);

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
      field: 'firstname',
      headerName: 'First Name',
      filter: 'agTextColumnFilter'
    },
    {
      field: 'lastname',
      headerName: 'Last Name',
      filter: 'agTextColumnFilter'
    },
    {
      field: 'email',
      headerName: 'Email',
      filter: 'agTextColumnFilter'
    },
    {
      field: 'phone',
      headerName: 'Phone',
      filter: 'agTextColumnFilter'
    },
    {
      field: 'streetaddress',
      headerName: 'Address',
      filter: 'agTextColumnFilter'
    },
    {
      field: 'postcode',
      headerName: 'Postcode',
      filter: 'agTextColumnFilter'
    },
    {
      field: 'city',
      headerName: 'City',
      filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Actions',
      field: 'actions',
      filter: false,
      sortable: false,
      width: 180,
      cellRenderer: (params) => {
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Add Training">
              <IconButton
                size="small"
                onClick={() => handleAddTraining(params.data)}
                color="primary"
              >
                <FitnessCenterIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => handleEditCustomer(params.data)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => handleDeleteCustomer(params.data)}
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
    filter: true,
    floatingFilter: true,
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CustomerService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to fetch customers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setCustomerDialogOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerDialogOpen(true);
  };

  const handleAddTraining = (customer) => {
    setSelectedCustomer(customer);
    setTrainingDialogOpen(true);
  };

  const handleDeleteCustomer = (customer) => {
    setCustomerToDelete(customer);
    setConfirmDialogOpen(true);
  };

  const saveCustomer = async (customerData) => {
    try {
      if (selectedCustomer) {
        // Edit existing customer
        await CustomerService.updateCustomer(customerData, selectedCustomer._links.self.href);
        showNotification('Customer updated successfully', 'success');
      } else {
        // Add new customer
        await CustomerService.addCustomer(customerData);
        showNotification('Customer added successfully', 'success');
      }
      fetchCustomers(); // Refresh the customer list
    } catch (error) {
      console.error('Error saving customer:', error);
      showNotification('Error saving customer', 'error');
    }
  };

  const saveTraining = async (trainingData) => {
    try {
      await TrainingService.addTraining(trainingData);
      showNotification('Training added successfully', 'success');
    } catch (error) {
      console.error('Error adding training:', error);
      showNotification('Error adding training', 'error');
    }
  };

  // Confirm customer deletion
  const confirmDeleteCustomer = async () => {
    try {
      await CustomerService.deleteCustomer(customerToDelete._links.self.href);
      showNotification('Customer deleted successfully', 'success');
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      showNotification('Error deleting customer', 'error');
    } finally {
      setConfirmDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  // Export customers to CSV
  const handleExportCSV = () => {
    try {
      // Clone the customer data to avoid modifying the original array
      const customersData = [...customers];

      const excludeFields = ['_links', 'links', 'actions'];

      // Export to CSV file
      exportToCSV(customersData, 'customers.csv', excludeFields);

      showNotification('Customers exported to CSV successfully', 'success');
    } catch (error) {
      console.error('Error exporting customers to CSV:', error);
      showNotification('Error exporting customers to CSV', 'error');
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Customers
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportCSV}
            >
              Export to CSV
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCustomer}
            >
              Add Customer
            </Button>
          </Stack>
        </Box>

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
              rowData={customers}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
              suppressMenuHide={true}
              enableCellTextSelection={true}
              ensureDomOrder={true}
            />
          </div>
        )}
      </Box>

      <CustomerDialog
        open={customerDialogOpen}
        customer={selectedCustomer}
        onSave={saveCustomer}
        onCancel={() => setCustomerDialogOpen(false)}
      />

      <TrainingDialog
        open={trainingDialogOpen}
        customer={selectedCustomer}
        onSave={saveTraining}
        onCancel={() => setTrainingDialogOpen(false)}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        onConfirm={confirmDeleteCustomer}
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

export default CustomerList; 