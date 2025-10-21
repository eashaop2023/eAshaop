// import React, { useState , useEffect} from "react";
// import eAdd from "../../assets/add.png";
// import HeartIcon from "../../assets/icons/Heart.png";
// import BloodIcon from "../../assets/icons/blood.png";
// import StepsIcon from "../../assets/icons/legfist.png";
// import RunningIcon from "../../assets/icons/run.png";
// import CyclingIcon from "../../assets/icons/cyckling.png";
// import ParacetamolIcon from "../../assets/icons/paracetamol.png";
// import SyrupIcon from "../../assets/icons/syrup.png";
// import { BellIcon, CalendarDays, StarsIcon } from "lucide-react";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import docImage from "../../assets/icons/doc.png";
// import DownArrow from "../../assets/icons/downarrow.png";
// import trendUp from "../../assets/icons/trend-up.png";
// import healthcare from "../../assets/icons/healtcare.png";
// import Stethoscope from "../../assets/icons/stethoscope.png";
// import profile from "../../assets/icons/profile.png";
// import rating from "../../assets/icons/star.png";
// import steth from "../../assets/icons/steth.png";
// import maps from "../../assets/icons/Maps.png";

// import eashalog from "../../assets/eashalog.png";
// import bookread from "../../assets/bookreading.png";
// import { useNavigate } from "react-router-dom";
// import styles from './DBoard.module.css';
// import axios from "axios";
// import { API_BASE_URL } from "../../../api-config";

// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";



// // Top of file (or outside component)
// const promotedDoctors = [
//   {
//     name: "Dr. Neha Sharma",
//     speciality: "Cardiologist",
//     profileImage: docImage,
//     hospital: "Fortis Hospital",
//     experience: 12,
//     fee: 800,
//     rating: 4.9,
//   },
//   {
//     name: "Dr. Rahul Mehta",
//     speciality: "Neurologist",
//     profileImage: docImage,
//     hospital: "Apollo Hospital",
//     experience: 10,
//     fee: 900,
//     rating: 4.7,
//   },
//   {
//     name: "Dr. Anjali Verma",
//     speciality: "Dermatologist",
//     profileImage: docImage,
//     hospital: "Max Healthcare",
//     experience: 8,
//     fee: 750,
//     rating: 4.8,
//   },
// ];


// const sliderSettings = {
//   dots: true,
//   infinite: true,
//   speed: 500,
//   slidesToShow: 2,
//   slidesToScroll: 1,
//   autoplay: true,
//   autoplaySpeed: 4000,
//   responsive: [
//     {
//       breakpoint: 768,
//       settings: { slidesToShow: 1 },
//     },
//   ],
// };



// const statsData = [
//   {
//     title: "Heart rate",
//     value: "80.2",
//     subvalue: "BPM",
//     icon: HeartIcon,
//     // trend: true,
//   },
//   { title: "Blood pressure", value: "120/75", icon: BloodIcon,  },
//   {
//     title: "Most activities",
//     value: "7",
//     subvalue: "Hours",
//     icon: BloodIcon,
//     // trend: true,
//   },
//   { title: "", value: "8,300", icon: StepsIcon },
//   { title: "", value: "2", subvalue: "Hours", icon: RunningIcon },
//   { title: "", value: "6", subvalue: "KM", icon: CyclingIcon },
// ];

// const activityData = [
//   {
//     title: "Most activities",
//     value: "7",
//     subvalue: "Hours",
//     icon: BloodIcon,
//     trend: true,
//   },
//   { title: "", value: "8,300", icon: StepsIcon },
//   { title: "", value: "2", subvalue: "Hours", icon: RunningIcon },
//   { title: "", value: "6", subvalue: "KM", icon: CyclingIcon },
// ];

// const images = [eAdd, eAdd, eAdd, eAdd, eAdd];

// const reminders = [
//   {
//     icon: ParacetamolIcon,
//     name: "Paracetamol 325 mg",
//     dose: "1 Pill",
//     time: "9:20 am, Today",
//   },
//   {
//     icon: ParacetamolIcon,
//     name: "Paracetamol 325 mg",
//     dose: "1 Pill",
//     time: "9:20 am, Today",
//   },
//   {
//     icon: SyrupIcon,
//     name: "Pagdol P",
//     dose: "Syrup 5ml",
//     time: "9:20 am, Today",
//   },
//   {
//     icon: SyrupIcon,
//     name: "Pagdol P",
//     dose: "Syrup 5ml",
//     time: "9:20 am, Today",
//   },
//   {
//     icon: SyrupIcon,
//     name: "Pagdol P",
//     dose: "Syrup 5ml",
//     time: "9:20 am, Today",
//   },
//   {
//     icon: SyrupIcon,
//     name: "Pagdol P",
//     dose: "Syrup 5ml",
//     time: "9:20 am, Today",
//   },
// ];

// const prescriptions = [
//   { title: "Prescription - 1", subtitle: "Dr. Jackob Jones" },
//   { title: "Prescription - 2", subtitle: "Dr. Jackob Jones" },
//   { title: "CT Scan", subtitle: "KIMS Hospital, Hyderabad, Telangana." },
//   { title: "Blood Test", subtitle: "Shylaja Lab, Hyderabad, Telangana." },
//   { title: "MRI", subtitle: "Shylaja Lab, Hyderabad, Telangana." },
// ];

