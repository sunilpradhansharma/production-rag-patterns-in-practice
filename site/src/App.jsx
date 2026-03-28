import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import PatternRecommender from './components/PatternRecommender.jsx'
import PatternExplorer from './components/PatternExplorer.jsx'
import ArchitectureSection from './components/ArchitectureSection.jsx'
import LearningPaths from './components/LearningPaths.jsx'
import UseCases from './components/UseCases.jsx'
import CTA from './components/CTA.jsx'

function Divider() {
  return (
    <div style={{ padding: '0 24px' }}>
      <div className="section-divider" />
    </div>
  )
}

export default function App() {
  return (
    <div className="page-bg">
      <Nav />
      <div className="content-layer">
        <Hero />
        <Divider />
        <PatternRecommender />
        <Divider />
        <PatternExplorer />
        <Divider />
        <ArchitectureSection />
        <Divider />
        <LearningPaths />
        <Divider />
        <UseCases />
        <Divider />
        <CTA />
      </div>
    </div>
  )
}
