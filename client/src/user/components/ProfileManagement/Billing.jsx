// import React from "react";
// import styles from "./Billing.module.css";
// import visa from "../../assets/visa.svg";
// import mastercard from "../../assets/mastercard.svg"; 
// import discover from "../../assets/discover.svg";
// import cibamerica from "../../assets/cibamerica.svg";

// function Billing() {
//   return (
//     <div className={styles.pageWrapper}>
//       <div className={styles.card}>
//         <h2 className={styles.headerTwo}>Payment and Billing</h2>
//         <p className={styles.paraOne}>
//           Update your Payments method and billing details
//         </p>

//         <div className={styles.section}>
//           <label htmlFor="creditCard" className={styles.commnLabel}>
//             Credit Card Number
//           </label>
//           <input
//             id="creditCard"
//             type="text"
//             className={`${styles.commonInput} ${styles.fullInput}`}
//           />
//         </div>

//         <div className={`${styles.section} ${styles.row}`}>
//           <div className={styles.field}>
//             <label htmlFor="cvv" className={styles.commnLabel}>
//               CVV
//             </label>
//             <input
//               id="cvv"
//               type="text"
//               className={`${styles.commonInput} ${styles.halfInput}`}
//             />
//           </div>
//           <div className={styles.field}>
//             <label htmlFor="expiry" className={styles.commnLabel}>
//               Expiry Date
//             </label>
//             <input
//               id="expiry"
//               type="text"
//               placeholder="Exp Date (mm/yyyy)"
//               className={`${styles.commonInput} ${styles.halfInput}`}
//             />
//           </div>
//         </div>

//         <div className={styles.cardLogos}>
//           <img src={visa} alt="Visa" />
//           <img src={mastercard} alt="Mastercard" />
//           <img src={discover} alt="Discover" />
//           <img src={cibamerica} alt="Amex" />
//         </div>
//       </div>

//       <form className={styles.card}>
//         <h2 className={styles.headerTwo}>Billing Details</h2>

//         <div className={styles.section}>
//           <label htmlFor="name" className={styles.commnLabel}>
//             Full Name
//           </label>
//           <input
//             id="name"
//             type="text"
//             className={`${styles.commonInput} ${styles.fullInput}`}
//           />
//         </div>

//         <div className={styles.section}>
//           <label htmlFor="address" className={styles.commnLabel}>
//             Address
//           </label>
//           <input
//             id="address"
//             type="text"
//             className={`${styles.commonInput} ${styles.fullInput}`}
//           />
//         </div>

//         <div className={`${styles.section} ${styles.row}`}>
//           <div className={styles.field}>
//             <label htmlFor="apt" className={styles.commnLabel}>
//               Apt/Suite
//             </label>
//             <input
//               id="apt"
//               type="text"
//               className={`${styles.commonInput} ${styles.halfInput}`}
//             />
//           </div>
//           <div className={styles.field}>
//             <label htmlFor="city" className={styles.commnLabel}>
//               City
//             </label>
//             <input
//               id="city"
//               type="text"
//               className={`${styles.commonInput} ${styles.halfInput}`}
//             />
//           </div>
//         </div>

//         <div className={`${styles.section} ${styles.row}`}>
//           <div className={styles.field}>
//             <label htmlFor="state" className={styles.commnLabel}>
//               State
//             </label>
//             <select
//               id="state"
//               className={`${styles.commonInput} ${styles.halfInput}`}
//             >
//               <option>State 1</option>
//               <option>State 2</option>
//               <option>State 3</option>
//             </select>
//           </div>
//           <div className={styles.field}>
//             <label htmlFor="zip" className={styles.commnLabel}>
//               Zip Code
//             </label>
//             <input
//               id="zip"
//               type="text"
//               className={`${styles.commonInput} ${styles.halfInput}`}
//             />
//           </div>
//         </div>

//         <div className={styles.buttonRow}>
//           <button type="button" className={styles.btnOne}>
//             Cancel
//           </button>
//           <button type="submit" className={styles.btnTwo}>
//             Add
//           </button>
//         </div>

//         <p className={styles.noTransactions}>No recent transaction.</p>
//       </form>
//     </div>
//   );
// }

// export default Billing;

