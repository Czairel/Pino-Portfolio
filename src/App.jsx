import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Loader from "./components/Loader.jsx";
import { introSkipReason, shouldPlayIntro } from "./lib/motion.js";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";

export default function App() {
  const [intro, setIntro] = useState(shouldPlayIntro);

  useEffect(() => {
    if (import.meta.env.DEV && !intro) {
      const why = introSkipReason();
      if (why) console.info(`[intro] skipped: ${why}.`);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      {intro && <Loader onDone={() => setIntro(false)} />}
    </>
  );
}
