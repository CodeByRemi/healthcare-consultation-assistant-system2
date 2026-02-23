import Navbar from "../../shared/layout/Navbar";
import Hero from "../../features/home/components/Hero";
import Services from "../../features/home/components/Services";
import HowItWorks from "../../features/home/components/Howitworks";
import CTA from "../../features/home/components/CTA";
import Footer from "../../shared/layout/Footer";

export default function Home() {
  return (
    <div className="font-sans text-gray-900 overflow-x-hidden">
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
