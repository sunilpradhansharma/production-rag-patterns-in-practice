import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import PatternRecommender from './components/PatternRecommender.jsx'
import PatternExplorer from './components/PatternExplorer.jsx'
import ArchitectureSection from './components/ArchitectureSection.jsx'
import LearningPaths from './components/LearningPaths.jsx'
import UseCases from './components/UseCases.jsx'
import CTA from './components/CTA.jsx'

export default function App() {
  return (
    <div className="page-bg">
      <Nav />
      <div className="content-layer">
        <Hero />
        <PatternRecommender />
        <PatternExplorer />
        <ArchitectureSection />
        <LearningPaths />
        <UseCases />
        <CTA />
      </div>
    </div>
  )
}
