import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";
import { testimonialsData } from "../data/mockData";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

gsap.registerPlugin(ScrollTrigger);

const Section = styled.section`
  padding: 140px 5%;
  background-color: #FFFFFF;
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

const CarouselWrapper = styled.div`
  width: 100%;
  position: relative;
  
  .swiper {
    padding-bottom: 70px;
  }
  
  .swiper-pagination-bullets {
    bottom: 20px;
  }
  
  .swiper-pagination-bullet {
    width: 6px;
    height: 6px;
    background-color: rgba(0, 0, 0, 0.15);
    opacity: 1;
    transition: all 0.3s ease;
  }
  
  .swiper-pagination-bullet-active {
    width: 24px;
    background-color: #000000;
    border-radius: 4px;
  }
`;

const TestimonialCard = styled.div`
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 28px;
  padding: 60px;
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.02);
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
  
  @media (max-width: 768px) {
    padding: 40px 30px;
  }
  
  &:hover {
    border-color: rgba(0, 0, 0, 0.15);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.05);
  }
`;

const QuoteIconWrapper = styled.div`
  position: absolute;
  top: 40px;
  right: 40px;
  color: rgba(0, 0, 0, 0.03);
  pointer-events: none;
  
  svg {
    width: 80px;
    height: 80px;
  }
  
  @media (max-width: 768px) {
    top: 24px;
    right: 24px;
    svg {
      width: 48px;
      height: 48px;
    }
  }
`;

const QuoteText = styled.blockquote`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.6;
  color: #1D1D1F;
  border: none;
  padding: 0;
  margin: 0;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const AuthorBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 2;
`;

const AuthorImage = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(0, 0, 0, 0.08);
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #1D1D1F;
  margin-bottom: 2px;
`;

const RoleCompany = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #6E6E73;
  
  span {
    color: #7B61FF;
    font-weight: 500;
  }
`;

// Glowing blur orb behind the carousel
const GlowOrb = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(123, 97, 255, 0.05) 0%, rgba(0, 0, 0, 0) 70%);
  pointer-events: none;
  z-index: 1;
`;

export function Testimonials() {
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
    <Section id="testimonials" ref={sectionRef}>
      <GlowOrb />
      <Container>
        <SectionHeader>
          <Tag>Client Stories</Tag>
          <Title>
            What disruptive brands <span className="italic">say about us</span>
          </Title>
        </SectionHeader>

        <CarouselWrapper data-cursor="DRAG">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 6000, disableOnInteraction: true }}
            pagination={{ clickable: true }}
            breakpoints={{
              1024: { slidesPerView: 1.2, centeredSlides: true }
            }}
          >
            {testimonialsData.map((item) => (
              <SwiperSlide key={item.id}>
                <TestimonialCard>
                  <QuoteIconWrapper>
                    <Quote />
                  </QuoteIconWrapper>
                  
                  <QuoteText>
                    "{item.quote}"
                  </QuoteText>
                  
                  <AuthorBlock>
                    <AuthorImage src={item.imageUrl} alt={item.author} />
                    <AuthorInfo>
                      <Name>{item.author}</Name>
                      <RoleCompany>
                        {item.role} at <span>{item.company}</span>
                      </RoleCompany>
                    </AuthorInfo>
                  </AuthorBlock>
                </TestimonialCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </CarouselWrapper>
      </Container>
    </Section>
  );
}
