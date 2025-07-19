import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import StatsSection from '../components/sections/StatsSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';

function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
    </div>
  );
}

export default HomePage;
