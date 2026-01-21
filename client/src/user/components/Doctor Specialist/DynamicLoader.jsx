import { useParams } from "react-router-dom";
import GeneralHealthcareMainContent from "./GeneralHealthCare/MainContent"
import CardiologistMainContent from "./cardiologist/MainContent";
import NeurologistMainContent from "./Neurologist/MainContent";
import OrthopedicMainContent from "./Orthopedic/MainContent";
import ENTMainContent from "./ENT/MainContent";
import OphthalmologyContent from "./Ophthalmology/MainContent"; // ✔ correct spelling
import DentalMainContent from "./Dental/MainContent"
import PsychiatristMainContent from "./Psychiatrist/MainContent";
import PediatricianMainContent from "./Pediatrician/MainContent";
import DermatologistMainContent from "./Dermatologist/MainContent";
import PhysiotherapistMainContent from "./Physiotherapist/MainContent";
import UrologistMainContent from "./Urologist/MainContent";
import GynecologistMainContent from "./Gynecologist/MainContent";
// import other categories

const uuidToCategoryMap = {
  "bD1KuA_6pr": "Cardiologist",
  "UqkGTNQTOD": "General Physician",
  "r1ArfRKaU_": "Neurologist",
  "oybWOH7Ok8": "Orthopedic",
  "whHEP4Ba-m": "Ophthalmology",
  "4A31RiqS_M": "ENT Specialist",
  "u3bp-C0G4f": "Dentist",
  "Psych_01": "Psychiatrist",
  "Ped_01": "Pediatrician",
  "DrmtLgst_01":"Dermatologist",
  "PhyThr_01":"Physiotherapist",
  "Urolgst_01":"Urologist",
  "Gynclgst_01":"Gynaecologist",

  // add all UUIDs for your categories here
};

const DynamicDoctorCategory = (props) => {
  const { uuid } = useParams();
  const categorySlug = uuidToCategoryMap[uuid] || "general-healthcare";
  const categoryComponents = {
    "General Physician": GeneralHealthcareMainContent,
    "Cardiologist": CardiologistMainContent,
    // "childhealth": ChildHealth,
    "Dentist":DentalMainContent ,
     "ENT Specialist": ENTMainContent,
     "Psychiatrist": PsychiatristMainContent,
     "Pediatrician": PediatricianMainContent,
    "Neurologist": NeurologistMainContent,
"Ophthalmology": OphthalmologyContent,
     "Orthopedic": OrthopedicMainContent,
    "Dermatologist":DermatologistMainContent,
    "Physiotherapist": PhysiotherapistMainContent,
    "Urologist": UrologistMainContent,
    "Gynaecologist": GynecologistMainContent
  };

const CategoryComponent = categoryComponents[categorySlug];
if (!CategoryComponent) return <p>Category component not found.</p>;
return <CategoryComponent {...props} categorySlug={categorySlug} uuid={uuid} />;
};


export default DynamicDoctorCategory;
