import Navbar from "../components/Home/Navbar.jsx";
import Hero from "../components/Home/Hero.jsx";
import Services from "../components/Home/Services.jsx";
import StreamlinedExperience from "../components/Home/StreamlinedExperience.jsx";
import CallToAction from "../components/Home/Calltoaction.jsx";
import Footer from "../components/Home/Footer.jsx";

export default function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <Services />
            <StreamlinedExperience />
            <CallToAction />
            <Footer />
        </>
    );
}
