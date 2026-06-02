import React, { useEffect, useState } from 'react';
import leftArrow from '../../assets/confirmappointmenticons/arrow-left.svg'
import medicines from "../../assets/medicines.png"
import done from "../../assets/done.png"
import "../../pages/PharmacyPage/OrderTracking.css"

const OrderTracking = () => {
  const primary = '#077E8C66';
  let greyLight = '#F5F5F5';
  const fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerStyle = {
    position: 'relative',
    backgroundColor: '#fff',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily,
  };


  const timelineWrapper = !isMobile
    ? { position: 'absolute', top: 100, left: 74 }
    : { position: 'static', marginBottom: '1.5rem' };


  const lineStyle = {
    position: 'absolute',
    // display:"flex",
    // gap:"10px",
    top: '8.5rem',
    bottom: '5rem',
    left: '1rem',
    width: '4px',
    backgroundColor: "#077E8C66",
    zIndex: 0,
  };

  const stepWrapper = { marginBottom: isMobile ? '0rem' : '2rem', position: 'relative' };
  const circleBase = {
    width: '2rem',
    height: '2rem',
    // marginLeft:"3px",
    marginLeft: '2px',
    marginTop: '15px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 1,
  };

  const stepCircle = (active) => ({
    ...circleBase,
    backgroundColor: active ? primary : greyLight,
  });

    const stepText = { marginLeft: '2.5rem', fontWeight: 500, fontSize: isMobile ? '18px' : '24px' };
  const dateText = { marginLeft: '2.5rem', color: "#00A99D", fontSize: isMobile ? '14px' : '18px', fontWeight: "400" };

  const detailsWrapper = !isMobile
    ? { position: 'absolute', top: 90, left: 390, width: 1100,  padding: '1rem 2rem', boxSizing: 'border-box', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }
    : { position: 'static', width: '100%', padding: '1rem', borderRadius: '8px', boxSizing: 'border-box' };

  const detailsHeader = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '9fr 8fr 0.5fr ' : '1fr 1fr 1fr',
    fontWeight: 500,
    fontSize: isMobile ? '16px' : '24px',
    color: "#000000"
  };

  const productList = {  flexGrow: 1, margin: '1rem 0' };
  const productRow = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr 1fr' : '0.2fr 0.8fr 1fr 1fr',
    alignItems: 'center',
    padding: '1rem 0',
    // borderBottom: 1px solid ${greyLight},
    // fontSize: isMobile ? '14px' : 'inherit'

  };
  const productImg = {
    width: '3.5rem', 
    height: '3.5rem',
    objectFit: 'cover',
    borderRadius: '4px',
  };
  const totalRow = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '9fr 4.5fr 0.5fr': 'auto auto auto',
    fontWeight: 600,
    fontSize: '18px',
    color:"#252525"
  };

  return (
    <div style={containerStyle} className='order-page'>
      <div className='d-flex align-items-center gap-2'>
        <img src={leftArrow} alt="" className='h-[18px] w-[18px]' />  
        <span className='text-[#00A99D] font-normal' style={{fontSize:"18px"}}>Order ID 7823467654</span>
      </div>
      {/* display: flex
;
    flex-direction: column;
    gap: 20px; */}

      <div style={timelineWrapper} className='d-flex flex-col gap-5 order-tracking '>
        <div className='d-flex gap-25 mb-2'>
        <div className='font-medium text-[#000000] ' style={{fontSize:"24px"}} >Order Tracking</div>
        </div>
        <div style={lineStyle} className='timeline-line' />

        <div style={stepWrapper} className='each-step'>
          <div style={stepCircle(true)}>
            {/* <i className="bi bi-check-lg" style={{ color: '#fff' }} /> */}
            <img src={done} alt="" className='' />
          </div>
          <div style={stepText} className='font-medium text-[#000000] ml-5 step' >Order Received</div>
          <div style={dateText} className='date-text'>12 Aug, 2025, 10:30 AM</div>
        </div>

        <div style={stepWrapper}>
          <div style={stepCircle(true)}>
            {/* <i className="bi bi-check-lg" style={{ color: '#fff' }} /> */}
            <img src={done} alt="" />
          </div>

          <div style={stepText}>Order Confirmed</div>
          <div style={dateText}>12 Aug, 2025, 10:30 AM</div>
        </div>

        <div style={stepWrapper}>
          <div style={stepCircle(true)} />
          <div style={stepText}>Out for Delivery</div>
          <div style={dateText}>12 Aug, 2025, 10:30 AM</div>
        </div>

        <div style={stepWrapper}>
          <div style={stepCircle(true)} />
          <div style={stepText}>Order Delivered</div>
          <div style={dateText}>12 Aug, 2025, 10:30 AM</div>
        </div>
      </div>

       {/* Order Details Section */}
      <div className="order-details" style={detailsWrapper}>
  <div className='font-medium text-[#000000]' style={{ fontSize: "24px", marginBottom: "1rem" }}>
    Order Details
  </div>
        <div style={detailsHeader}>
          <div  style={{textAlign:'center'}}>Product Name</div>
          <div style={{ textAlign: 'center' }}>Quantity</div>
          <div style={{ textAlign: 'right' }}>Price</div>
        </div>

        <div style={productList}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={productRow} className='product-row'>
              <img src={medicines} alt="Paracetamol" style={productImg} />
              <div>
                <div className='product-name' style={{ fontWeight: 600,fontSize:"18px", color:"#252525" }}>Paracetamol Tablets IP 500 mg</div>
                <div className='product-subname' style={{ color: '#252525', fontSize: '14px',fontWeight:400 }}>Pharmed Ltd</div>
                <div className='product-subname' style={{ color: '#252525', fontSize: '14px', fontWeight:400 }}>Strip of 15 units</div>
              </div>
               <div style={{ textAlign: 'center', fontWeight: 600, fontSize: "18px", color: "#252525" }}>1</div>
              <div style={{ textAlign: 'right',fontWeight:600,fontSize:"18px", color:"#252525" }}>₹500</div>
            </div>
          ))}
        </div>

        <div style={totalRow} className='bottomRow'>
          <div>Total</div>
          <div style={{ textAlign: 'center' }} className='numberWrapper'>3</div>
          <div style={{ textAlign: 'right' }}>₹1500</div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;