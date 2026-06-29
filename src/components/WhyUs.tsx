import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whyUsData } from "../data/mockData";

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
  max-width: 600px;
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
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const Card = styled.div`
  background-color: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  padding: 50px 40px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(16px) saturate(180%);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.02);
  transition: border-color 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
  opacity: 0;
  transform: translateY(50px);
  z-index: 3;
  
  &:hover {
    border-color: rgba(0, 0, 0, 0.15);
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.06);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at top right, rgba(0, 0, 0, 0.01) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &:hover .card-glow-bar {
    transform: scaleX(1);
  }
`;

const CardGlow = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #000000 0%, #6E6E73 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
`;

const CardNumber = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1D1D1F !important;
  margin-bottom: 40px;
`;

const CardTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #1D1D1F !important;
  margin-bottom: 20px;
`;

const CardDesc = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: #6E6E73 !important;
  margin-bottom: 40px;
`;

const CardStat = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #1D1D1F !important;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #000000 !important;
  }
`;

// Subtle side glows in section
const SectionGlow = styled.div`
  position: absolute;
  top: 40%;
  left: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.01) 0%, rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
`;

export function WhyUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.children;
    if (!cards) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%", // Triggers when top of section is 75% from screen top
          toggleActions: "play none none none"
        }
      }
    );
  }, []);

  return (
    <Section id="why" ref={sectionRef}>
      <Orb color="radial-gradient(circle, rgba(123, 97, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)" size="450px" top="10%" left="-10%" />
      <Orb color="radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(255, 255, 255, 0) 100%)" size="450px" top="40%" right="-10%" />
      <SectionGlow />
      <Container>
        <SectionHeader>
          <Tag>Why MarkitMax</Tag>
          <Title>
            We align design, tech, and <span className="italic">growth metrics</span>
          </Title>
        </SectionHeader>

        <Grid ref={gridRef}>
          {whyUsData.map((item) => (
            <Card key={item.id}>
              <CardNumber>{item.number}</CardNumber>
              <CardTitle>{item.title}</CardTitle>
              <CardDesc>{item.description}</CardDesc>
              <CardStat>{item.highlightStat}</CardStat>
              <CardGlow className="card-glow-bar" />
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
