import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projectsData } from "../data/mockData";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

gsap.registerPlugin(ScrollTrigger);

const Section = styled.section`
  padding: 140px 0;
  background-color: #F5F5F7; /* Apple Premium Light Gray */
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5%;
  position: relative;
  z-index: 2;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
`;

const SectionHeader = styled.div`
  max-width: 600px;
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

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const RoundButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #1D1D1F;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &:hover {
    background-color: #000000;
    border-color: #000000;
    color: #FFFFFF;
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    &:hover {
      background-color: rgba(0, 0, 0, 0.02);
      border-color: rgba(0, 0, 0, 0.08);
      color: #1D1D1F;
      transform: none;
    }
  }
`;

const SwiperWrapper = styled.div`
  padding: 0 5%;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  
  .swiper {
    overflow: visible;
  }
  
  .swiper-slide {
    height: auto;
    transition: opacity 0.4s ease, transform 0.4s ease;
  }
`;

const Card = styled.div`
  background-color: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 28px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.02);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  
  &:hover {
    border-color: rgba(0, 0, 0, 0.12);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
  }

  &:hover .project-card-image {
    transform: scale(1.08);
  }

  &:hover h3 svg {
    opacity: 1;
    transform: translate(0, 0);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 60%; // Aspect ratio 5:3
  overflow: hidden;
`;

const ProjectImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, transparent 40%, rgba(255, 255, 255, 0.8) 100%);
  opacity: 0.8;
`;

const ResultBadge = styled.div`
  position: absolute;
  bottom: 24px;
  left: 24px;
  background-color: #000000;
  color: #FFFFFF;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 13px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 2;
`;

const CardContent = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #6E6E73;
`;

const Category = styled.span`
  color: #000000;
  font-weight: 600;
`;

const Year = styled.span``;

const ProjectTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #1D1D1F;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  svg {
    opacity: 0;
    transform: translate(-10px, 10px);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    color: #000000;
  }
`;

const Description = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #6E6E73;
  margin-bottom: 30px;
  flex-grow: 1;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ProjectTag = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #6E6E73;
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 5px 12px;
  border-radius: 50px;
`;

const CustomPagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 50px;
  
  .swiper-pagination-bullet {
    width: 8px;
    height: 8px;
    background-color: rgba(0, 0, 0, 0.15);
    opacity: 1;
    transition: all 0.3s ease;
    border-radius: 4px;
  }
  
  .swiper-pagination-bullet-active {
    width: 28px;
    background-color: #000000;
  }
`;

export function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      }
    );
  }, []);

  return (
    <Section id="projects" ref={sectionRef}>
      <Container>
        <HeaderRow>
          <SectionHeader>
            <Tag>Case Studies</Tag>
            <Title>
              Featured <span className="italic">digital milestones</span>
            </Title>
          </SectionHeader>
          
          <ControlsWrapper>
            <RoundButton className="project-slider-prev" aria-label="Previous Project">
              <ArrowLeft size={20} />
            </RoundButton>
            <RoundButton className="project-slider-next" aria-label="Next Project">
              <ArrowRight size={20} />
            </RoundButton>
          </ControlsWrapper>
        </HeaderRow>
      </Container>

      {/* Swiper wrapper with data-cursor to expand mouse cursor */}
      <SwiperWrapper data-cursor="DRAG">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: true }}
          navigation={{
            prevEl: ".project-slider-prev",
            nextEl: ".project-slider-next",
          }}
          pagination={{
            el: ".custom-pagination-container",
            clickable: true,
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 1.8 },
            1024: { slidesPerView: 2.2 },
            1440: { slidesPerView: 2.5 }
          }}
        >
          {projectsData.map((project) => (
            <SwiperSlide key={project.id}>
              <Card>
                <ImageContainer>
                  <ProjectImage className="project-card-image" src={project.imageUrl} alt={project.title} />
                  <ImageOverlay />
                  <ResultBadge>{project.result}</ResultBadge>
                </ImageContainer>
                
                <CardContent>
                  <div>
                    <MetaRow>
                      <Category>{project.category}</Category>
                      <Year>{project.year}</Year>
                    </MetaRow>
                    
                    <ProjectTitle>
                      {project.title}
                      <ArrowUpRight size={22} />
                    </ProjectTitle>
                    
                    <Description>{project.description}</Description>
                  </div>
                  
                  <TagRow>
                    {project.services.map((service, index) => (
                      <ProjectTag key={index}>{service}</ProjectTag>
                    ))}
                  </TagRow>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </SwiperWrapper>

      <Container>
        <CustomPagination className="custom-pagination-container" />
      </Container>
    </Section>
  );
}
