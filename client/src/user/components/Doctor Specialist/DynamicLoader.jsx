import { useParams } from "react-router-dom";
import GeneralHealthcareMainContent from "./GeneralHealthCare/MainContent"
import CardiologistMainContent from "./cardiologist/MainContent";
import NeurologistMainContent from "./Neurologist/MainContent";
import OrthopedicMainContent from "./Orthopedic/MainContent";
import ENTMainContent from "./ENT/MainContent";
import OphthalmologyContent from "./Ophthalmology/MainContent"; // ✔ correct spelling
import DentalMainContent from "./Dental/MainContent"
import MentalMainContent from "./MentalHealth/MainContent";
import WomenMainContent from "./WomenHealth/MainContent";
import SkinBeautyMainContent from "./SkinBeauty/MainContent";
// import other categories

const uuidToCategoryMap = {
  "bD1KuA_6pr": "Cardiologist",
  "UqkGTNQTOD": "General Healthcare",
  "r1ArfRKaU_": "Neurologist",
  "oybWOH7Ok8": "Orthopedic",
  "whHEP4Ba-m": "Ophthalmology",
  "4A31RiqS_M": "ENT",
  "u3bp-C0G4f": "Dental",
  "QWonnSUTJw": "Mental Health",
  "EGGSWzg5RE":"Women Health",
  "_jCoVKpbHK":"SkinBeauty",

  // add all UUIDs for your categories here
};

const DynamicDoctorCategory = (props) => {
  const { uuid } = useParams();
  const categorySlug = uuidToCategoryMap[uuid] || "general-healthcare";
  const categoryComponents = {
    "General Healthcare": GeneralHealthcareMainContent,
    "Cardiologist": CardiologistMainContent,
    // "childhealth": ChildHealth,
    "Dental":DentalMainContent ,
     "ENT": ENTMainContent,
     "Mental Health": MentalMainContent,
    "Neurologist": NeurologistMainContent,
"Ophthalmology": OphthalmologyContent,
     "Orthopedic": OrthopedicMainContent,
    "Women Health": WomenMainContent,
    "SkinBeauty":SkinBeautyMainContent
    // "skinbeauty": SkinBeauty,
  };

const CategoryComponent = categoryComponents[categorySlug];
if (!CategoryComponent) return <p>Category component not found.</p>;
return <CategoryComponent {...props} categorySlug={categorySlug} uuid={uuid} />;
};


export default DynamicDoctorCategory;
