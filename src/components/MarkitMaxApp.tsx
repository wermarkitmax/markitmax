import { useEffect, useState } from "react";
import { ThemeProvider, Global, css } from "@emotion/react";
import styled from "@emotion/styled";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { theme } from "../styles/theme";

// Components
import { CustomCursor } from "./ui/CustomCursor";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { WhyUs } from "./WhyUs";
import { Services } from "./Services";
import { Projects } from "./Projects";
import { Results } from "./Results";
import { Process } from "./Process";
import { Industries } from "./Industries";
import { Testimonials } from "./Testimonials";
import { Team } from "./Team";
import { FAQ } from "./FAQ";
import { FinalCTA } from "./FinalCTA";
import { ContactForm } from "./ContactForm";
import { Footer } from "./Footer";

// Register ScrollTrigger globally
gsap.registerPlugin(ScrollTrigger);

// Global CSS styles using Emotion Global
const globalStyles = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    user-select: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    scroll-behavior: auto; /* Required for Lenis smooth scroll */
    background-color: #050505;
    overflow-x: hidden;
  }

  body {
    background-color: #050505;
    color: #FFFFFF;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    overflow-x: hidden;
  }

  /* Custom thin premium scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: #050505;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #C7FF2F;
  }

  /* Custom text highlights */
  ::selection {
    background-color: #C7FF2F;
    color: #050505;
  }
`;

// Procedural SVG Noise texture overlay for a premium film-grain aesthetic
const NoiseOverlay = styled.div`
  position: fixed;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  width: 200%;
  height: 200%;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.015;
  pointer-events: none;
  z-index: 9999;
  animation: noiseAnimation 0.2s infinite;

  @keyframes noiseAnimation {
    0% { transform: translate(0, 0); }
    10% { transform: translate(-1%, -1%); }
    20% { transform: translate(-2%, 1%); }
    30% { transform: translate(1%, -2%); }
    40% { transform: translate(-1%, 3%); }
    50% { transform: translate(-1%, 1%); }
    60% { transform: translate(2%, 1%); }
    70% { transform: translate(-2%, 1%); }
    80% { transform: translate(1%, -2%); }
    90% { transform: translate(-1%, 3%); }
    100% { transform: translate(1%, -1%); }
  }
`;

const AppContainer = styled.div`
  position: relative;
  width: 100%;
  background-color: #050505;
`;

export function MarkitMaxApp() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Initialize Lenis Smooth Scroll and sync with GSAP ScrollTrigger
  useEffect(() => {
    const LenisConstructor = (Lenis as any).default || Lenis;
    const lenis = new LenisConstructor({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Update ScrollTrigger on Lenis scroll events
    lenis.on("scroll", ScrollTrigger.update);

    // Bind Lenis scroll to GSAP ticker for synchronized renders
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateTicker);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyles} />
      <NoiseOverlay />
      <CustomCursor />
      
      <AppContainer>
        <Navbar onContactClick={() => setIsContactOpen(true)} />
        <Hero onContactClick={() => setIsContactOpen(true)} />
        <WhyUs />
        <Services />
        <Projects />
        <Results />
        <Process />
        <Industries />
        <Testimonials />
        <Team />
        <FAQ />
        <FinalCTA onContactClick={() => setIsContactOpen(true)} />
        <Footer />

        <ContactForm isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      </AppContainer>
    </ThemeProvider>
  );
}