// // const doctors = Array(3).fill({
// //   name: "Dr. Clara Bennett",
// //   spec: "Pulmonologist",
// //   slots: "56 slots available",
// //   rating: "4.2",
// //   next: "Next slot today at 12:40pm",
// // });

// function DBoard() {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [showContent, setShowContent] = useState(false);
//   const [shownIndex, setShownIndex] = useState(null);
//   const [user,setUser]=useState(null);
//   const [loading, setLoading] = useState(true);

//   const [doctors, setDoctors] = useState([]);
//   const navigate = useNavigate();
//   const [appointments,setAppointments]=useState([]);

// useEffect(() => {
//   const storedUser = JSON.parse(localStorage.getItem("user"));
//   console.log("Stored User from localStorage:", storedUser);

//   if (!storedUser?.id) {
//     console.warn("No user found in localStorage, skipping fetch.");
//     setLoading(false);
//     return;
//   }
//    const userId = localStorage.getItem("userId");
    
//         const fetchAppointments = async () => {
//           try {
//             const res = await axios.get(
//               `${API_BASE_URL}/api/appointments/user/${userId}`
//             );
//             console.log("response from backend",res)
//             setAppointments({
//               upcoming: res.data.upcoming || [],
//               past: res.data.past || [],
//             });
//           } catch (err) {
//             console.error("Error fetching appointments:", err);
//           } finally {
//             setLoading(false);
//           }
//         };
//   // Show stored user immediately
//   setUser(storedUser);

//   // Fetch latest user data from backend
//   fetch(`${API_BASE_URL}/api/user/${storedUser.id}`)
//     .then((res) => res.json()) // parse JSON
//     .then((data) => {
//       console.log("Fetched user from API:", data);
//       // backend should return { user: {...} } or just {...}
//       setUser(data.user || data || storedUser);
//     })
//     .catch((err) => {
//       console.error("Error fetching user:", err);
//     })
//     .finally(() => setLoading(false));

//         // if (userId) fetchAppointments();
     
// }, []);

// useEffect(() => {
//    const userId = localStorage.getItem("userId");
    
//         const fetchAppointments = async () => {
//           try {
//             const res = await axios.get(
//               `${API_BASE_URL}/api/appointments/user/${userId}`
//             );
//             console.log("response from backend",res)
//             setAppointments({
//               upcoming: res.data.upcoming || [],
//               past: res.data.past || [],
//             });
//           } catch (err) {
//             console.error("Error fetching appointments:", err);
//           } finally {
//             setLoading(false);
//           }
//         };
//         fetchAppointments();
//   fetch(`${API_BASE_URL}/api/doctors/all`)
//     .then((res) => res.json())
//    .then((data) => {
//   console.log("Fetched doctors:", data);

//   // Make sure data.doctors exists and is an array
//   if (Array.isArray(data.doctors)) {
//     setDoctors(data.doctors.slice(0, 3)); // ✅ Get top 3 doctors
//   } else {
//     setDoctors([]); // fallback
//   }
// })

//     .catch((err) => {
//       console.error("Error fetching doctors:", err);
//       setDoctors([]);
//     });
// }, []);



//   return (
//     <div className={`${styles.dMainContainer} flex justify-end`}>
//       <div className={`${styles.dContainer} flex w-[1080px] mt-5 gap-10`}>
//         <div className={`container max-w-7xl mt-5 pt-6 space-y-6`}>
//           <div className="grid grid-cols-[1fr] justify-between items-center">
//             <div className={`${styles.dboardContainer}`} style={{marginTop:"1rem"}} >
//               <h1 className="dboard-header font-urbanist font-bold text-[24px] leading-[120%] text-[#013A63]">
//                 {loading ? "Loading..." : user ? `Hey, ${user.full_name}!` : "User not found"}
//               </h1>
//               <div className="flex items-center gap-2">
//                 <p className="text-[#252525] font-urbanist font-normal text-[18px] leading-[120%]">
//                   Your health is in safe hands
//                 </p>
//                 <span>
//                   <img src={healthcare} alt="" className="inline-block pb-3" />
//                 </span>
//               </div>
             

//             </div>
//           </div>

