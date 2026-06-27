import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus, Minus } from "lucide-react";
import { faqData } from "../data/mockData";

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
  max-width: 900px;
  width: 100%;
  position: relative;
  z-index: 2;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 80px;
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

const AccordionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const AccordionItem = styled.div<{ isOpen: boolean }>`
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.01);
  }
`;

const AccordionHeader = styled.button`
  width: 100%;
  padding: 32px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  color: #FFFFFF;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 20px;
  font-weight: 600;
  gap: 20px;
  
  @media (max-width: 768px) {
    font-size: 17px;
    padding: 24px 0;
  }
`;

const IconWrapper = styled.div<{ isOpen: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => (props.isOpen ? "#C7FF2F" : "rgba(255, 255, 255, 0.03)")};
  border: 1px solid ${props => (props.isOpen ? "#C7FF2F" : "rgba(255, 255, 255, 0.08)")};
  color: ${props => (props.isOpen ? "#050505" : "#FFFFFF")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  flex-shrink: 0;
  
  button:hover & {
    border-color: #C7FF2F;
    color: ${props => (props.isOpen ? "#050505" : "#C7FF2F")};
  }
`;

const AccordionPanel = styled.div<{ isOpen: boolean; height: number }>`
  height: ${props => (props.isOpen ? `${props.height}px` : "0px")};
  overflow: hidden;
  transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
  opacity: ${props => (props.isOpen ? 1 : 0)};
`;

const PanelContent = styled.div`
  padding: 0 0 32px 0;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: #B8B8B8;
  max-width: 800px;
`;

function FAQAccordionItem({ item }: { item: typeof faqData[0] }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // Measure content scrollHeight on toggle
  const toggleAccordion = () => {
    if (panelRef.current) {
      setHeight(panelRef.current.scrollHeight);
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (isOpen && panelRef.current) {
        setHeight(panelRef.current.scrollHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  return (
    <AccordionItem isOpen={isOpen}>
      <AccordionHeader onClick={toggleAccordion} aria-expanded={isOpen}>
        {item.question}
        <IconWrapper isOpen={isOpen}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </IconWrapper>
      </AccordionHeader>
      
      <AccordionPanel isOpen={isOpen} height={height}>
        <PanelContent ref={panelRef}>
          {item.answer}
        </PanelContent>
      </AccordionPanel>
    </AccordionItem>
  );
}

export function FAQ() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  }, []);

  return (
    <Section id="faq" ref={sectionRef}>
      <Container>
        <SectionHeader>
          <Tag>Got Questions?</Tag>
          <Title>
            Frequently asked <span className="italic">clarifications</span>
          </Title>
        </SectionHeader>

        <AccordionWrapper>
          {faqData.map((item) => (
            <FAQAccordionItem key={item.id} item={item} />
          ))}
        </AccordionWrapper>
      </Container>
    </Section>
  );
}
