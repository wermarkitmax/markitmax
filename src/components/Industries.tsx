import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as Icons from "lucide-react";
import { industriesData } from "../data/mockData";

gsap.registerPlugin(ScrollTrigger);

const Section = styled.section`
  padding: 140px 5%;
  background-color: #F5F5F7; /* Apple Premium Light Gray */
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

const TitleBlock = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 80px auto;
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
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 580px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const IndustryCard = styled.div`
  background-color: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  
  &:hover {
    border-color: rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.05);
  }
  
  &::before {
    content: '';
    position: absolute;
    bottom: -30%;
    right: -30%;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(0, 0, 0, 0.01) 0%, transparent 70%);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
  
  &:hover::before {
    opacity: 1;
  }

  &:hover .industry-icon-box {
    background-color: rgba(0, 0, 0, 0.06);
    border-color: rgba(0, 0, 0, 0.12);
    transform: scale(1.05);
  }
`;

const IconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.06);
  color: #1D1D1F;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  transition: all 0.3s ease;
`;

const CardName = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #1D1D1F;
  margin-bottom: 12px;
`;

const CardDesc = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: #6E6E73;
`;

function DynamicLucideIcon({ name, size = 22 }: { name: string; size?: number }) {
  const IconComponent = (Icons as any)[name] || Icons.Activity || (() => null);
  return <IconComponent size={size} />;
}

export function Industries() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.children;
    if (!cards) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      }
    );
  }, []);

  return (
    <Section id="industries" ref={sectionRef}>
      <Container>
        <TitleBlock>
          <Tag>Industries</Tag>
          <Title>
            Sectors we power with <span className="italic">digital innovation</span>
          </Title>
        </TitleBlock>

        <Grid ref={gridRef}>
          {industriesData.map((item) => (
            <IndustryCard key={item.id}>
              <IconBox className="industry-icon-box">
                <DynamicLucideIcon name={item.iconName} />
              </IconBox>
              <CardName>{item.name}</CardName>
              <CardDesc>{item.description}</CardDesc>
            </IndustryCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