//           <div className={`${styles.statesDateOne}  w-full grid grid-cols-1  sm:grid-cols-1 lg:grid-cols-3 lg:gap-2  gap-4`}>
//             <div className={` ${styles.innerStateData} grid grid-cols-2 gap-4`}>
//               {statsData.slice(0, 2).map((s, i) => (
//                 <div
//                   key={i}
//                   className="bg-white h-[180px] w-full p-4 rounded-lg border border-gray-50 flex flex-col items-start"
//                 >
//                   <img
//                     src={s.icon}
//                     alt={s.title}
//                     className="bg-[#EDFFFE] p-3 rounded-xl"
//                   />
//                   <h3 className="dboard-h3 mt-2 font-normal leading-[120%] text-[18px] text-[#000000]">
//                     {s.title}
//                   </h3>
//                   <div className="flex items-center space-x-1">
//                     <span className={`${styles.statesValue} text-[24px] font-bold leading-[120%] text-[#252525] font-urbanist`}>
//                       {s.value}
//                     </span>
//                     <p className={` ${styles.statesSubvalue} text-[18px] pt-3 font-extralight leading-[120%] text-[#252525]`}>
//                       {s.subvalue}
//                     </p>
//                     {s.trend && (
//                       <img src={trendUp} alt="trend" className="w-5 h-5 pt-1" />
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className={`${styles.statesData} grid grid-cols-2 lg:grid-cols-2 rounded-2xl xl:grid-cols-4 lg:border lg:border-gray-100 border-r border-gray-50 gap-4 col-span-1 sm:col-span-1 sm:gap-3  lg:col-span-2`}>
//               {statsData.slice(2, 6).map((s, i) => (
//                <>
//                   <div
//                   key={i}
//                   className={`${styles.customBorder} bg-white h-[170px] w-full p-4 flex flex-col items-start border-r border-gray-100 `}
//                   style={{
//                     borderRight:"1px solid #f3f4f6",
//                     minHeight: "100%"
//                   }}
//                 >
//                   <img
//                     src={s.icon}
//                     alt={s.title}
//                     className="bg-[#EDFFFE] p-3 rounded-xl"
//                   />
//                   <h3 className="dboard-h3 mt-1 font-normal leading-[120%] text-[18px] text-[#000000]">
//                     {s.title}
//                   </h3>
//                   <div className={` ${styles.dContainers} `}>
//                     <span className="text-[24px] font-bold leading-[120%] text-[#252525] font-urbanist">
//                       {s.value}
//                     </span>
//                     <p className={` ${styles.subpara} text-[18px] pt-3 font-extralight leading-[120%] text-[#252525]`}>
//                       {s.subvalue}
//                     </p>
//                     {s.trend && (
//                       <img src={trendUp} alt="trend" className="w-5 h-5 pt-1" />
//                     )}
//                   </div>
     
//                 </div>
               
//                </>
//               ))}
//             </div>
//           </div>

//           <div>
//             <div className="flex justify-between items-center mb-3">
//               <h2 className="sec-header text-[#252525]">Medicine reminder</h2>
//               <button
//                 className="text-[18px] text-[#494949] leading-[120%]"
//                 // onClick={() => {
//                 //   navigate("/medication");
//                 // }}
//               >
//                 View all
//               </button>
//             </div>
//             <div className={`${styles.mainSnapcontainer} flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory hide-scrollbar`}>
//               {reminders.map((r, i) => (
//                 <div
//                   key={i}
//                   className={`${styles.snapcontainer} snap-start min-w-[284px] h-[120px] border bg-white rounded-2xl p-4 relative`}
//                   style={{minWidth:"284px"}}
//                 >
//                   <span className={`absolute right-1 top-1 bg-[#E23F3F] text-white text-[14px] px-2 py-0.5 rounded-full rounded-tl-lg rounded-br-lg`}>
//                     {r.time}
//                   </span>
//                   <div className={`${styles.innerSnap} flex items-center mt-3 space-x-3`}>
//                     <div className="bg-[#EDFFFE] mb-3 p-3 rounded-lg">
//                       <img src={r.icon} alt={r.name} className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <p className={`${styles.reminderPara}`}>{r.name}</p>
//                       <p className="text-[14px] text-[#8E8E8E] leading-[120%]">
//                         {r.dose}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div>
//             <div className="flex justify-between items-center mb-2">
//               <h2 className="sec-header font-medium leading-[120%] text-[#252525] text-[24px]">
//                 Upcoming appointments
//               </h2>
//               <button
//                 className="text-[#494949] text-[18px] font-normal hover:cursor-pointer hover:underline"
//                 onClick={() => {
//                   navigate("/user/appointment");
//                 }}
//               >
//                 View all
//               </button>
//             </div>
//            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//   {appointments.upcoming?.map((a, i) => {
//     const isShown = shownIndex === i;
//     const dateObj = new Date(a.date);
//     const formattedDate = dateObj.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });

//    return (
//   <div
//     key={i}
//     className="bg-white p-3 rounded-md border flex flex-col justify-between text-sm"
//   >
//     <div>
//       <div className="flex justify-between items-start">
//         <div className="space-y-1">
//           <p className="text-[#333]">
//             <strong>Doctor Name:</strong> {a.doctor.name}
//           </p>
//           <p className="text-[#555]">
//             <strong>Speciality:</strong> {a.doctor.speciality}
//           </p>
//           <p className="text-[#555]">
//             <strong>Consultation Mode:</strong> {a.doctor.consultationMode}
//           </p>
//           <p className="text-[#555]">
//             <strong>Hospital:</strong> {a.doctor.hospitalName}
//           </p>
//         </div>

//         <div className="h-[45px] w-[45px] rounded-full flex items-center justify-center bg-[#F7F7F7]">
//           <img
//             src={a.doctor.profileImage}
//             alt="Doctor"
//             className="h-[28px] w-[28px]"
//           />
//         </div>
//       </div>

//       <div className="flex items-center mt-2 gap-2">
//         <CalendarDays className="w-5 h-5 text-gray-400" />
//         <p className="text-[#555]">
//           <strong>Date:</strong> {formattedDate} | <strong>Time:</strong> {a.time}
//         </p>
//       </div>
//     </div>

//     <div className="mt-3 flex justify-end">
//       <button
//                 className="text-[#494949] text-[18px] font-normal hover:cursor-pointer hover:underline"
//                 onClick={() => {
//                   navigate("/user/appointment");
//                 }}
//               >
//                 View details
//               </button>
//     </div>
//   </div>
// );

//   })}
// </div>


