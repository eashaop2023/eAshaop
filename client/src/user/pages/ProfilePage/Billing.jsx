import React from "react";
import visa from "../../assets/visa.svg";
import mastercard from "../../assets/mastercard.svg";
import discover from "../../assets/discover.svg";
import cibamerica from "../../assets/cibamerica.svg";
import styles from '../ProfilePage/Billing.module.css'


function Billing() {
  const commonInputStyle = {
    padding: "13px 10px",
    lineHeight: "120%",
    borderRadius: "28px",
    border: "1px solid #d1d1d1",
    color: "#8e8e8e",
    letterSpacing: "0%",
    fontSize: "16px",
    outline: "none",
    width: "100%",
  };

  const labelStyle = {
    display: "block",
    fontSize: "18px",
    lineHeight: "120%",
    fontWeight: 400,
    letterSpacing: "0%",
    color: "#252525",
    marginBottom: "0.5rem",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // padding: "2rem 1rem",
        fontFamily: "Urbanist,sans-serif",
        // marginTop:'38px',
        marginRight:'40px'
      }}
      className={` ${styles.mainContainer}`}
    >
      <div
        style={{
          width: "617px",
          background: "#ffffff",
          borderRadius: "12px",
          padding: "110px 0 0 0",
          marginTop:"45px"
        }}
        className={`${styles.topContainer}`}
      >
        <h2 className="mb-3" style={{ fontWeight: "500", color: "#252525" }}>
          Payment and Billing
        </h2>
        <p
          style={{
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: "120%",
            color: "#252525",
            margin: "1rem 0 1.5rem",
            letterSpacing: "0%",
          }}
        >
          Update your Payments method and billing details
        </p>

        <div style={{ marginBottom: "0.5rem" }}>
          <label htmlFor="creditCard" style={labelStyle}>
            Credit Card Number
          </label>
          <input id="creditCard" type="text" style={commonInputStyle} />
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <label htmlFor="cvv" style={labelStyle}>
              CVV
            </label>
            <input id="cvv" type="text" style={commonInputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="expiry" style={labelStyle}>
              Expiry Date
            </label>
            <input
              id="expiry"
              type="text"
              placeholder="Exp Date (mm/yyyy)"
              style={commonInputStyle}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <img src={visa} alt="Visa" style={{ height: "24px", objectFit: "contain" }} />
          <img src={mastercard} alt="Mastercard" style={{ height: "24px", objectFit: "contain" }} />
          <img src={discover} alt="Discover" style={{ height: "24px", objectFit: "contain" }} />
          <img src={cibamerica} alt="Amex" style={{ height: "24px", objectFit: "contain" }} />
        </div>
      </div>

      <form
        style={{
          width: "617px",
          background: "#ffffff",
          borderRadius: "12px",
          padding: "2px 0 0 0",
        }}
        className={` ${styles.formContainer} `}
      >
        <h2 className="mt-3 mb-3" style={{ fontWeight: "500", color: "#252525" }}>
          Billing Details
        </h2>

        <div style={{ marginBottom: "0.5rem" }}>
          <label htmlFor="name" style={labelStyle}>
            Full Name
          </label>
          <input id="name" type="text" style={commonInputStyle} />
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label htmlFor="address" style={labelStyle}>
            Address
          </label>
          <input id="address" type="text" style={commonInputStyle} />
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="apt" style={labelStyle}>
              Apt/Suite
            </label>
            <input id="apt" type="text" style={commonInputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="city" style={labelStyle}>
              City
            </label>
            <input id="city" type="text" style={commonInputStyle} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="state" style={labelStyle}>
              State
            </label>
            <select id="state" style={commonInputStyle}>
              <option>State 1</option>
              <option>State 2</option>
              <option>State 3</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="zip" style={labelStyle}>
              Zip Code
            </label>
            <input id="zip" type="text" style={commonInputStyle} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
          <button
            type="button"
            style={{
              padding: "10px 24px",
              borderRadius: "28px",
              border: "1px solid #00a99d",
              background: "transparent",
              color: "#00a99d",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: "10px 24px",
              borderRadius: "28px",
              border: "none",
              background: "#00a99d",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>

        <p
          style={{
            marginTop: "2rem",
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: "120%",
            color: "#000000",
            textAlign: "start",
          }}
        >
          No recent transaction.
        </p>
      </form>
    </div>
  );
}

export default Billing;
