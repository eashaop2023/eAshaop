import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import generalHealthCare from "../../assets/DBIcons/generalHealthCare.svg";
import cardiologist from "../../assets/DBIcons/cardiologist.svg";
import orthopedic from "../../assets/DBIcons/orthopedic.svg";
import neurologist from "../../assets/DBIcons/neurologist.svg";
import ophthalmology from "../../assets/DBIcons/ophthalmology.svg";
import ent from "../../assets/DBIcons/ent.svg";
import dental from "../../assets/DBIcons/dental.svg";
import womenHealth from "../../assets/DBIcons/womenHealth.svg";
import childHealth from "../../assets/DBIcons/childHealth.svg";
import skin from "../../assets/DBIcons/skin.svg";
import mentalHealth from "../../assets/DBIcons/mentalHealth.svg";
import doctor from "../../assets/icons/doctor.svg";
import styles from "../../components/Doctor Specialist/DashBoard.module.css";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../api-config";


const staticCategories = [
  { name: "General healthcare", icon: generalHealthCare, path: "general-healthcare" },
  { name: "Cardiologists", icon: cardiologist, path: "cardiologist" },
  { name: "Orthopedic", icon: orthopedic, path: "orthopedic" },
  { name: "Neurologist", icon: neurologist, path: "neurologist" },
  { name: "Ophthalmology", icon: ophthalmology, path: "ophthalmology" },
  { name: "ENT", icon: ent, path: "ent" },
  { name: "Dental", icon: dental, path: "dental" },
  { name: "Women health", icon: womenHealth, path: "women-health" },
  // { name: "Child health", icon: childHealth, path: "child-health" },
  { name: "Skin & Beauty", icon: skin, path: "skin-&-beauty" },
  { name: "Mental health", icon: mentalHealth, path: "mental-health" },
];

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/categories`);
        const backendCategories = await res.json();

        // 🔹 Merge backend data into static categories
        const merged = staticCategories.map((cat) => {
          const backendCat = backendCategories.find(
            (b) => b.name.toLowerCase() === cat.name.toLowerCase()
          );
          return {
            ...cat,
            uuid: backendCat?.uuid || null,
            doctorCount: backendCat?.doctorCount || 0,
            message: backendCat?.message || null,
          };
        });

        setCategories(merged);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const handleCategoryClick = (path) => {
  //   navigate(`/user/category/${path}`);
  // };

  const handleCategoryClick = (uuid, name) => {
    if (!uuid) {
      toast.info(`No doctors available for ${name}`);
      return;
    }
    navigate(`/user/category/${uuid}`, { state: { categoryName: name } });
  };

  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.heading}>Doctor Specialist</h2>

      <div className={`row ${styles.rowContainer}`}>
        {categories.map((cat, index) => (
          <div
            key={index}
            className={`${styles.colContainer} col-12 col-sm-6 col-md-4 mb-3`}
            onClick={() => handleCategoryClick(cat.uuid,cat.path)}
          >
            <div className={styles.cardBox}>
              <div className="d-flex align-items-center">
                <div className={styles.iconBox}>
                  <img src={cat.icon} alt={cat.name} className={styles.catIcon} />
                </div>
                <div>
                  <div className="fw-bold" style={{ fontSize: "18px" }}>
                    {cat.name}
                  </div>
                  <div className="d-flex align-items-center mt-1">
                    <img
                      src={doctor}
                      alt="Doctor"
                      style={{ width: "16px", height: "16px", marginRight: "6px" }}
                    />
                    <small className="text-muted" style={{ fontSize: "14px" }}>
                      Doctors {cat.doctorCount}
                    </small>
                  </div>
                  {cat.message && (
                    <small className="text-danger">{cat.message}</small>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