//             {showContent && (
//               <div className="mt-4 grid grid-cols-1 lg:grid-cols-[350px_2fr] items-center p-4 bg-white rounded-lg border">
//                 <div className="w-[350px] h-[135px]">
//                   <h2 className="text-[24px] font-medium leading-[120%] text-[#252525]">
//                     KIMS Hospitals
//                   </h2>
//                   <p className="text-[18px] font-normal text-[#8E8E8E]">
//                     1-8-31/1, Minister Road Krishna Nagar Colony, Ramgopalpet,
//                     Begumpet, Secunderabad, Telangana 500003
//                     <br />
//                     <span>4.5 km | 24min</span>
//                   </p>
//                 </div>

//                 <div>
//                   <img src={maps} alt="" className="w-full object-cover" />
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div className="bg-white rounded-lg border border-gray-50">
//               <div className="flex justify-between px-4 py-3 relative">
//                 <h2 className="labtest-header text-[24px] font-normal leading-[120%] text-[#252525]">
//                   Lab tests & Prescriptions
//                 </h2>
//                 <button
//                   className={`${styles.viewallBtn} text-[18px] font-normal leading-[120%] hover:cursor-pointer text-[#494949]`}
//                   // onClick={() => {
//                   //   navigate("/lab");
//                   // }}
//                 >
//                   View all
//                 </button>
//               </div>
//               <div>
//                 {prescriptions.map((p, i) => (
//                   <div
//                     key={i}
//                     className="flex justify-between items-center px-4 py-3 border-b-[0.5px] border-gray-100"
//                   >
//                     <div>
//                       <p className="text-[18px] leading-[120%] text-[#252525] font-medium">
//                         {p.title}
//                       </p>
//                       <p className="text-[15px] text-[#6B7582] font-normal">
//                         {p.subtitle}
//                       </p>
//                     </div>
//                     <img
//                       src={DownArrow}
//                       alt="Download"
//                       download
//                       className="w-[54px] h-[54px] p-[10px] hover:cursor-pointer"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white grid grid-rows-[50px_1fr_1fr_1fr] gap-2 rounded-lg border">
//               <div className="flex items-start justify-between px-4 py-3">
//                 <h2 className="labtest-header text-[24px] font-normal leading-[120%] text-[#252525]">
//                   My Doctor
//                 </h2>
//                 <button
//                   className="doctoView text-[18px] font-normal leading-[120%] hover:cursor-pointer text-[#494949]"
//                   onClick={() => {
//                     navigate("/user/category");
//                   }}
//                 >
//                   View all
//                 </button>
//               </div>
//               {doctors.map((d, i) => (
//   <div
//     key={i}
//     className="flex items-start gap-2 px-4 py-3 border-b-[0.5px] border-gray-100"
//   >
//     <img
//       src={d.profileImage || docImage} // ✅ Use real image if available
//       alt={d.name}
//       className="w-[92px] h-[92px] rounded-xl object-cover"
//     />
//     <div className="flex-1 ml-4">
//       <div className="flex gap-3 items-center">
//         <span className="bg-green-100 text-[#06A343] py-[6px] px-[8px] rounded-[6px] text-[14px] font-normal">
//           {d.consultationMode || "Clinic Visit"}
//         </span>
//         <span className="flex items-center gap-1 text-[14px] font-normal text-[#494949]">
//           <img src={rating} alt="rating" className="h-[15px] w-[15px]" />
//           <span>{d.averageRating || "4.5"} / 5</span>
//         </span>
//       </div>
//       <h3 className="docname-header font-Urbanist font-medium text-[18px] text-[#252525] leading-[120%] mt-1">
//         Dr. {d.name}
//       </h3>
//       <div className="flex items-start gap-2 mt-1">
//         <img src={steth} alt="Stethoscope" />
//         <p className="font-normal text-[14px] text-[#494949] leading-[120%]">
//           {d.speciality}
//         </p>
//       </div>
//       <div className="flex justify-between items-center mt-1">
//         <p className="font-normal text-[14px] text-[#494949] leading-[120%]">
//           {`Experience: ${d.experience} years | Fee: ₹${d.consultationFee}`}
//         </p>
//         <button
//           className={`${styles.bookslotBtn} h-[45px] btn rounded-[28px] py-[10px] px-[24px] hover:cursor-pointer`}
//           onClick={() => {
//             navigate("/user/category");
//           }}
//           style={{
//             backgroundColor: "#00A99D",
//             color: "white",
//             borderRadius: "28px",
//             fontSize: "12px",
//           }}
//         >
//           Book a slot
//         </button>
//       </div>
//     </div>
//   </div>
// ))}

