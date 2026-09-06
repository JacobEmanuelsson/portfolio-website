
import SkillsSection from "@/features/skills/SkillsSection";
import ContactSection from "@/features/contact/ContactSection";
import HeroSection from "@/features/hero/HeroSection";
import AboutSection from "@/features/about/AboutSection";
import ProjectsSection from "@/features/projects/ProjectsSection";
import Deck from "@/experience/Deck";

export default function Home() {
  return (
    <Deck>
      <HeroSection/>
      <SkillsSection/>

      <ProjectsSection/>
      <AboutSection/>
      <ContactSection/>
    </Deck>

  );
}
