import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api-config";
import ReceiptCard from "./ReceiptCard";

const ReceiptView = () => {
  const { receiptId } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/receipts/${receiptId}`);
        setReceipt(response.data.receipt);
      } catch (error) {
        console.error("Error fetching receipt:", error);
      } finally {
        setLoading(false);
      }
    };

    if (receiptId) {
      fetchReceipt();
    }
  }, [receiptId]);

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading receipt...</div>;
  }

  if (!receipt) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Receipt not found.</p>
        <button onClick={() => navigate("/user/receipts")}>Back to Receipts</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <button 
        onClick={() => navigate("/user/receipts")}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#00A99D",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        ← Back to Receipts
      </button>
      <ReceiptCard receipt={receipt} />
    </div>
  );
};

export default ReceiptView;