//               {/* {doctors.map((d, i) => (
//                 <div
//                   key={i}
//                   className="flex items-start gap-2 px-4 py-3 border-b-[0.5px] border-gray-100"
//                 >
//                   <img
//                     src={docImage}
//                     alt={d.name}
//                     className="w-[92px] h-[92px] rounded-xl"
//                   />
//                   <div className="flex-1 ml-4">
//                     <div className="flex gap-3 items-center">
//                       <span className="bg-green-100 text-[#06A343] py-[6px] px-[8px] rounded-[6px] text-[14px] font-normal">
//                         {d.slots}
//                       </span>
//                       <span className={`${styles.ratingSpan} flex items-center gap-1 text-[14px] font-normal text-[#494949]`}>
//                         <img
//                           src={rating}
//                           alt=""
//                           className="h-[15px] w-[15px]"
//                         />
//                         <span>{d.rating} / 5</span>
//                       </span>
//                     </div>
//                     <h3 className="docname-header font-Urbanist font-medium text-[18px] text-[#252525] leading-[120%] mt-1">
//                       {d.name}
//                     </h3>
//                     <div className="flex items-start gap-2 mt-1">
//                       <img src={steth} alt="" />
//                       <p className="font-normal text-[14px] text-[#494949] leading-[120%]">
//                         {d.spec}
//                       </p>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <p className="font-normal text-[14px] text-[#494949] leading-[120%]">
//                         {d.next}
//                       </p>
//                       <button
//                         className={`${styles.bookslotBtn} h-[45px] btn rounded-[28px] py-[10px] px-[24px] hover:cursor-pointer`}
//                         onClick={() => {
//                           navigate("/user/category");
//                         }}
//                         style={{
//                           // bg-[#00A99D] text-white
//                           backgroundColor:"#00A99D",
//                           color:"white",
//                           borderRadius:"28px",
//                           fontSize:"12px",
//                         }}
//                       >
//                         Book a slot
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))} */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DBoard;




import React, { useState , useEffect} from "react";
import eAdd from "../../assets/add.png";
import HeartIcon from "../../assets/icons/Heart.png";
import BloodIcon from "../../assets/icons/blood.png";
import StepsIcon from "../../assets/icons/legfist.png";
import RunningIcon from "../../assets/icons/run.png";
import CyclingIcon from "../../assets/icons/cyckling.png";
import ParacetamolIcon from "../../assets/icons/paracetamol.png";
import SyrupIcon from "../../assets/icons/syrup.png";
import { BellIcon, CalendarDays, StarsIcon } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import docImage from "../../assets/icons/doc.png";
import DownArrow from "../../assets/icons/downarrow.png";
import trendUp from "../../assets/icons/trend-up.png";
import healthcare from "../../assets/icons/healtcare.png";
import Stethoscope from "../../assets/icons/stethoscope.png";
import profile from "../../assets/icons/profile.png";
import rating from "../../assets/icons/star.png";
import steth from "../../assets/icons/steth.png";
import maps from "../../assets/icons/Maps.png";

import eashalog from "../../assets/eashalog.png";
import bookread from "../../assets/bookreading.png";
import { useNavigate } from "react-router-dom";
import styles from './DBoard.module.css';
import axios from "axios";
import { API_BASE_URL } from "../../../api-config";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { ChevronRight, ChevronLeft } from "lucide-react"; // or use any icon you prefer



// Top of file (or outside component)
const promotedDoctors = [
  {
    name: "Dr. Neha Sharma",
    speciality: "Cardiologist",
    profileImage: docImage,
    hospital: "Fortis Hospital",
    experience: 12,
    fee: 800,
    rating: 4.9,
  },
  {
    name: "Dr. Rahul Mehta",
    speciality: "Neurologist",
    profileImage: docImage,
    hospital: "Apollo Hospital",
    experience: 10,
    fee: 900,
    rating: 4.7,
  },
  {
    name: "Dr. Anjali Verma",
    speciality: "Dermatologist",
    profileImage: docImage,
    hospital: "Max Healthcare",
    experience: 8,
    fee: 750,
    rating: 4.8,
  },
  {
    name: "Dr. Rahul Mehta",
    speciality: "Neurologist",
    profileImage: docImage,
    hospital: "Apollo Hospital",
    experience: 10,
    fee: 900,
    rating: 4.7,
  },
  {
    name: "Dr. Anjali Verma",
    speciality: "Dermatologist",
    profileImage: docImage,
    hospital: "Max Healthcare",
    experience: 8,
    fee: 750,
    rating: 4.8,
  },{
    name: "Dr. Rahul Mehta",
    speciality: "Neurologist",
    profileImage: docImage,
    hospital: "Apollo Hospital",
    experience: 10,
    fee: 900,
    rating: 4.7,
  },
  {
    name: "Dr. Anjali Verma",
    speciality: "Dermatologist",
    profileImage: docImage,
    hospital: "Max Healthcare",
    experience: 8,
    fee: 750,
    rating: 4.8,
  },
  {
    name: "Dr. Rahul Mehta",
    speciality: "Neurologist",
    profileImage: docImage,
    hospital: "Apollo Hospital",
    experience: 10,
    fee: 900,
    rating: 4.7,
  },
  {
    name: "Dr. Anjali Verma",
    speciality: "Dermatologist",
    profileImage: docImage,
    hospital: "Max Healthcare",
    experience: 8,
    fee: 750,
    rating: 4.8,
  },
  {
    name: "Dr. Rahul Mehta",
    speciality: "Neurologist",
    profileImage: docImage,
    hospital: "Apollo Hospital",
    experience: 10,
    fee: 900,
    rating: 4.7,
  },
  {
    name: "Dr. Anjali Verma",
    speciality: "Dermatologist",
    profileImage: docImage,
    hospital: "Max Healthcare",
    experience: 8,
    fee: 750,
    rating: 4.8,
  },
];


