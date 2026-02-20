import GlobalStyles from "../components/ui/GlobalStyles";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/Home/Hero";
import Services from "../components/Home/Services";
import HowItWorks from "../components/Home/Howitworks";
import CTA from "../components/Home/CTA";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <div className="font-sans text-gray-900 overflow-x-hidden">
      <GlobalStyles />
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}