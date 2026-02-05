import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import eAshalogo from '../../assets/eAshalogo.png';
import PdfReceiptDownloader from '../commonComponent/Pdf';

const teal = '#00A99D';
const borderColor = '#e0e0e0';

const ReceiptCard = ({ receipt }) => {
  if (!receipt) return null;

  const {
    appointmentNumber,
    doctorDetails,
    patientDetails,
    appointmentDetails,
    paymentDetails,
    createdAt,
  } = receipt;

  console.log('rec', receipt);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(
      2,
      '0',
    )}/${d.getFullYear()}`;
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  return (
    <PdfReceiptDownloader receipt={receipt}>
      <Card
        sx={{
          maxWidth: 850,
          mx: 'auto',
          p: 3,
          border: `1px solid ${borderColor}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent>
          {/* Logo */}
          <Box textAlign='center' mb={2}>
            <img src={eAshalogo} width={150} alt='eAsha Logo' />
          </Box>
          {/* OP Number */}
          <Box textAlign='center' mb={3}>
            <Typography sx={{ color: teal, fontWeight: 600, fontSize: '24px' }}>
              OP Unique Number: <b>{appointmentNumber}</b>
            </Typography>
          </Box>
          <Grid container spacing={5}>
            {/* Doctor */}
            <Grid item xs={12} md={6}>
              <Card sx={{ ...sectionCard, padding: 3, height: '100%' }}>
                <SectionTitle title='Doctor Details' />
                <Info label='Name' value={doctorDetails?.name} />
                <Info label='Speciality' value={doctorDetails?.speciality} />
                <Info label='Email' value={doctorDetails?.email} />
                <Info label='Mobile' value={doctorDetails?.mobile} />
                <Info label='Hospital' value={doctorDetails?.hospitalName} />
                <Info label='Location' value={doctorDetails?.hospitalLocation} />
              </Card>
            </Grid>

            {/* Patient */}
            <Grid item xs={12} md={6}>
              <Card sx={{ ...sectionCard, padding: 3, height: '100%' }}>
                <SectionTitle title='Patient Details' />
                <Info label='Name' value={patientDetails?.name} />
                <Info label='Age' value={patientDetails?.age} />
                <Info label='Gender' value={patientDetails?.gender} />
                <Info label='Email' value={patientDetails?.email} />
                <Info label='Mobile' value={patientDetails?.mobile} />
                <Info label='Address' value={patientDetails?.address} />
                <Info label='Pincode' value={patientDetails?.pincode} />
              </Card>
            </Grid>
          </Grid>

          {/* Payment */}
          <Card sx={{ ...sectionCard, mt: 2 }}>
            <SectionTitle title='Payment Details' />

            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: teal }}>
                  <TableCell sx={{ color: '#fff' }}>Description</TableCell>
                  <TableCell sx={{ color: '#fff' }} align='right'>
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell>
                    Consultation Fee (
                    {appointmentDetails?.type === 'clinic' ? 'Clinic Visit' : 'Video Consultation'})
                  </TableCell>
                  <TableCell align='right'>₹{paymentDetails?.amount || 0}.00</TableCell>
                </TableRow>

                <TableRow sx={{ backgroundColor: '#f9f9f9', fontWeight: 600 }}>
                  <TableCell>Total</TableCell>
                  <TableCell align='right'>
                    <b>₹{paymentDetails?.amount || 0}.00</b>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>
                  Payment Method: <b>{paymentDetails?.paymentMethod || 'Pay at Clinic'}</b>
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>
                  OP Status:{' '}
                  <b
                    style={{
                      color: appointmentDetails?.status === 'booked' ? '#28a745' : '#ffc107',
                    }}
                  >
                    {appointmentDetails?.status === 'booked'
                      ? 'Successful'
                      : appointmentDetails?.status}
                  </b>
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography>Appointment Date: {formatDate(appointmentDetails?.date)}</Typography>
            <Typography>Appointment Time: {appointmentDetails?.time}</Typography>
            <Typography>
              Type: {appointmentDetails?.type === 'clinic' ? 'Clinic Visit' : 'Video Consultation'}
            </Typography>
          </Card>

          {/* Footer */}
          <Typography
            align='center'
            sx={{
              mt: 3,
              fontSize: 12,
              color: '#666',
              borderTop: `1px solid ${borderColor}`,
              pt: 1,
            }}
          >
            Receipt Generated: {formatDate(createdAt)} at {formatTime(createdAt)}
          </Typography>
        </CardContent>
      </Card>
    </PdfReceiptDownloader>
  );
};

/* ===== Helpers ===== */

const sectionCard = {
  p: 2,
  border: '1px solid #e0e0e0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
};

const SectionTitle = ({ title }) => (
  <Typography
    sx={{
      color: '#00A99D',
      fontWeight: 600,
      fontSize: 18,
      borderBottom: '2px solid #00A99D',
      pb: 1,
      mb: 2,
    }}
  >
    {title}
  </Typography>
);

const Info = ({ label, value }) => (
  <Typography sx={{ mb: 1 }}>
    <b>{label}:</b> {value || 'N/A'}
  </Typography>
);

export default ReceiptCard;
