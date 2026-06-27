import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { statsData } from "../data/mockData";

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

const TitleBlock = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 90px auto;
`;

const Tag = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #C7FF2F;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }
  
  @media (max-width: 580px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const StatCard = styled.div`
  background-color: #101010;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  transition: border-color 0.4s ease, transform 0.4s ease;
  position: relative;
  opacity: 0;
  transform: translateY(40px);
  
  &:hover {
    border-color: rgba(123, 97, 255, 0.2);
    transform: translateY(-5px);
  }
`;

const CounterWrapper = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 64px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  background: linear-gradient(135deg, #FFFFFF 40%, #B8B8B8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 48px;
  }
`;

const ValueSpan = styled.span`
  display: inline-block;
`;

const SuffixSpan = styled.span`
  color: #C7FF2F;
  -webkit-text-fill-color: #C7FF2F;
`;

const StatLabel = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 12px;
`;

const StatDesc = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: #888888;
`;

const OrbBg = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(199, 255, 47, 0.04) 0%, rgba(0, 0, 0, 0) 70%);
  pointer-events: none;
`;

function CounterItem({ stat, index }: { stat: typeof statsData[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const number = numberRef.current;
    if (!card || !number) return;

    // Stagger reveal card
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: index * 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });

    // Animate counter value
    const valObj = { value: 0 };
    gsap.to(valObj, {
      value: stat.value,
      duration: 2.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      onUpdate: () => {
        if (number) {
          number.innerText = Math.round(valObj.value).toString();
        }
      }
    });
  }, [stat.value, index]);

  return (
    <StatCard ref={cardRef}>
      <CounterWrapper>
        <ValueSpan ref={numberRef}>0</ValueSpan>
        <SuffixSpan>{stat.suffix}</SuffixSpan>
      </CounterWrapper>
      <StatLabel>{stat.label}</StatLabel>
      <StatDesc>{stat.description}</StatDesc>
    </StatCard>
  );
}

export function Results() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <Section id="results" ref={sectionRef}>
      <OrbBg />
      <Container>
        <TitleBlock>
          <Tag>Impact & Metrics</Tag>
          <Title>
            Measurable results that define <span className="italic">our excellence</span>
          </Title>
        </TitleBlock>

        <StatsGrid>
          {statsData.map((stat, index) => (
            <CounterItem key={stat.id} stat={stat} index={index} />
          ))}
        </StatsGrid>
      </Container>
    </Section>
  );
}
