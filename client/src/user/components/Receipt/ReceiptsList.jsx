import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import RefreshIcon from '@mui/icons-material/Refresh';
import { API_BASE_URL } from '../../../api-config';
import ReceiptCard from './ReceiptCard';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';

const ReceiptsList = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [openFilter, setOpenFilter] = useState(false);

  const itemsPerPage = 1; // Show 1 receipt per page

  // Fetch receipts
  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/api/receipts/user/${userId}`);
      setReceipts(response.data.receipts || []);
    } catch (error) {
      console.error('Error fetching receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  //  UNIQUE DOCTOR LIST
  const doctorList = [...new Set(receipts.map((r) => r?.doctorDetails?.name).filter(Boolean))];

  //  FILTER LOGIC
  const filteredReceipts = receipts.filter((receipt) => {
    const matchDate = selectedDate
      ? dayjs(receipt?.appointmentDetails?.date).format('YYYY-MM-DD') ===
        dayjs(selectedDate).format('YYYY-MM-DD')
      : true;

    const matchDoctor = selectedDoctor ? receipt?.doctorDetails?.name === selectedDoctor : true;

    return matchDate && matchDoctor;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedReceipts = filteredReceipts.slice(startIndex, startIndex + itemsPerPage);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleRefresh = () => {
    setSelectedDate(null);
    setSelectedDoctor('');
    fetchReceipts(); // Re-fetch all receipts
    setPage(1); // Reset pagination
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading receipts...</div>;
  }

  if (receipts.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No receipts found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '20px', color: '#00A99D', fontSize: '24px', fontWeight: '600' }}>
          My Receipts
        </h2>

        {/* Card with Date Picker + Refresh */}
        <Box width='100%' display='flex' justifyContent='flex-end' mt={6} mb={3} ml={15}>
          <IconButton
            onClick={() => setOpenFilter(true)}
            sx={{
              backgroundColor: '#00A99D',
              color: '#fff',
              '&:hover': { backgroundColor: '#009688' },
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Box>

        {/* Receipts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {paginatedReceipts.length > 0 ? (
            paginatedReceipts.map((receipt) => <ReceiptCard key={receipt._id} receipt={receipt} />)
          ) : (
            <p>No receipts found for this date.</p>
          )}
        </div>

        {/* Pagination */}
        {paginatedReceipts.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChange}
              variant='outlined'
              shape='rounded'
              sx={{
                '& .MuiPaginationItem-root': {
                  borderColor: '#00A99D',
                  borderRadius: '50%',
                  color: '#00A99D',
                },
                '& .Mui-selected': {
                  backgroundColor: '#00A99D !important',
                  color: '#ffffff',
                },
                '& .Mui-selected:hover': {
                  backgroundColor: '#009688',
                },
              }}
            />
          </div>
        )}

        <Drawer anchor='right' open={openFilter} onClose={() => setOpenFilter(false)}>
          <div style={{ width: 300, padding: 20 }}>
            <h3 style={{ color: '#00A99D' }}>Filters</h3>

            {/* DATE FILTER */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Filter By Date'
                value={selectedDate}
                onChange={(val) => {
                  setSelectedDate(val);
                  setPage(1);
                }}
                sx={{ width: '100%', marginBottom: 3 }}
              />
            </LocalizationProvider>

            {/* DOCTOR DROPDOWN */}
            <TextField
              select
              label='Filter By Doctor'
              value={selectedDoctor}
              onChange={(e) => {
                setSelectedDoctor(e.target.value);
                setPage(1);
              }}
              fullWidth
              sx={{ marginBottom: 3 }}
            >
              <MenuItem value=''>All Doctors</MenuItem>

              {doctorList.map((doc, index) => (
                <MenuItem key={index} value={doc}>
                  {doc}
                </MenuItem>
              ))}
            </TextField>

            {/* REFRESH */}
            <Button
              fullWidth
              variant='outlined'
              startIcon={<RefreshIcon />}
              onClick={() => {
                handleRefresh();
                setOpenFilter(false);
              }}
              sx={{
                color: '#00A99D',
                borderColor: '#00A99D',
                '&:hover': {
                  backgroundColor: '#00A99D',
                  color: '#fff',
                },
              }}
            >
              Refresh Filters
            </Button>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default ReceiptsList;
