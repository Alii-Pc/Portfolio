import { useState } from "react";
import { ThemeProvider } from "./hooks/useTheme";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoadingScreen from "./components/LoadingScreen";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Certifications from "./components/Certifications";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import VerifyEmail from "./components/VerifyEmail";

function AppContent() {
  const [loaded, setLoaded] = useState(false);
  const { view } = useAuth();

  if (view === "login") {
    return <Login />;
  }
  if (view === "signup") {
    return <Signup />;
  }
  if (view === "verify") {
    return <VerifyEmail />;
  }

  return (
    <>
      <LoadingScreen onDone={() => setLoaded(true)} />
      {loaded && (
        <>
          <ScrollProgress />
          <Navbar />
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Education />
            <Certifications />
            <Resume />
            <Contact />
          </main>
          <Footer />
          <BackToTop />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
