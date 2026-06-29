import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { processData } from "../data/mockData";

gsap.registerPlugin(ScrollTrigger);

const Section = styled.section`
  background-color: #FFFFFF;
  position: relative;
  overflow: hidden;
  
  /* Horizontal scroll track only on desktop */
  @media (min-width: 969px) {
    height: 100vh;
    display: flex;
    align-items: center;
  }
  
  @media (max-width: 968px) {
    padding: 100px 5%;
  }
`;

const StickyContainer = styled.div`
  width: 100%;
  padding: 0 5%;
  
  @media (min-width: 969px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: visible;
  }
`;

const SectionHeader = styled.div`
  max-width: 600px;
  margin-bottom: 60px;
  
  @media (min-width: 969px) {
    margin-bottom: 40px;
    padding-left: 2%;
  }
`;

const Tag = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #6E6E73;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 3.5vw;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
  background: linear-gradient(90deg, #7B61FF 0%, #3E52D5 45%, #00C6FF 75%, #10B981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
  
  span.italic {
    font-family: 'Inter', sans-serif;
    font-style: italic;
    font-weight: 300;
  }
`;

// Track that slides left
const TimelineTrack = styled.div`
  display: flex;
  position: relative;
  
  @media (min-width: 969px) {
    width: max-content;
    padding: 20px 0;
    gap: 40px;
  }
  
  @media (max-width: 968px) {
    flex-direction: column;
    gap: 40px;
  }
`;

// Dynamic horizontal line behind cards
const TimelineLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  height: 2px;
  background-color: rgba(0, 0, 0, 0.06);
  z-index: 1;
  pointer-events: none;
  
  @media (min-width: 969px) {
    width: 95%;
    transform: translateY(-50px);
  }
  
  @media (max-width: 968px) {
    left: 28px;
    top: 0;
    width: 2px;
    height: 100%;
  }
`;

// Filled/animated timeline line
const TimelineProgressLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #000000 0%, #6E6E73 100%);
  z-index: 2;
  pointer-events: none;
  transform-origin: left;
  transform: scaleX(0);
  
  @media (min-width: 969px) {
    width: 95%;
    transform: translateY(-50px);
  }
  
  @media (max-width: 968px) {
    left: 28px;
    top: 0;
    width: 2px;
    height: 100%;
    transform-origin: top;
    transform: scaleY(0);
  }
`;

const StepCard = styled.div`
  background-color: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 24px;
  padding: 40px;
  position: relative;
  z-index: 3;
  backdrop-filter: blur(16px) saturate(180%);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.02);
  transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  
  @media (min-width: 969px) {
    width: 360px;
    flex-shrink: 0;
  }
  
  &:hover {
    border-color: rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.05);
  }

  &:hover .step-card-value {
    color: #000000;
  }
`;

const StepNum = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #1D1D1F;
  background-color: rgba(0, 0, 0, 0.04);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
  
  @media (max-width: 968px) {
    width: 48px;
    height: 48px;
    font-size: 16px;
  }
`;

const StepTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #1D1D1F;
  margin-bottom: 16px;
`;

const StepDesc = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #6E6E73;
  margin-bottom: 24px;
`;

const DeliverableBox = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 18px;
  
  .label {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    color: #8E8E93;
    letter-spacing: 0.05em;
    margin-bottom: 4px;
  }
  
  .value {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #6E6E73;
    transition: color 0.3s ease;
  }
`;

export function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const progressLine = progressLineRef.current;
    if (!section || !track) return;

    // Check media queries using JavaScript for GSAP initialization
    const isDesktop = window.innerWidth > 968;

    if (isDesktop) {
      // Horizontal Scroll animation using ScrollTrigger
      const scrollTween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + window.innerWidth * 0.1),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: "center center",
          end: () => `+=${track.scrollWidth - window.innerWidth + 300}`,
          invalidateOnRefresh: true,
        }
      });

      // Animate progress line scaleX
      gsap.to(progressLine, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scrub: 1,
          start: "center center",
          end: () => `+=${track.scrollWidth - window.innerWidth + 300}`,
        }
      });

      // Subtle stagger tilt or scale for cards as they enter
      const cards = track.querySelectorAll(".step-card");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.6, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: "left 85%",
              end: "left 65%",
              scrub: true,
            }
          }
        );
      });

    } else {
      // Vertical timeline fade-in stagger on mobile/tablet
      const cards = track.querySelectorAll(".step-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
          scrollTrigger: {
            trigger: track,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

      // Animate vertical progress line scaleY
      gsap.to(progressLine, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: track,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1,
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === section || t.trigger === track) t.kill();
      });
    };
  }, []);

  return (
    <Section id="process" ref={sectionRef}>
      <StickyContainer>
        <SectionHeader>
          <Tag>How We Work</Tag>
          <Title>
            Our six-step <span className="italic">growth methodology</span>
          </Title>
        </SectionHeader>

        <TimelineTrack ref={trackRef}>
          <TimelineLine />
          <TimelineProgressLine ref={progressLineRef} />
          
          {processData.map((step) => (
            <StepCard key={step.id} className="step-card">
              <StepNum>{step.stepNum}</StepNum>
              <StepTitle>{step.title}</StepTitle>
              <StepDesc>{step.description}</StepDesc>
              <DeliverableBox>
                <div className="label">Key Outcome</div>
                <div className="value step-card-value">{step.deliverable}</div>
              </DeliverableBox>
            </StepCard>
          ))}
        </TimelineTrack>
      </StickyContainer>
    </Section>
  );
}
