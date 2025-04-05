import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Experience from "@/components/home/Experience";
import Projects from "@/components/home/Projects";
import Skills from "@/components/home/Skills";
import Certificates from "@/components/home/Certificates";
import Contact from "@/components/home/Contact";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Sanskar Unkule | Prompt Engineer</title>
        <meta name="description" content="Professional portfolio of Sanskar Unkule, Prompt Engineer specializing in AI model optimization and LLM implementations." />
        <meta name="keywords" content="Prompt Engineer, RLHF, LLM, AI, Machine Learning, Portfolio" />
      </Helmet>
      
      <Header />
      
      <main className="pt-16">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Certificates />
        <Contact />
      </main>
      
      <Footer />
    </>
  );
};

export default Home;
