import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as Icons from "lucide-react";
import { servicesData } from "../data/mockData";

gsap.registerPlugin(ScrollTrigger);

const Section = styled.section`
  padding: 140px 5%;
  background-color: #050505;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
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
  color: #7B61FF;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 3.5vw;
  font-weight: 700;
  line-height: 1.2;
  color: #FFFFFF;
  letter-spacing: -0.01em;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
  
  span.italic {
    font-family: 'Inter', sans-serif;
    font-style: italic;
    font-weight: 300;
    color: #B8B8B8;
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
  background-color: #101010;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 24px;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(50px);
  
  &:hover {
    border-color: rgba(123, 97, 255, 0.3);
    transform: translateY(-5px);
    background-color: rgba(16, 16, 16, 0.8);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }
  
  // Custom glowing orb behind card on hover
  &::before {
    content: '';
    position: absolute;
    top: -20%;
    left: -20%;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(123, 97, 255, 0.12) 0%, transparent 70%);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
  
  &:hover::before {
    opacity: 1;
  }

  &:hover .service-icon-box {
    background-color: rgba(123, 97, 255, 0.1);
    border-color: rgba(123, 97, 255, 0.3);
    color: #C7FF2F;
    transform: scale(1.05);
  }

  &:hover .service-detail-item {
    color: #FFFFFF;
    border-color: rgba(255, 255, 255, 0.12);
  }
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  color: #7B61FF;
  transition: all 0.4s ease;
`;

const CardTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 16px;
`;

const CardDesc = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #B8B8B8;
  margin-bottom: 32px;
`;

const DetailsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 24px;
`;

const DetailItem = styled.li`
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #888888;
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
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
