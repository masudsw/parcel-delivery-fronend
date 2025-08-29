import CallToAction from "@/components/call-to-action";
import CommunitySection from "@/components/content-6";
import Features from "@/components/features-one";
import HeroSection from "@/components/hero-section";

export default function Homepage() {
  return (
    <div>
      <HeroSection/>
      <Features/>
      <CommunitySection/>
      <CallToAction/>
    </div>
  );
}