const NextArrow = ({ onClick }) => {
  return (
    <div
      className="absolute top-[35%] right-[-20px] z-10 cursor-pointer bg-white p-2 rounded-full shadow"
      onClick={onClick}
    >
      <ChevronRight className="text-[#013A63] w-6 h-6" />
    </div>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="absolute top-[35%] left-[-20px] z-10 cursor-pointer bg-white p-2 rounded-full shadow"
      onClick={onClick}
    >
      <ChevronLeft className="text-[#013A63] w-6 h-6" />
    </div>
  );
};



const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  autoplay: true,
  autoplaySpeed: 4000,
  responsive: [
    {
      breakpoint: 768,
      settings: { slidesToShow: 1 },
    },
  ],
};



const statsData = [
  {
    title: "Heart rate",
    value: "80.2",
    subvalue: "BPM",
    icon: HeartIcon,
    // trend: true,
  },
  { title: "Blood pressure", value: "120/75", icon: BloodIcon,  },
  {
    title: "Most activities",
    value: "7",
    subvalue: "Hours",
    icon: BloodIcon,
    // trend: true,
  },
  { title: "", value: "8,300", icon: StepsIcon },
  { title: "", value: "2", subvalue: "Hours", icon: RunningIcon },
  { title: "", value: "6", subvalue: "KM", icon: CyclingIcon },
];

const activityData = [
  {
    title: "Most activities",
    value: "7",
    subvalue: "Hours",
    icon: BloodIcon,
    trend: true,
  },
  { title: "", value: "8,300", icon: StepsIcon },
  { title: "", value: "2", subvalue: "Hours", icon: RunningIcon },
  { title: "", value: "6", subvalue: "KM", icon: CyclingIcon },
];

const images = [eAdd, eAdd, eAdd, eAdd, eAdd];

const reminders = [
  {
    icon: ParacetamolIcon,
    name: "Paracetamol 325 mg",
    dose: "1 Pill",
    time: "9:20 am, Today",
  },
  {
    icon: ParacetamolIcon,
    name: "Paracetamol 325 mg",
    dose: "1 Pill",
    time: "9:20 am, Today",
  },
  {
    icon: SyrupIcon,
    name: "Pagdol P",
    dose: "Syrup 5ml",
    time: "9:20 am, Today",
  },
  {
    icon: SyrupIcon,
    name: "Pagdol P",
    dose: "Syrup 5ml",
    time: "9:20 am, Today",
  },
  {
    icon: SyrupIcon,
    name: "Pagdol P",
    dose: "Syrup 5ml",
    time: "9:20 am, Today",
  },
  {
    icon: SyrupIcon,
    name: "Pagdol P",
    dose: "Syrup 5ml",
    time: "9:20 am, Today",
  },
];

const prescriptions = [
  { title: "Prescription - 1", subtitle: "Dr. Jackob Jones" },
  { title: "Prescription - 2", subtitle: "Dr. Jackob Jones" },
  { title: "CT Scan", subtitle: "KIMS Hospital, Hyderabad, Telangana." },
  { title: "Blood Test", subtitle: "Shylaja Lab, Hyderabad, Telangana." },
  { title: "MRI", subtitle: "Shylaja Lab, Hyderabad, Telangana." },
];

// const doctors = Array(3).fill({
//   name: "Dr. Clara Bennett",
//   spec: "Pulmonologist",
//   slots: "56 slots available",
//   rating: "4.2",
//   next: "Next slot today at 12:40pm",
// });

function DBoard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [shownIndex, setShownIndex] = useState(null);
  const [user,setUser]=useState(null);
  const [loading, setLoading] = useState(true);

  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const [appointments,setAppointments]=useState([]);

useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  console.log("Stored User from localStorage:", storedUser);

  if (!storedUser?.id) {
    console.warn("No user found in localStorage, skipping fetch.");
    setLoading(false);
    return;
  }
   const userId = localStorage.getItem("userId");
    
        const fetchAppointments = async () => {
          try {
            const res = await axios.get(
              `${API_BASE_URL}/api/appointments/user/${userId}`
            );
            console.log("response from backend",res)
            setAppointments({
              upcoming: res.data.upcoming || [],
              past: res.data.past || [],
            });
          } catch (err) {
            console.error("Error fetching appointments:", err);
          } finally {
            setLoading(false);
          }
        };
  // Show stored user immediately
  setUser(storedUser);

  // Fetch latest user data from backend
  fetch(`${API_BASE_URL}/api/user/${storedUser.id}`)
    .then((res) => res.json()) // parse JSON
    .then((data) => {
      console.log("Fetched user from API:", data);
      // backend should return { user: {...} } or just {...}
      setUser(data.user || data || storedUser);
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
    })
    .finally(() => setLoading(false));

        // if (userId) fetchAppointments();
     
}, []);

