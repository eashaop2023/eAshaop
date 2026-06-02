import React, { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Medicine from '../../../assets/pharmacyicons/Medicine.png'
import Trash from '../../../assets/pharmacyicons/trash.png'

const cartItemsInitial = [
  {
    id: 1,
    name: 'Paracetamol Tablets IP 500 mg',
    company: 'Pharmed Ltd',
    units: 'Strip of 15 units',
    oldPrice: 700,
    price: 500,
    image: Medicine,
    quantity: 1,
  },
  {
    id: 2,
    name: 'Carpet 500',
    company: 'Pharmed Ltd',
    units: 'Strip of 15 units',
    oldPrice: 700,
    price: 500,
    image: Medicine,
    quantity: 1,
  },
  {
    id: 3,
    name: 'Paracetamol Tablets IP 500 mg',
    company: 'Pharmed Ltd',
    units: 'Strip of 15 units',
    oldPrice: 700,
    price: 500,
    image: Medicine,
    quantity: 1,
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(cartItemsInitial);

  const handleQuantityChange = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate("/pharmacy/address");
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 500;
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  return (
    <Container fluid className="px-2 px-sm-3 px-md-4">
      <div style={{ paddingTop: '90px', paddingBottom: '30px' }}>
        <h4 className="mb-3 fw-semibold" style={{ color: '#252525', fontSize: '1.25rem' }}>My Cart</h4>
        <Row className="g-3">
          {/* Cart Items Column */}
          <Col xs={12} lg={8} className="order-lg-1 order-1">
            {cartItems.map((item) => (
              <Card key={item.id} className="mb-2" style={{ 
                border: '1px solid #EEEEEE', 
                borderRadius: '12px',
                boxShadow: 'none',
                position: 'relative' // Added for positioning
              }}>
                <Card.Body className="p-3">
                  <div className="d-flex">
                    {/* Product Image */}
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      marginRight: '16px',
                      backgroundColor: '#F8F8F8',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginBottom: '4px'
                      }}>
                        <h6 style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          margin: 0,
                          color: '#252525'
                        }}>
                          {item.name}
                        </h6>
                        <Button
                          variant="link"
                          className="text-danger p-0"
                          onClick={() => handleRemoveItem(item.id)}
                          style={{ minWidth: '24px' }}
                        >
                          <img src={Trash} height={16} width={16} alt="Delete" />
                        </Button>
                      </div>
                      
                      <p style={{ 
                        fontSize: '12px', 
                        color: '#252525',
                        margin: 0,
                        marginBottom: '4px'
                      }}>
                        {item.company}
                      </p>
                      
                      <p style={{ 
                        fontSize: '12px', 
                        color: '#252525',
                        margin: 0,
                        marginBottom: '8px'
                      }}>
                        {item.units}
                      </p>
                      
                      <div>
                        <span style={{ 
                          fontSize: '12px', 
                          color: '#8E8E8E',
                          textDecoration: 'line-through',
                          marginRight: '8px'
                        }}>
                          ₹{item.oldPrice}
                        </span>
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: '600',
                          color: '#252525'
                        }}>
                          ₹{item.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls - Positioned at bottom right */}
                  <div style={{
                    position: 'absolute',
                    right: '16px',
                    bottom: '16px'
                  }}>
                    <div className='d-flex justify-content-around align-items-center' 
                      style={{ 
                        width: '80px', 
                        height: '36px', 
                        padding: '8px', 
                        border: '1px solid #00A99D', 
                        gap: '8px', 
                        borderRadius: '10px', 
                        color: '#009AAD',
                        fontSize: '0.9rem'
                      }}>
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        -
                      </span>
                      <span>{item.quantity}</span>
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        +
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Col>

          {/* Order Summary Column */}
          <Col xs={12} lg={4} className="order-lg-2 order-2">
            <Card style={{ border: '1px solid #EEEEEE' }}>
              <Card.Body className="p-3">
                <h5 className="fw-medium mb-3" style={{ color: '#252525' }}>Order Summary</h5>
                <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.9rem', color: '#252525' }}>
                  <span>Subtotal</span>
                  <span className='fw-medium'>₹{subtotal}</span>
                </div>
                <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.9rem', color: '#252525' }}>
                  <span>Discount</span>
                  <span className='fw-medium'>-₹{discount}</span>
                </div>
                <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.9rem', color: '#252525' }}>
                  <span>Delivery Fee</span>
                  <span className='fw-medium'>₹{deliveryFee}</span>
                </div>
                <hr className='my-2' style={{ border: '1px solid #EEEEEE' }} />
                <div className="d-flex justify-content-between mb-3" style={{ fontSize: '0.9rem', color: '#252525' }}>
                  <span className='fw-medium'>Total</span>
                  <span className='fw-medium'>₹{total}</span>
                </div>
                <Button
                  style={{
                    backgroundColor: '#00A99D',
                    width: '100%',
                    borderRadius: '10px',
                    padding: '10px',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.9rem'
                  }}
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default CartPage;