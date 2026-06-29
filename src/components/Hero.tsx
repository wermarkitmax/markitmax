import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { gsap } from "gsap";
import { ArrowDown, ArrowUpRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

const HeroSection = styled.section`
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 100px 5% 40px 5%;
  background-color: #FFFFFF;
  overflow: hidden;
`;

// Glowing floating orbs in background
const Orb = styled.div<{ color: string; size: string; top: string; left: string }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: ${props => props.size};
  height: ${props => props.size};
  background: ${props => props.color};
  filter: blur(120px);
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.25;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  text-align: center;
  z-index: 2;
  position: relative;
`;

const BadgesContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
  opacity: 0;
`;

const FloatingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 50px;
  padding: 6px 14px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #6E6E73;
  backdrop-filter: blur(8px);
  
  svg {
    color: #000000;
  }
`;

const MainTitle = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 5.5vw;
  font-weight: 700;
  line-height: 1.1;
  color: #1D1D1F;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
  opacity: 0;
  
  @media (max-width: 768px) {
    font-size: 40px;
  }
  
  span.italic {
    font-family: 'Inter', sans-serif;
    font-style: italic;
    font-weight: 300;
    background: linear-gradient(90deg, #7B61FF 0%, #3E52D5 40%, #00C6FF 70%, #10B981 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  line-height: 1.6;
  color: #6E6E73;
  max-width: 700px;
  margin: 0 auto 40px auto;
  opacity: 0;
  
  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const CTAWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  opacity: 0;
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

const PrimaryButton = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 16px 36px;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

const SecondaryButton = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #1D1D1F;
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
  padding: 16px 36px;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #000000;
    background-color: rgba(0, 0, 0, 0.04);
  }
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

// Floating Badges on the sides
const DynamicBadge = styled.div<{ top: string; left?: string; right?: string }>`
  position: absolute;
  top: ${props => props.top};
  ${props => (props.left ? `left: ${props.left};` : `right: ${props.right};`)}
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 12px 18px;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  
  @media (max-width: 1024px) {
    display: none;
  }
  
  .badge-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.04);
    color: #000000;
  }
  
  .badge-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .badge-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #1D1D1F;
  }
  
  .badge-subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    color: #6E6E73;
  }
`;

const TrustedSection = styled.div`
  margin-top: 50px;
  opacity: 0;
  z-index: 2;
  position: relative;
  text-align: center;
  width: 100%;
`;

const TrustedText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #555555;
  margin-bottom: 24px;
`;

const TrustedLogos = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 48px;
  opacity: 0.5;
  
  @media (max-width: 768px) {
    gap: 24px;
  }
`;

const LogoPlaceholder = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #1D1D1F;
  letter-spacing: -0.02em;
  
  span {
    color: #000000;
  }
`;

const ScrollIndicator = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #6E6E73;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  letter-spacing: 0.05em;
  cursor: pointer;
  z-index: 2;
  opacity: 0;
  margin-top: 30px;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

