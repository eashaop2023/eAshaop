import React from 'react'
import ParacetamolCard from './Card'
import ProductScrollCards from './Adds'
import TestTabs from './Toggle'
import AboutTest from './Description'
import KeyUses from './KeyUses'
import InfoSection from './HowToUse'
import FAQAccordion from './FAQ'

function PharmacyDetails() {
  return (
    <div>
       {/* <ParacetamolCard/> */}
       <ProductScrollCards/>
       <TestTabs/>
       <AboutTest/>
       <KeyUses/>
       <InfoSection/>
       <FAQAccordion/>
    </div>
  )
}

export default PharmacyDetails