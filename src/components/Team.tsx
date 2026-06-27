import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Linkedin, Twitter, Dribbble } from "lucide-react";
import { teamData } from "../data/mockData";

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
  max-width: 600px;
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

const Grid = styled.div`
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

const Card = styled.div`
  background-color: #101010;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  height: 480px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transition: border-color 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0;
  transform: translateY(50px);
  
  &:hover {
    border-color: rgba(199, 255, 47, 0.3);
    transform: translateY(-8px);
  }

  &:hover .team-portrait {
    transform: scale(1.06);
    filter: grayscale(0);
  }

  &:hover .team-color-overlay {
    background: linear-gradient(180deg, rgba(123, 97, 255, 0.1) 0%, rgba(5, 5, 5, 0.95) 85%);
  }

  &:hover .team-hover-content {
    height: 90px;
    opacity: 1;
  }
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const Portrait = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease;
  filter: grayscale(1);
`;

// Elegant premium background overlay that shifts colors on hover
const ColorOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, transparent 40%, rgba(5, 5, 5, 0.95) 90%);
  z-index: 2;
  transition: background 0.4s ease;
`;

const InfoWrapper = styled.div`
  position: relative;
  z-index: 3;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const Name = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #FFFFFF;
`;

const Role = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #C7FF2F;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// Slide-up bio and social icons on hover
const HoverContent = styled.div`
  height: 0px;
  opacity: 0;
  overflow: hidden;
  transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const BioText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: #B8B8B8;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
`;

const SocialIcon = styled.a`
  color: #FFFFFF;
  opacity: 0.6;
  transition: color 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #C7FF2F;
    opacity: 1;
    transform: translateY(-2px);
  }
`;

export function Team() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.children;
    if (!cards) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 55 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      }
    );
  }, []);

  return (
    <Section id="team" ref={sectionRef}>
      <Container>
        <SectionHeader>
          <Tag>The Brains</Tag>
          <Title>
            Meet the specialists scaling <span className="italic">your digital footprint</span>
          </Title>
        </SectionHeader>

        <Grid ref={gridRef}>
          {teamData.map((member) => (
            <Card key={member.id}>
              <ImageWrapper>
                <Portrait className="team-portrait" src={member.imageUrl} alt={member.name} />
                <ColorOverlay className="team-color-overlay" />
              </ImageWrapper>
              
              <InfoWrapper>
                <div>
                  <Role>{member.role}</Role>
                  <Name>{member.name}</Name>
                </div>
                
                <HoverContent className="team-hover-content">
                  <BioText>{member.hoverBio}</BioText>
                  <SocialLinks>
                    <SocialIcon href={member.socials.linkedin} aria-label={`${member.name} LinkedIn`}>
                      <Linkedin size={16} />
                    </SocialIcon>
                    <SocialIcon href={member.socials.twitter} aria-label={`${member.name} Twitter`}>
                      <Twitter size={16} />
                    </SocialIcon>
                    <SocialIcon href={member.socials.dribbble} aria-label={`${member.name} Dribbble`}>
                      <Dribbble size={16} />
                    </SocialIcon>
                  </SocialLinks>
                </HoverContent>
              </InfoWrapper>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
