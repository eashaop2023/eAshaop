import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api-config";
import ReceiptCard from "./ReceiptCard";

const ReceiptsList = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/receipts/user/${userId}`);
        setReceipts(response.data.receipts || []);
      } catch (error) {
        console.error("Error fetching receipts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading receipts...</div>;
  }

  if (receipts.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>No receipts found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto"
      }}>
        <h2 style={{ 
          marginBottom: "30px", 
          color: "#00A99D", 
          fontSize: "24px",
          fontWeight: "600"
        }}>
          My Receipts
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {receipts.map((receipt) => (
            <ReceiptCard key={receipt._id} receipt={receipt} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReceiptsList;

