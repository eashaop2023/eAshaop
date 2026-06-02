import React from 'react'
import HairFallPanel from './Card'
import TestDetailsTable from './Details'
import LabLocationCard from './Location'
import TestTabs from './Toggle'
import AboutTest from './About'
import TestProcess from './TestProcess'
import FAQAccordion from './FAQ'
import VerticalHealthCards from './HealthCards'

function FullPanel() {
  return (
    <div>
        <HairFallPanel/>
        <TestDetailsTable/>
        <LabLocationCard/>
        <TestTabs/>
        <AboutTest/>
        <TestProcess/>
        <FAQAccordion/>
        <VerticalHealthCards/>
    </div>
  )
}

export default FullPanel