
// // FINALL 

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "../../../api-config";
// import ReceiptCardCompact from "./ReceiptCardCompact";

// const AllReceipts = () => {
//   const [receipts, setReceipts] = useState([]);
//   const [loading, setLoading] = useState(true);

// useEffect(() => {
//   window.scrollTo(0, 0);
// }, []);

//   useEffect(() => {
//     const doctorId = localStorage.getItem("doctorId");
//     const fetchReceipts = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/receipts/doctor/${doctorId}`);
//         setReceipts(res.data.receipts || []);
//       } catch (err) {
//         console.error("Error fetching receipts:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchReceipts();
//   }, []);

//   return (
//     /* Sidebar spacing alignment */
//     <div className="ml-0 md:pl-[80px] lg:pl-[260px] xl:pl-[300px] mt-[10px] px-4 sm:px-8 font-urbanist bg-[#F8FAFB] min-h-screen pb-16">
      
//       {/* Simplified Professional Header */}
//       <div className="max-w-5xl mx-auto pt-8 mb-8">
//         <div className="border-b border-gray-200/60 pb-3"> {/* Reduced pb-5 to pb-3 */}
//           <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A1C1E] tracking-tight">
//             Patient <span className="text-[#00A99D]">Receipts</span>
//           </h1>
//           <p className="text-gray-500 mt-2 text-base font-medium">
//             A complete history of all patient billing and consultation records.
//           </p>
//         </div>
//       </div>

//       {/* Receipts List Area */}
//       <div className="max-w-5xl mx-auto">
//         {loading ? (
//           <div className="flex justify-center items-center h-64 ">
//             <div className="w-10 h-10 border-4 border-[#00A99D]/20 border-t-[#00A99D] rounded-full animate-spin"></div>
//           </div>
//         ) : receipts.length > 0 ? (
//           <div className="grid grid-cols-1 gap-6">
//             {receipts.map((r) => (
//               /* Clean Professional Hover */
//               <div 
//                 key={r._id} 
//                 className="group relative transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5"
//               >
//                 {/* Subtle Brand Glow */}
//                 <div className="absolute inset-0 bg-[#00A99D]/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
//                 <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] group-hover:border-[#00A99D]/30 transition-all duration-500 overflow-hidden">
//                    {/* Passing isDashboard={false} here triggers the 
//                       full details section in your ReceiptCardCompact component 
//                    */}
//                    <ReceiptCardCompact receipt={r} isDashboard={false} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-inner">
//               <p className="text-gray-400 font-semibold tracking-wide uppercase text-sm">No billing records found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllReceipts;









import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; // Added for anchor scrolling
import { API_BASE_URL } from "../../../api-config";
import ReceiptCardCompact from "./ReceiptCardCompact";

const AllReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // To detect the #ID in the URL

  useEffect(() => {
    const doctorId = localStorage.getItem("doctorId");
    
    const fetchReceipts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/receipts/doctor/${doctorId}`);
        setReceipts(res.data.receipts || []);
      } catch (err) {
        console.error("Error fetching receipts:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReceipts();
  }, []);

  // NEW EFFECT: Handles scrolling to the specific receipt clicked from Dashboard
  useEffect(() => {
    if (!loading && receipts.length > 0) {
      if (location.hash) {
        // Remove the '#' from the hash to get the ID
        const id = location.hash.replace("#", "");
        const element = document.getElementById(id);
        
        if (element) {
          // Add a small timeout to ensure DOM is fully rendered
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      } else {
        // Default behavior: Scroll to top if no specific ID is provided
        window.scrollTo(0, 0);
      }
    }
  }, [loading, receipts, location]);

  return (
    /* Sidebar spacing alignment */
    <div className="ml-0 md:pl-[80px] lg:pl-[260px] xl:pl-[300px] mt-[10px] px-4 sm:px-8 font-urbanist bg-[#F8FAFB] min-h-screen pb-16">
      
      {/* Professional Header - Reduced Spacing */}
      <div className="max-w-5xl mx-auto pt-4 mb-4">
        <div className="border-b border-gray-200/60 pb-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A1C1E] tracking-tight">
            Patient <span className="text-[#00A99D]">Receipts</span>
          </h1>
          <p className="text-gray-500 mt-1 text-base font-medium">
            A complete history of all patient billing and consultation records.
          </p>
        </div>
      </div>

      {/* Receipts List Area */}
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64 ">
            <div className="w-10 h-10 border-4 border-[#00A99D]/20 border-t-[#00A99D] rounded-full animate-spin"></div>
          </div>
        ) : receipts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {receipts.map((r) => (
              /* Wrap in div with ID for anchor scrolling */
              <div 
                key={r._id} 
                id={`receipt-${r._id}`} // This ID matches the hash from navigation
                className="group relative transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5"
              >
                {/* Subtle Brand Glow */}
                <div className="absolute inset-0 bg-[#00A99D]/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] group-hover:border-[#00A99D]/30 transition-all duration-500 overflow-hidden">
                   <ReceiptCardCompact receipt={r} isDashboard={false} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-inner">
              <p className="text-gray-400 font-semibold tracking-wide uppercase text-sm">No billing records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllReceipts;







// const handleViewClick = (receipt) => {
//   // This navigates to /doctor/receipts#receipt-12345
//   navigate(`/doctor/receipts#receipt-${receipt._id}`);
// };

// // ... inside your Dashboard return
// <ReceiptCardCompact 
//   receipt={r} 
//   isDashboard={true} 
//   onViewClick={handleViewClick} 
// />