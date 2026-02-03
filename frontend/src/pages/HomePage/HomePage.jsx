import React from 'react'
import Banner from '../../components/section/HomeSection/Banner'
import About from '../../components/section/HomeSection/About'
import Problem from '../../components/section/HomeSection/Problem'
import Solution from '../../components/section/HomeSection/Solution'
import Workflow from '../../components/section/HomeSection/Workflow'
import AiFeatures from '../../components/section/HomeSection/AiFeatures'
import CTA from '../../components/section/HomeSection/CTA'
import '../../components/section/HomeSection/Home.css'

const HomePage = () => {
  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen">
      <div id="banner">
        <Banner />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="problem">
        <Problem />
      </div>
      <div id="solution">
        <Solution />
      </div>
      <div id="workflow">
        <Workflow />
      </div>
      <div id="aifeatures">
        <AiFeatures />
      </div>
      <div id="cta">
        <CTA />
      </div>
    </div>
  )
}

export default HomePage