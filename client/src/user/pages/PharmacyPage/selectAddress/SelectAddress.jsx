import React, { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Check from '../../../assets/pharmacyicons/Check.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import AddAddressModal from '../addAddress/AddAddressModel';
import { useNavigate } from 'react-router-dom';

const SelectedAddressPage = () => {
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Avinash',
      addressLine: 'Flat no 601, Gayathri Vihar Apartment, Kothapet, New Nagole',
      city: 'Hyderabad',
      state:'Telangana',
      pincode: '500065',
      mobile: '7893960598',
    },
    {
      id: 2,
      name: 'Nithish',
      addressLine: 'Flat no 601, Gayathri Vihar Apartment, Kothapet, New Nagole',
      city: 'Hyderabad',
      state:'Telangana',
      pincode: '500065',
      mobile: '7893960598',
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const navigate=useNavigate();
  const handleCheckOut=()=>{
    navigate("/pharmacy/payment");
  }

  const handleAddAddress = (newAddress) => {
    const newId = Math.max(0, ...addresses.map(a => a.id)) + 1;

    const formatted = {
      id: newId,
      name: newAddress.fullName,
      addressLine: `${newAddress.houseNumber}, ${newAddress.areaDetails}, ${newAddress.landmark}`,
      city: newAddress.city,
      statr:newAddress.state,
      pincode: newAddress.pinCode,
      mobile: newAddress.phone,
    };
    setAddresses([formatted,...addresses]);
    setSelectedAddress(newId);
  };

  const subtotal = 2000;
  const discount = 500;
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  return (
    <Container style={{ marginLeft: '40px', marginRight: '40px' }}>
      <div>
        <Row className="d-flex justify-content-between" style={{ width: '1460px' }}>
          {/* LEFT COLUMN - Select Address */}
          <Col md={8} style={{ width: '800px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4" style={{ marginTop: '99px' }}>
              <h4 className="fw-semibold" style={{ color: '#252525' }}>
                Select Address
              </h4>
              <span
                style={{
                  color: '#00A99D',
                  fontWeight: '400',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
                onClick={() => setShowModal(true)}
              >
                + Add New Address
              </span>
            </div>

            {addresses.map((item) => (
              <Card
                key={item.id}
                className="mb-3"
                style={{
                  border: '1px solid #EEEEEE',
                  borderRadius: '14px',
                  padding: '12px',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedAddress(item.id)}
              >
                <Card.Body style={{ padding: 0 }}>
                  <h4 className="fw-semibold mb-2" style={{ color: '#252525' }}>
                    {item.name}
                  </h4>
                  <div className="d-flex" style={{ fontSize: '18px', color: '#252525', width: '600px' }}>
                    <span>Address:&nbsp; </span>
                    <span>
                      {item.addressLine},<br />
                      {item.city}, {item.state}<br/> {item.pincode}
                    </span>
                  </div>
                  <p style={{ fontSize: '18px', color: '#252525' }}>Mobile: {item.mobile}</p>
                  {selectedAddress === item.id && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 20,
                        right: 24,
                        height: 24,
                        width: 24,
                        backgroundColor: '#00A99D',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ color: 'white', fontSize: 14 }}>
                        <img src={Check} height={9.4} width={12} />
                      </span>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </Col>

          {/* RIGHT COLUMN - Order Summary */}
          <Col md={4} style={{ width: '550px', marginTop: '160px', height: '402px', marginLeft: '80px' }}>
            <Card style={{ border: '1px solid #EEEEEE', borderRadius: '12px' }}>
              <Card.Body>
                <h4 className="fw-medium" style={{ color: '#252525', marginBottom: '50px' }}>Order Summary</h4>
                <div className="d-flex justify-content-between mb-4" style={{ fontSize: '18px', color: '#252525' }}>
                  <span className='fw-regular'>Subtotal</span>
                  <span className='fw-medium'>₹{subtotal}</span>
                </div>
                <div className="d-flex justify-content-between mb-4" style={{ fontSize: '18px', color: '#252525' }}>
                  <span className='fw-regular'>Discount</span>
                  <span className='fw-medium'>-₹{discount}</span>
                </div>
                <div className="d-flex justify-content-between mb-4" style={{ fontSize: '18px', color: '#252525' }}>
                  <span className='fw-regular'>Delivery Fee</span>
                  <span className='fw-medium'>₹{deliveryFee}</span>
                </div>
                <hr className='mb-4' style={{ border: '1px solid #EEEEEE' }} />
                <div className="d-flex justify-content-between " style={{ fontSize: '18px', color: '#252525', marginBottom: '75px' }}>
                  <span className='fw-regular'>Total</span>
                  <span className='fw-medium'>₹{total}</span>
                </div>
                <Button
                  style={{ backgroundColor: '#00A99D', width: '235px', borderRadius: '12px', padding: '10px', gap: '10px', color: '#FFFFFF', marginLeft: 'auto', marginRight: 'auto' }}
                  className='d-flex justify-content-center text-center'
                  onClick={handleCheckOut}
                >
                  Proceed to Checkout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal */}
        <AddAddressModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onAddAddress={handleAddAddress}
        />
      </div>
    </Container>
  );
};

export default SelectedAddressPage;
