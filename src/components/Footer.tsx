import { useState } from "react";
import styled from "@emotion/styled";
import { Github, Twitter, Linkedin, Instagram, ArrowRight, Sparkles } from "lucide-react";

const FooterContainer = styled.footer`
  background-color: #F5F5F7; /* Apple Premium Light Gray */
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 100px 5% 40px 5%;
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 80px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 2fr;
  gap: 60px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 50px;
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const BrandColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Logo = styled.a`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: #1D1D1F;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  
  span {
    color: #000000;
  }
`;

const Tagline = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #6E6E73;
  max-width: 280px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
`;

const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #6E6E73;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    color: #FFFFFF;
    border-color: #000000;
    background-color: #000000;
    transform: translateY(-2px);
  }
`;

const LinkColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ColumnTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #1D1D1F;
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FooterLink = styled.a`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #6E6E73;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #000000;
  }
`;

const NewsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const NewsText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #6E6E73;
`;

const Form = styled.form`
  display: flex;
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 56px 16px 20px;
  background-color: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 50px;
  color: #1D1D1F;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #000000;
  }
`;

const SubmitButton = styled.button`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #000000;
  border: none;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #333333;
  }
`;

const SuccessMsg = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #000000;
  padding-left: 8px;
  
  svg {
    animation: pulse 1s infinite alternate;
  }
  
  @keyframes pulse {
    to { transform: scale(1.1); }
  }
`;

const BottomBar = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #8E8E93;
`;

const PolicyLinks = styled.div`
  display: flex;
  gap: 24px;
  
  a {
    color: #8E8E93;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: #1D1D1F;
    }
  }
`;

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <FooterContainer>
      <ContentWrapper>
        <Grid>
          {/* Brand Column */}
          <BrandColumn>
            <Logo href="#">
              MarkitMax<span>.</span>
            </Logo>
            <Tagline>
              Scaling Brands Through Strategy, Design & Development. Constructing digital masterpieces.
            </Tagline>
            <SocialLinks>
              <SocialIcon href="#" aria-label="Github"><Github size={18} /></SocialIcon>
              <SocialIcon href="#" aria-label="Twitter"><Twitter size={18} /></SocialIcon>
              <SocialIcon href="#" aria-label="Linkedin"><Linkedin size={18} /></SocialIcon>
              <SocialIcon href="#" aria-label="Instagram"><Instagram size={18} /></SocialIcon>
            </SocialLinks>
          </BrandColumn>

          {/* Quick Links Column */}
          <LinkColumn>
            <ColumnTitle>Sitemap</ColumnTitle>
            <LinkList>
              <li><FooterLink href="#why" onClick={(e) => handleLinkClick(e, "why")}>Why Us</FooterLink></li>
              <li><FooterLink href="#services" onClick={(e) => handleLinkClick(e, "services")}>Services</FooterLink></li>
              <li><FooterLink href="#projects" onClick={(e) => handleLinkClick(e, "projects")}>Featured Projects</FooterLink></li>
              <li><FooterLink href="#process" onClick={(e) => handleLinkClick(e, "process")}>Our Process</FooterLink></li>
              <li><FooterLink href="#team" onClick={(e) => handleLinkClick(e, "team")}>Team</FooterLink></li>
              <li><FooterLink href="#faq" onClick={(e) => handleLinkClick(e, "faq")}>FAQs</FooterLink></li>
            </LinkList>
          </LinkColumn>

          {/* Services Column */}
          <LinkColumn>
            <ColumnTitle>Capabilities</ColumnTitle>
            <LinkList>
              <li><FooterLink href="#services" onClick={(e) => handleLinkClick(e, "services")}>Brand Strategy</FooterLink></li>
              <li><FooterLink href="#services" onClick={(e) => handleLinkClick(e, "services")}>UI/UX Design</FooterLink></li>
              <li><FooterLink href="#services" onClick={(e) => handleLinkClick(e, "services")}>Web Design</FooterLink></li>
              <li><FooterLink href="#services" onClick={(e) => handleLinkClick(e, "services")}>Development</FooterLink></li>
              <li><FooterLink href="#services" onClick={(e) => handleLinkClick(e, "services")}>Web Applications</FooterLink></li>
              <li><FooterLink href="#services" onClick={(e) => handleLinkClick(e, "services")}>SEO Optimization</FooterLink></li>
            </LinkList>
          </LinkColumn>

          {/* Newsletter Column */}
          <NewsColumn>
            <ColumnTitle>Newsletter</ColumnTitle>
            <NewsText>
              Get weekly design insights, tech upgrades, and marketing frameworks straight to your inbox.
            </NewsText>
            {subscribed ? (
              <SuccessMsg>
                <Sparkles size={16} /> Subscribed successfully!
              </SuccessMsg>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
                <SubmitButton type="submit" aria-label="Subscribe">
                  <ArrowRight size={18} />
                </SubmitButton>
              </Form>
            )}
          </NewsColumn>
        </Grid>

        {/* Bottom Bar */}
        <BottomBar>
          <div>
            © {new Date().getFullYear()} MarkitMax Agency Inc. All rights reserved.
          </div>
          <PolicyLinks>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </PolicyLinks>
        </BottomBar>
      </ContentWrapper>
    </FooterContainer>
  );
}
