import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as Icons from "lucide-react";
import { servicesData } from "../data/mockData";

gsap.registerPlugin(ScrollTrigger);

const Section = styled.section`
  padding: 140px 5%;
  background-color: #FFFFFF;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
`;

const Orb = styled.div<{ color: string; size: string; top: string; left?: string; right?: string }>`
  position: absolute;
  top: ${props => props.top};
  ${props => (props.left ? `left: ${props.left};` : `right: ${props.right};`)}
  width: ${props => props.size};
  height: ${props => props.size};
  background: ${props => props.color};
  filter: blur(100px);
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.15;
  z-index: 1;
`;

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  position: relative;
  z-index: 2;
`;

const SectionHeader = styled.div`
  max-width: 700px;
  margin-bottom: 80px;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const ServiceCard = styled.div`
  background-color: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 24px;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  backdrop-filter: blur(16px) saturate(180%);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.02);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(50px);
  z-index: 3;
  
  &:hover {
    border-color: rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
    background-color: rgba(255, 255, 255, 0.75);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.05);
  }
  
  // Custom glowing orb behind card on hover
  &::before {
    content: '';
    position: absolute;
    top: -20%;
    left: -20%;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(0, 0, 0, 0.01) 0%, transparent 70%);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
  
  &:hover::before {
    opacity: 1;
  }
 
  &:hover .service-icon-box {
    background-color: rgba(0, 0, 0, 0.06);
    border-color: rgba(0, 0, 0, 0.12);
    color: #000000 !important;
    transform: scale(1.05);
  }
 
  &:hover .service-detail-item {
    color: #1D1D1F !important;
    border-color: rgba(0, 0, 0, 0.12);
  }
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  color: #1D1D1F !important;
  transition: all 0.4s ease;
`;

const CardTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #1D1D1F !important;
  margin-bottom: 16px;
`;

const CardDesc = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #6E6E73 !important;
  margin-bottom: 32px;
`;

const DetailsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 24px;
`;

const DetailItem = styled.li`
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #6E6E73 !important;
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 4px 10px;
  border-radius: 50px;
  transition: all 0.3s ease;
`;

// Helper to resolve icon from lucide-react dynamically
function LucideIcon({ name, size = 24 }: { name: string; size?: number }) {
  // Map custom icon names or default to robust fallbacks
  let IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    if (name === "Figma") {
      IconComponent = Icons.PenTool;
    } else {
      IconComponent = (Icons as any)["CircleHelp"] || (Icons as any)["HelpCircle"] || Icons.Activity || (() => null);
    }
  }
  return <IconComponent size={size} />;
}

export function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.children;
    if (!cards) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none"
        }
      }
    );
  }, []);

  return (
    <Section id="services" ref={sectionRef}>
      <Orb color="radial-gradient(circle, rgba(0, 224, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%)" size="450px" top="20%" right="-10%" />
      <Orb color="radial-gradient(circle, rgba(123, 97, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)" size="400px" top="60%" left="-10%" />
      <Container>
        <SectionHeader>
          <Tag>Our Capabilities</Tag>
          <Title>
            Crafting premium <span className="italic">digital ecosystems</span> that perform
          </Title>
        </SectionHeader>

        <Grid ref={gridRef}>
          {servicesData.map((service) => (
            <ServiceCard key={service.id}>
              <div>
                <IconWrapper className="service-icon-box">
                  <LucideIcon name={service.iconName} />
                </IconWrapper>
                <CardTitle>{service.title}</CardTitle>
                <CardDesc>{service.description}</CardDesc>
              </div>
              <DetailsList>
                {service.details.map((detail, index) => (
                  <DetailItem key={index} className="service-detail-item">{detail}</DetailItem>
                ))}
              </DetailsList>
            </ServiceCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