export function Hero({ onContactClick }: { onContactClick: () => void }) {
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const sideBadge1Ref = useRef<HTMLDivElement>(null);
  const sideBadge2Ref = useRef<HTMLDivElement>(null);
  const trustedRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    
    tl.to(badgesRef.current, { opacity: 1, y: 0, duration: 1 })
      .to(titleRef.current, { opacity: 1, y: 0, duration: 1.2 }, "-=0.8")
      .to(subtitleRef.current, { opacity: 1, y: 0, duration: 1 }, "-=0.9")
      .to(ctaContainerRef.current, { opacity: 1, y: 0, duration: 1 }, "-=0.8")
      .to([sideBadge1Ref.current, sideBadge2Ref.current], { opacity: 1, y: 0, stagger: 0.2, duration: 1 }, "-=0.7")
      .to([trustedRef.current, scrollRef.current], { opacity: 1, y: 0, duration: 1, stagger: 0.2 }, "-=0.5");

    gsap.to(sideBadge1Ref.current, { y: "-=15", duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(sideBadge2Ref.current, { y: "+=15", duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5 });

    gsap.to(scrollRef.current?.querySelector("svg") || null, { y: 5, duration: 0.8, repeat: -1, yoyo: true, ease: "power1.inOut" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPercent = (clientX / window.innerWidth - 0.5) * 2;
      const yPercent = (clientY / window.innerHeight - 0.5) * 2;

      if (orb1Ref.current) gsap.to(orb1Ref.current, { x: xPercent * 40, y: yPercent * 40, duration: 1.2, ease: "power2.out" });
      if (orb2Ref.current) gsap.to(orb2Ref.current, { x: xPercent * -30, y: yPercent * -30, duration: 1.5, ease: "power2.out" });
      if (orb3Ref.current) gsap.to(orb3Ref.current, { x: xPercent * 25, y: yPercent * -25, duration: 1.8, ease: "power2.out" });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleScrollClick = () => {
    const element = document.getElementById("why");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <HeroSection ref={containerRef}>
      <Orb ref={orb1Ref} color="radial-gradient(circle, rgba(123, 97, 255, 0.08) 0%, rgba(255,255,255,0) 100%)" size="600px" top="-10%" left="-10%" />
      <Orb ref={orb2Ref} color="radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, rgba(255,255,255,0) 100%)" size="500px" top="30%" left="60%" />
      <Orb ref={orb3Ref} color="radial-gradient(circle, rgba(0, 224, 255, 0.05) 0%, rgba(255,255,255,0) 100%)" size="450px" top="60%" left="-5%" />

      <DynamicBadge ref={sideBadge1Ref} top="25%" left="8%">
        <div className="badge-icon">
          <Sparkles size={16} />
        </div>
        <div className="badge-content">
          <div className="badge-title">Bespoke Design</div>
          <div className="badge-subtitle">Tailored for Impact</div>
        </div>
      </DynamicBadge>

      <DynamicBadge ref={sideBadge2Ref} top="45%" right="8%">
        <div className="badge-icon">
          <CheckCircle2 size={16} />
        </div>
        <div className="badge-content">
          <div className="badge-title">Elite Engineering</div>
          <div className="badge-subtitle">Designed to Scale</div>
        </div>
      </DynamicBadge>

      <div style={{ flexGrow: 1 }} />

      <ContentWrapper>
        <BadgesContainer ref={badgesRef} style={{ transform: "translateY(20px)" }}>
          <FloatingBadge>
            <Sparkles size={14} /> Creative Studio
          </FloatingBadge>
          <FloatingBadge>
            <ShieldCheck size={14} /> Award-Winning Design
          </FloatingBadge>
          <FloatingBadge>
            ⚡ Lightning-Fast Dev
          </FloatingBadge>
        </BadgesContainer>

        <MainTitle ref={titleRef} style={{ transform: "translateY(30px)" }}>
          Scaling Brands Through<br />
          <span className="italic">Strategy, Design</span> & Dev
        </MainTitle>

        <Subtitle ref={subtitleRef} style={{ transform: "translateY(30px)" }}>
          We engineer luxury digital ecosystems that convert. Our custom user-experience maps 
          and bespoke frontend builds elevate corporate brands to their maximum potential.
        </Subtitle>

        <CTAWrapper ref={ctaContainerRef} style={{ transform: "translateY(30px)" }}>
          <PrimaryButton href="#" onClick={(e) => { e.preventDefault(); onContactClick(); }}>
            Start Project <ArrowUpRight size={18} />
          </PrimaryButton>
          <SecondaryButton href="#projects" onClick={(e) => {
            e.preventDefault();
            document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
          }}>
            Explore Work
          </SecondaryButton>
        </CTAWrapper>

        <TrustedSection ref={trustedRef} style={{ transform: "translateY(30px)" }}>
          <TrustedText>Trusted by disruptive industry leaders</TrustedText>
          <TrustedLogos>
            <LogoPlaceholder>APEX<span>.</span></LogoPlaceholder>
            <LogoPlaceholder>LUMINARY<span>/</span></LogoPlaceholder>
            <LogoPlaceholder>VORTEX<span>*</span></LogoPlaceholder>
            <LogoPlaceholder>NOVA<span>+</span></LogoPlaceholder>
            <LogoPlaceholder>QUANTUM<span>^</span></LogoPlaceholder>
          </TrustedLogos>
        </TrustedSection>
      </ContentWrapper>

      <div style={{ flexGrow: 1 }} />

      <ScrollIndicator ref={scrollRef} onClick={handleScrollClick} style={{ transform: "translateY(10px)" }}>
        <span>SCROLL DOWN</span>
        <ArrowDown />
      </ScrollIndicator>
    </HeroSection>
  );
}
