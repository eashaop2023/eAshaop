import React from "react";
import { Card, Button, Image } from "react-bootstrap";
import DoloImg from "../../../assets/pharmacyicons/Tablets.svg"; 
const productList = [
  { id: 1, name: "Paracetamol Tablets IP 500\u00A0mg", mrp: 700, price: 500 },
  { id: 2, name: "Paracetamol Tablets IP 500\u00A0mg", mrp: 700, price: 500 },
  { id: 3, name: "Paracetamol Tablets IP 500\u00A0mg", mrp: 700, price: 500 },
  { id: 4, name: "Paracetamol Tablets IP 500\u00A0mg", mrp: 700, price: 500 },
  { id: 5, name: "Paracetamol Tablets IP 500\u00A0mg", mrp: 700, price: 500 },
  { id: 6, name: "Paracetamol Tablets IP 500\u00A0mg", mrp: 700, price: 500 },
];

const ProductScrollCards = () => {
  const font = { fontFamily: "Urbanist, sans-serif" };

  return (
    <div style={{ padding: "10px", marginTop: "40px", ...font }}>
      {/* Heading */}
      <h4 style={{ fontWeight: 500, marginLeft: "24px", marginBottom: "20px" }}>
        Customers also bought
      </h4>

      {/* Scrollable container with hidden scrollbar */}
      <div
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          paddingLeft: "35px",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE 10+
        }}
      >
        {/* Hide scrollbar in WebKit */}
        <style>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        <div style={{ display: "inline-flex", gap: "16px" }}>
          {productList.map((item) => (
            <Card
              key={item.id}
              style={{
                maxWidth: "244px",
                height: "350px",
                borderRadius: "16px",
                paddingTop: "24px",
                paddingBottom: "24px",
                paddingInline: "12px",
                border: "1px solid #EEEEEE",
                position: "relative",
                flexShrink: 0,
                backgroundColor: "#FFFFFF",
                
              }}
            >
              {/* Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "0px",
                  backgroundColor: "#1F405E",
                  color: "#fff",
                  fontSize: "12px",
                  borderRadius: "4px 0px 0px 4px",
                  padding: "2px 8px 0px 13px",
                  fontWeight: 500,
                  height: "20px",
                  width:"71px"
                 
                }}
              >
                15% OFF
              </div>

              {/* Image */}
              <Image
                src={DoloImg}
                alt="Product"
                fluid
                style={{
                  borderRadius: "6px",
                  marginBottom: "10px",
                  width: "244px",
                  height: "144px",
                }}
              />

              {/* Product Title (2-line clamp with mg dropping down) */}
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "8px",
                  maxWidth: "228px",
                  height: "44px",
                  lineHeight: "120%",
                  whiteSpace: "normal",
                 paddingLeft:"16px",
                 gap:"10px"
                  
                }}
              >
                {item.name}
              </div>

              <hr style={{ color: "#EEEEEE", marginTop: 10 }} />

              {/* Price */}
              <div style={{ marginBottom: "16px", fontSize: "15px" }}>
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "#999",
                    marginRight: "6px",
                    paddingLeft:"16px",
                 gap:"10px"
                  }}
                >
                  ₹{item.mrp}
                </span>
                <span style={{ fontWeight: 600,fontSize:"18px"}}>₹{item.price}</span>
              </div>

              {/* Add to Cart Button */}
              <Button
                style={{
                  backgroundColor: "#00A99D",
                  border: "none",
                  borderRadius: "30px",
                  fontSize: "16px",
                  fontWeight: 500,
                  padding: "8px 12px",
                  width: "180px",
                  height:"40px",
                  marginLeft:"24px"
                }}
              >
                Add to cart
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductScrollCards;
