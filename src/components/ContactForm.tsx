import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { gsap } from "gsap";
import { X, Send, CheckCircle2, Sparkles } from "lucide-react";

const DrawerOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(5, 5, 5, 0.7);
  backdrop-filter: blur(10px);
  z-index: 2000;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  pointer-events: ${props => (props.isOpen ? "all" : "none")};
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  justify-content: flex-end;
`;

const DrawerContent = styled.div`
  width: 100%;
  max-width: 580px;
  height: 100%;
  background-color: #101010;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: -20px 0 50px rgba(0, 0, 0, 0.6);
  padding: 60px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 40px 30px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
`;

const FormTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #FFFFFF;
  
  span {
    color: #C7FF2F;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #B8B8B8;
  cursor: pointer;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    color: #FFFFFF;
    border-color: #FFFFFF;
    background-color: rgba(255, 255, 255, 0.03);
    transform: rotate(90deg);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
  flex-grow: 1;
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
`;

const FloatingInput = styled.input`
  width: 100%;
  padding: 12px 0;
  background: none;
  border: none;
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #C7FF2F;
  }
`;

const FloatingLabel = styled.label<{ isFocused: boolean }>`
  position: absolute;
  top: ${props => (props.isFocused ? "-16px" : "12px")};
  left: 0;
  font-family: 'Inter', sans-serif;
  font-size: ${props => (props.isFocused ? "11px" : "14px")};
  color: ${props => (props.isFocused ? "#C7FF2F" : "#888888")};
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  pointer-events: none;
`;

const TextareaGroup = styled.div`
  position: relative;
  width: 100%;
`;

const FloatingTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px 0;
  background: none;
  border: none;
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  outline: none;
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #C7FF2F;
  }
`;

const LabelGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionLabel = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #B8B8B8;
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const OptionBadge = styled.button<{ selected: boolean }>`
  background-color: ${props => (props.selected ? "rgba(199, 255, 47, 0.1)" : "rgba(255, 255, 255, 0.02)")};
  border: 1px solid ${props => (props.selected ? "#C7FF2F" : "rgba(255, 255, 255, 0.08)")};
  color: ${props => (props.selected ? "#C7FF2F" : "#FFFFFF")};
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 18px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => (props.selected ? "#C7FF2F" : "rgba(255, 255, 255, 0.2)")};
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #C7FF2F;
  border: none;
  color: #050505;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  font-weight: 600;
  padding: 16px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  margin-top: 20px;
  box-shadow: 0 4px 15px rgba(199, 255, 47, 0.15);
  
  &:hover {
    background-color: #7B61FF;
    color: #FFFFFF;
    box-shadow: 0 8px 25px rgba(123, 97, 255, 0.3);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// Loading indicator
const Loader = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid currentColor;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Success screen
const SuccessScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #101010;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
`;

const SuccessIconWrapper = styled.div`
  color: #C7FF2F;
  margin-bottom: 24px;
  position: relative;
  
  svg.check {
    width: 64px;
    height: 64px;
  }
  
  svg.sparkle {
    position: absolute;
    top: -10px;
    right: -10px;
    color: #7B61FF;
    animation: bounce 2s infinite alternate;
  }
  
  @keyframes bounce {
    to { transform: translateY(-5px) scale(1.1); }
  }
`;

const SuccessTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 16px;
`;

const SuccessText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: #B8B8B8;
  max-width: 360px;
  margin-bottom: 32px;
`;

export function ContactForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Field values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [desc, setDesc] = useState("");
  const [service, setService] = useState("Web Design");
  const [budget, setBudget] = useState("$25k - $50k");
  
  // Form status
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // GSAP slide-in effect
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        content,
        { x: "100%" },
        { x: "0%", duration: 0.6, ease: "power4.out" }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(content, {
        x: "100%",
        duration: 0.5,
        ease: "power4.in"
      });
      // Reset submitted state when closed
      const timer = setTimeout(() => {
        setSubmitted(false);
        setName("");
        setEmail("");
        setDesc("");
        setService("Web Design");
        setBudget("$25k - $50k");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1800);
  };

  return (
    <DrawerOverlay isOpen={isOpen} onClick={onClose}>
      <DrawerContent ref={contentRef} onClick={(e) => e.stopPropagation()}>
        <HeaderRow>
          <FormTitle>
            Start project<span>.</span>
          </FormTitle>
          <CloseButton onClick={onClose} aria-label="Close form">
            <X size={20} />
          </CloseButton>
        </HeaderRow>

        {submitted ? (
          <SuccessScreen>
            <SuccessIconWrapper>
              <CheckCircle2 className="check" />
              <Sparkles className="sparkle" size={24} />
            </SuccessIconWrapper>
            <SuccessTitle>Discovery Call Scheduled!</SuccessTitle>
            <SuccessText>
              Thank you, {name}. We have received your inquiry for a {service} project and will reach out to you within 24 business hours.
            </SuccessText>
            <SubmitButton onClick={onClose} style={{ minWidth: "150px" }}>
              Back to Site
            </SubmitButton>
          </SuccessScreen>
        ) : (
          <Form onSubmit={handleSubmit}>
            {/* Name */}
            <InputGroup>
              <FloatingInput 
                id="contact-name"
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
              <FloatingLabel htmlFor="contact-name" isFocused={name.length > 0}>Your Name</FloatingLabel>
            </InputGroup>

            {/* Email */}
            <InputGroup>
              <FloatingInput 
                id="contact-email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <FloatingLabel htmlFor="contact-email" isFocused={email.length > 0}>Email Address</FloatingLabel>
            </InputGroup>

            {/* Service Selection */}
            <LabelGroup>
              <SectionLabel>What service do you need?</SectionLabel>
              <BadgeRow>
                {["UI/UX Design", "Web Design", "Development", "SaaS Platform", "Brand Identity", "SEO Optimization"].map((opt) => (
                  <OptionBadge 
                    type="button" 
                    key={opt} 
                    selected={service === opt} 
                    onClick={() => setService(opt)}
                  >
                    {opt}
                  </OptionBadge>
                ))}
              </BadgeRow>
            </LabelGroup>

            {/* Budget Range */}
            <LabelGroup>
              <SectionLabel>Estimated Budget</SectionLabel>
              <BadgeRow>
                {["<$10k", "$10k - $25k", "$25k - $50k", "$50k - $100k", "$100k+"].map((opt) => (
                  <OptionBadge 
                    type="button" 
                    key={opt} 
                    selected={budget === opt} 
                    onClick={() => setBudget(opt)}
                  >
                    {opt}
                  </OptionBadge>
                ))}
              </BadgeRow>
            </LabelGroup>

            {/* Project Details */}
            <TextareaGroup>
              <FloatingTextarea 
                id="contact-details"
                value={desc} 
                onChange={(e) => setDesc(e.target.value)} 
              />
              <FloatingLabel htmlFor="contact-details" isFocused={desc.length > 0}>Brief Project Description (Optional)</FloatingLabel>
            </TextareaGroup>

            <SubmitButton type="submit" disabled={submitting || !name || !email}>
              {submitting ? (
                <>
                  <Loader /> Processing...
                </>
              ) : (
                <>
                  Send Inquiry <Send size={16} />
                </>
              )}
            </SubmitButton>
          </Form>
        )}
      </DrawerContent>
    </DrawerOverlay>
  );
}
