import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Section = styled.section`
  padding: 180px 5%;
  background-color: #050505;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 2;
`;

const Tag = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #C7FF2F;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 24px;
  opacity: 0;
  transform: translateY(20px);
`;

const BigTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 6.5vw;
  font-weight: 700;
  line-height: 1.1;
  color: #FFFFFF;
  letter-spacing: -0.02em;
  margin-bottom: 48px;
  opacity: 0;
  transform: translateY(30px);
  
  @media (max-width: 768px) {
    font-size: 44px;
  }
  
  span.gradient {
    background: linear-gradient(90deg, #C7FF2F 0%, #7B61FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  span.italic {
    font-family: 'Inter', sans-serif;
    font-style: italic;
    font-weight: 300;
  }
`;

const CTAWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  opacity: 0;
  transform: translateY(20px);
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

const LargeButton = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #050505;
  background-color: #C7FF2F;
  padding: 20px 48px;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(199, 255, 47, 0.15);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &:hover {
    box-shadow: 0 15px 40px rgba(199, 255, 47, 0.3);
    transform: translateY(-3px);
  }
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

const OutlineButton = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 20px 48px;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #FFFFFF;
    background-color: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
  }
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

// Shifting colorful gradient glows
const GlowBackground = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(123, 97, 255, 0.08) 0%, rgba(199, 255, 47, 0.03) 40%, rgba(0, 0, 0, 0) 70%);
  pointer-events: none;
  z-index: 1;
  animation: floatOrb 10s ease-in-out infinite alternate;
  
  @keyframes floatOrb {
    0% { transform: translate(-50%, -50%) scale(1); }
    100% { transform: translate(-45%, -55%) scale(1.1) rotate(45deg); }
  }
`;

export function FinalCTA({ onContactClick }: { onContactClick: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });

    tl.to(tagRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
      .to(titleRef.current, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.6")
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.6");
  }, []);

  return (
    <Section ref={sectionRef}>
      <GlowBackground />
      <Container>
        <Tag ref={tagRef}>Have a project in mind?</Tag>
        <BigTitle ref={titleRef}>
          Let's build something<br />
          <span className="italic">exceptional </span>
          <span className="gradient">together</span>
        </BigTitle>
        
        <CTAWrapper ref={ctaRef}>
          <LargeButton href="#" onClick={(e) => { e.preventDefault(); onContactClick(); }}>
            Book Discovery Call <ArrowUpRight size={20} />
          </LargeButton>
          <OutlineButton href="#" onClick={(e) => { e.preventDefault(); onContactClick(); }}>
            Start Your Project
          </OutlineButton>
        </CTAWrapper>
      </Container>
    </Section>
  );
}