useEffect(() => {
   const userId = localStorage.getItem("userId");
    
        const fetchAppointments = async () => {
          try {
            const res = await axios.get(
              `${API_BASE_URL}/api/appointments/user/${userId}`
            );
            console.log("response from backend",res)
            setAppointments({
              upcoming: res.data.upcoming || [],
              past: res.data.past || [],
            });
          } catch (err) {
            console.error("Error fetching appointments:", err);
          } finally {
            setLoading(false);
          }
        };
        fetchAppointments();
  fetch(`${API_BASE_URL}/api/doctors/all`)
    .then((res) => res.json())
   .then((data) => {
  console.log("Fetched doctors:", data);

  // Make sure data.doctors exists and is an array
  if (Array.isArray(data.doctors)) {
    setDoctors(data.doctors.slice(0, 3)); // ✅ Get top 3 doctors
  } else {
    setDoctors([]); // fallback
  }
})

    .catch((err) => {
      console.error("Error fetching doctors:", err);
      setDoctors([]);
    });
}, []);



  return (
    <div className={`${styles.dMainContainer} flex justify-end`}>
      <div className={`${styles.dContainer} flex w-[1080px] mt-5 gap-10`}>
        <div className={`container max-w-7xl mt-5 pt-6 space-y-6`}>
          <div className="grid grid-cols-[1fr] justify-between items-center">
            <div className={`${styles.dboardContainer}`} style={{marginTop:"1rem"}} >
              <h1 className="dboard-header font-urbanist font-bold text-[24px] leading-[120%] text-[#013A63]">
                {loading ? "Loading..." : user ? `Hey, ${user.full_name}!` : "User not found"}
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-[#252525] font-urbanist font-normal text-[18px] leading-[120%]">
                  Your health is in safe hands
                </p>
                <span>
                  <img src={healthcare} alt="" className="inline-block pb-3" />
                </span>
              </div>
             

            </div>
          </div>

          

          {/* <div className="mt-6">
  <h2 className="text-[24px] text-[#252525] font-semibold mb-3">
     Doctor Suggestion
  </h2>
  <Slider {...sliderSettings}>
    {promotedDoctors.map((doc, index) => (
      <div key={index} className="p-4">
        <div className="bg-white rounded-lg border shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-start">
          <img
            src={doc.profileImage}
            alt={doc.name}
            className="w-[100px] h-[100px] rounded-lg object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-[#013A63]">{doc.name}</h3>
            <p className="text-sm text-[#555]">{doc.speciality}</p>
            <p className="text-sm text-[#777] mt-1">{doc.hospital}</p>
            <p className="text-sm text-[#777] mt-1">
              Experience: {doc.experience} years
            </p>
            <p className="text-sm text-[#777]">Fee: ₹{doc.fee}</p>
            <p className="text-sm text-[#FFB100]">⭐ {doc.rating} / 5</p>
          </div>
        </div>
      </div>
    ))}
  </Slider>
</div> */}


          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="sec-header font-medium leading-[120%] text-[#252525] text-[24px]">
                Upcoming appointments
              </h2>
              <button
                className="text-[#494949] text-[18px] font-normal hover:cursor-pointer hover:underline"
                onClick={() => {
                  navigate("/user/appointment");
                }}
              >
                View all
              </button>
            </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {appointments.upcoming?.map((a, i) => {
    const isShown = shownIndex === i;
    const dateObj = new Date(a.date);
    const formattedDate = dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

   return (
  <div
    key={i}
    className="bg-white p-3 rounded-md border flex flex-col justify-between text-sm"
  >
    <div>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[#333]">
            <strong>Doctor Name:</strong> {a.doctor.name}
          </p>
          <p className="text-[#555]">
            <strong>Speciality:</strong> {a.doctor.speciality}
          </p>
          <p className="text-[#555]">
            <strong>Consultation Mode:</strong> {a.doctor.consultationMode}
          </p>
          <p className="text-[#555]">
            <strong>Hospital:</strong> {a.doctor.hospitalName}
          </p>
        </div>

        <div className="h-[45px] w-[45px] rounded-full flex items-center justify-center bg-[#F7F7F7]">
          <img
            src={a.doctor.profileImage}
            alt="Doctor"
            className="h-[28px] w-[28px]"
          />
        </div>
      </div>

      <div className="flex items-center mt-2 gap-2">
        <CalendarDays className="w-5 h-5 text-gray-400" />
        <p className="text-[#555]">
          <strong>Date:</strong> {formattedDate} | <strong>Time:</strong> {a.time}
        </p>
      </div>
    </div>

    <div className="mt-3 flex justify-end">
      <button
                className="text-[#494949] text-[18px] font-normal hover:cursor-pointer hover:underline"
                onClick={() => {
                  navigate("/user/appointment");
                }}
              >
                View details
              </button>
    </div>
  </div>
);

  })}
</div>


            {showContent && (
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-[350px_2fr] items-center p-4 bg-white rounded-lg border">
                <div className="w-[350px] h-[135px]">
                  <h2 className="text-[24px] font-medium leading-[120%] text-[#252525]">
                    KIMS Hospitals
                  </h2>
                  <p className="text-[18px] font-normal text-[#8E8E8E]">
                    1-8-31/1, Minister Road Krishna Nagar Colony, Ramgopalpet,
                    Begumpet, Secunderabad, Telangana 500003
                    <br />
                    <span>4.5 km | 24min</span>
                  </p>
                </div>

                <div>
                  <img src={maps} alt="" className="w-full object-cover" />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg border border-gray-50">
              <div className="flex justify-between px-4 py-3 relative">
                <h2 className="labtest-header text-[24px] font-normal leading-[120%] text-[#252525]">
                  Lab tests & Prescriptions
                </h2>
                <button
                  className={`${styles.viewallBtn} text-[18px] font-normal leading-[120%] hover:cursor-pointer text-[#494949]`}
                  // onClick={() => {
                  //   navigate("/lab");
                  // }}
                >
                  View all
                </button>
              </div>
              <div>
                {prescriptions.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center px-4 py-3 border-b-[0.5px] border-gray-100"
                  >
                    <div>
                      <p className="text-[18px] leading-[120%] text-[#252525] font-medium">
                        {p.title}
                      </p>
                      <p className="text-[15px] text-[#6B7582] font-normal">
                        {p.subtitle}
                      </p>
                    </div>
                    <img
                      src={DownArrow}
                      alt="Download"
                      download
                      className="w-[54px] h-[54px] p-[10px] hover:cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white grid grid-rows-[50px_1fr_1fr_1fr] gap-2 rounded-lg border">
              <div className="flex items-start justify-between px-4 py-3">
                <h2 className="labtest-header text-[24px] font-normal leading-[120%] text-[#252525]">
                  My Doctor
                </h2>
                <button
                  className="doctoView text-[18px] font-normal leading-[120%] hover:cursor-pointer text-[#494949]"
                  onClick={() => {
                    navigate("/user/category");
                  }}
                >
                  View all
                </button>
              </div>
      {doctors.map((d, i) => (
  // Main container: Column on small, Row on medium/large screens, with consistent padding/border
  <div
    key={i}
    className="flex flex-col md:flex-row items-start gap-4 p-4 border-b border-gray-100"
    // Changed 'sm:' to 'md:' for the main layout shift for a better tablet-mobile distinction
  >
    {/* Profile Image: Size adjusts on medium screens and up */}
    <img
      src={d.profileImage || docImage}
      alt={d.name}
      className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-xl object-cover"
      // Adjusted 'sm:w-[92px]' to 'md:w-[100px]' for a slightly larger desktop image
    />

    <div className="flex-1 w-full">
      {/* Top Row: Tag + Rating + Button (on desktop) */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        {/* Left Side: Tag and Rating */}
        <div className="flex gap-2 items-center mb-2 sm:mb-0">
          <span className="bg-green-100 text-[#06A343] py-[4px] px-[6px] rounded-[6px] text-[13px] font-medium whitespace-nowrap">
            {d.consultationMode || "Clinic Visit"}
          </span>
          <span className="flex items-center gap-1 text-[13px] font-normal text-[#494949] whitespace-nowrap">
            <img src={rating} alt="rating" className="h-[14px] w-[14px]" />
            {d.averageRating || "4.5"} / 5
          </span>
        </div>

        {/* Book Button for larger screens (sm and up) */}
        <div className="hidden sm:block">
          <button
            className="bg-[#00A99D] text-white py-2 px-6 rounded-full text-[14px] font-medium hover:opacity-90 transition"
            onClick={() => navigate("/user/category")}
          >
            Book a slot
          </button>
        </div>
      </div>

      {/* Doctor Details */}
      <h3 className="text-[17px] font-semibold text-[#252525] mt-1">
        Dr. {d.name}
      </h3>

      {/* Speciality */}
      <div className="flex items-start gap-2 mt-1">
        <img src={steth} alt="Stethoscope" className="h-4 w-4 mt-[2px]" />
        <p className="text-[14px] text-[#494949]">{d.speciality}</p>
      </div>

      {/* Experience and Fee */}
      <p className="text-[13px] text-[#494949] mt-1">
        Experience: **{d.experience}** years | Fee: **₹{d.consultationFee}**
      </p>

      {/* Book Button for small screens (full width, hidden on sm and up) */}
      <div className="mt-3 sm:hidden">
        <button
          className="w-full bg-[#00A99D] text-white py-2 rounded-full text-[14px] font-medium hover:opacity-90 transition"
          onClick={() => navigate("/user/category")}
        >
          Book a slot
        </button>
      </div>
    </div>
  </div>
))}


              {/* {doctors.map((d, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 px-4 py-3 border-b-[0.5px] border-gray-100"
                >
                  <img
                    src={docImage}
                    alt={d.name}
                    className="w-[92px] h-[92px] rounded-xl"
                  />
                  <div className="flex-1 ml-4">
                    <div className="flex gap-3 items-center">
                      <span className="bg-green-100 text-[#06A343] py-[6px] px-[8px] rounded-[6px] text-[14px] font-normal">
                        {d.slots}
                      </span>
                      <span className={`${styles.ratingSpan} flex items-center gap-1 text-[14px] font-normal text-[#494949]`}>
                        <img
                          src={rating}
                          alt=""
                          className="h-[15px] w-[15px]"
                        />
                        <span>{d.rating} / 5</span>
                      </span>
                    </div>
                    <h3 className="docname-header font-Urbanist font-medium text-[18px] text-[#252525] leading-[120%] mt-1">
                      {d.name}
                    </h3>
                    <div className="flex items-start gap-2 mt-1">
                      <img src={steth} alt="" />
                      <p className="font-normal text-[14px] text-[#494949] leading-[120%]">
                        {d.spec}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-normal text-[14px] text-[#494949] leading-[120%]">
                        {d.next}
                      </p>
                      <button
                        className={`${styles.bookslotBtn} h-[45px] btn rounded-[28px] py-[10px] px-[24px] hover:cursor-pointer`}
                        onClick={() => {
                          navigate("/user/category");
                        }}
                        style={{
                          // bg-[#00A99D] text-white
                          backgroundColor:"#00A99D",
                          color:"white",
                          borderRadius:"28px",
                          fontSize:"12px",
                        }}
                      >
                        Book a slot
                      </button>
                    </div>
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DBoard;
