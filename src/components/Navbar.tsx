import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { gsap } from "gsap";
import { Menu, X, ArrowUpRight } from "lucide-react";

const NavHeader = styled.header<{ scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: ${props => (props.scrolled ? "15px 5%" : "30px 5%")};
  background-color: ${props => (props.scrolled ? "rgba(5, 5, 5, 0.85)" : "transparent")};
  backdrop-filter: ${props => (props.scrolled ? "blur(12px)" : "none")};
  border-bottom: 1px solid ${props => (props.scrolled ? "rgba(255, 255, 255, 0.05)" : "transparent")};
  transition: padding 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s ease, border-bottom 0.4s ease;
`;

const NavContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.a`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  
  span {
    color: #C7FF2F;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;
  
  @media (max-width: 968px) {
    display: none;
  }
`;

const NavLinkItem = styled.a`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #B8B8B8;
  text-decoration: none;
  position: relative;
  padding: 8px 0;
  transition: color 0.3s ease;
  
  &:hover {
    color: #FFFFFF;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 1.5px;
    background-color: #C7FF2F;
    transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  
  &:hover::after {
    width: 100%;
  }
`;

// Magnetic button container
const MagneticButtonContainer = styled.div`
  display: inline-block;
  position: relative;
  
  @media (max-width: 968px) {
    display: none;
  }
`;

const MagneticCTA = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #050505;
  background-color: #C7FF2F;
  padding: 12px 24px;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(199, 255, 47, 0.15);
  transition: box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    box-shadow: 0 8px 25px rgba(199, 255, 47, 0.3);
  }
  
  span {
    z-index: 2;
    position: relative;
  }
  
  svg {
    width: 16px;
    height: 16px;
    z-index: 2;
    position: relative;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  &:hover svg {
    transform: translate(2px, -2px);
  }
`;

const MobileMenuBtn = styled.button`
  display: none;
  background: none;
  border: none;
  color: #FFFFFF;
  cursor: pointer;
  z-index: 1002;
  
  @media (max-width: 968px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

// Mobile Full Screen Drawer Overlay
const MobileDrawer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #050505;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10%;
  transform: translateX(${props => (props.isOpen ? "0%" : "100%")});
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`;

const DrawerBgGlow = styled.div`
  position: absolute;
  top: 10%;
  right: 0;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(123, 97, 255, 0.15) 0%, rgba(0,0,0,0) 70%);
  pointer-events: none;
`;

const DrawerLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const DrawerLinkItem = styled.a`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 8vw;
  font-weight: 700;
  color: #FFFFFF;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 12px;
  
  span {
    color: #B8B8B8;
    font-size: 16px;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
  }
  
  &:hover {
    color: #C7FF2F;
    border-bottom-color: #C7FF2F;
  }
`;

const DrawerCTA = styled.a`
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #050505;
  background-color: #C7FF2F;
  padding: 16px;
  border-radius: 50px;
  text-decoration: none;
  text-align: center;
`;

export function Navbar({ onContactClick }: { onContactClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const magneticRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Magnetic Button Effect using GSAP
  useEffect(() => {
    const container = magneticRef.current;
    const inner = ctaRef.current;
    if (!container || !inner) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;

      // Animate the button position towards the mouse cursor
      gsap.to(inner, {
        x: relX * 0.35,
        y: relY * 0.35,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const onMouseLeave = () => {
      // Elastic spring back to center
      gsap.to(inner, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)"
      });
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <NavHeader scrolled={scrolled}>
      <NavContainer>
        <Logo href="#">
          MarkitMax<span>.</span>
        </Logo>

        <NavLinks>
          <NavLinkItem href="#why" onClick={(e) => handleLinkClick(e, "why")}>Why Us</NavLinkItem>
          <NavLinkItem href="#services" onClick={(e) => handleLinkClick(e, "services")}>Services</NavLinkItem>
          <NavLinkItem href="#projects" onClick={(e) => handleLinkClick(e, "projects")}>Featured Work</NavLinkItem>
          <NavLinkItem href="#process" onClick={(e) => handleLinkClick(e, "process")}>Our Process</NavLinkItem>
          <NavLinkItem href="#team" onClick={(e) => handleLinkClick(e, "team")}>Team</NavLinkItem>
          <NavLinkItem href="#faq" onClick={(e) => handleLinkClick(e, "faq")}>FAQs</NavLinkItem>
        </NavLinks>

        <MagneticButtonContainer ref={magneticRef}>
          <MagneticCTA 
            ref={ctaRef} 
            href="#" 
            onClick={(e) => { e.preventDefault(); onContactClick(); }}
          >
            <span>Book Discovery Call</span>
            <ArrowUpRight />
          </MagneticCTA>
        </MagneticButtonContainer>

        <MobileMenuBtn onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </MobileMenuBtn>
      </NavContainer>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={mobileOpen}>
        <DrawerBgGlow />
        <DrawerLinks>
          <DrawerLinkItem href="#why" onClick={(e) => handleLinkClick(e, "why")}>
            Why Us <span>01</span>
          </DrawerLinkItem>
          <DrawerLinkItem href="#services" onClick={(e) => handleLinkClick(e, "services")}>
            Services <span>02</span>
          </DrawerLinkItem>
          <DrawerLinkItem href="#projects" onClick={(e) => handleLinkClick(e, "projects")}>
            Featured Work <span>03</span>
          </DrawerLinkItem>
          <DrawerLinkItem href="#process" onClick={(e) => handleLinkClick(e, "process")}>
            Our Process <span>04</span>
          </DrawerLinkItem>
          <DrawerLinkItem href="#team" onClick={(e) => handleLinkClick(e, "team")}>
            Team <span>05</span>
          </DrawerLinkItem>
          <DrawerLinkItem href="#faq" onClick={(e) => handleLinkClick(e, "faq")}>
            FAQs <span>06</span>
          </DrawerLinkItem>
        </DrawerLinks>
        
        <DrawerCTA href="#" onClick={(e) => { e.preventDefault(); setMobileOpen(false); onContactClick(); }}>
          Book Discovery Call <ArrowUpRight size={18} />
        </DrawerCTA>
      </MobileDrawer>
    </NavHeader>
  );
}
