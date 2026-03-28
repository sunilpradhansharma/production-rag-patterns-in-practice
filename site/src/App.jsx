import Navbar from './components/Navbar.jsx'
import SectionDivider from './components/SectionDivider.jsx'
import HeroSection from './sections/HeroSection.jsx'
import PatternChooserSection from './sections/PatternChooserSection.jsx'
import PatternExplorerSection from './sections/PatternExplorerSection.jsx'
import ArchitectureSection from './sections/ArchitectureSection.jsx'
import LearningPathsSection from './sections/LearningPathsSection.jsx'
import UseCasesSection from './sections/UseCasesSection.jsx'
import CTASection from './sections/CTASection.jsx'

export default function App() {
  return (
    <div className="page-bg">
      <Navbar />
      <div className="content-layer">
        <HeroSection />
        <SectionDivider />
        <PatternChooserSection />
        <SectionDivider />
        <PatternExplorerSection />
        <SectionDivider />
        <ArchitectureSection />
        <SectionDivider />
        <LearningPathsSection />
        <SectionDivider />
        <UseCasesSection />
        <SectionDivider />
        <CTASection />
      </div>
    </div>
  )
}
