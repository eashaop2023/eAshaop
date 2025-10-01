import { useParams } from "react-router-dom";
import GeneralHealthcareMainContent from "./GeneralHealthCare/MainContent"
import CardiologistMainContent from "./cardiologist/MainContent";
import NeurologistMainContent from "./Neurologist/MainContent";
import OrthopedicMainContent from "./Orthopedic/MainContent";
import ENTMainContent from "./ENT/MainContent";
// import other categories

const uuidToCategoryMap = {
  "bD1KuA_6pr": "Cardiologist",
  "UqkGTNQTOD": "General Healthcare",
  "nf4sb5TRxi": "Neurologist",
  "oybWOH7Ok8": "Orthopedic",
  "hX1KuA_6pr": "Ophthalmology",
  "4A31RiqS_M": "ENT",
  "mZ4sb5TRxi": "Dental",
  
  // add all UUIDs for your categories here
};

const DynamicDoctorCategory = (props) => {
  const { uuid } = useParams();
  const categorySlug = uuidToCategoryMap[uuid] || "general-healthcare";
  const categoryComponents = {
    "General Healthcare": GeneralHealthcareMainContent,
    "Cardiologist": CardiologistMainContent,
    // "childhealth": ChildHealth,
    // "dental": Dental,
     "ENT": ENTMainContent,
    // "mentalhealth": MentalHealth,
    "Neurologist": NeurologistMainContent,
    // "ophthalmology": Ophthalmology,
     "Orthopedic": OrthopedicMainContent,
    // "womenhealth": WomenHealth,
    // "skinbeauty": SkinBeauty,
  };

  const CategoryComponent = categoryComponents[categorySlug];
  return <CategoryComponent {...props} categorySlug={categorySlug} />;
};


export default DynamicDoctorCategory;
