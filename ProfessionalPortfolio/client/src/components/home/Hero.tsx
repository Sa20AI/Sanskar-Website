import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="hero" className="min-h-[85vh] flex items-center py-20 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0 md:pr-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary dark:text-primary font-medium mb-4">Hi, my name is</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Sanskar Unkule</h1>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-600 dark:text-slate-300 mb-6">
              Prompt Engineer & AI Specialist
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-400 mb-8 max-w-lg">
              I specialize in developing and refining prompt structures to improve AI model accuracy and reliability, with expertise in RLHF, LLM optimization, and data annotation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <a href="#contact">Get in touch</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#projects">See my work</a>
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-primary dark:bg-primary overflow-hidden shadow-xl">
              <div className="w-full h-full bg-gradient-to-br from-primary to-pink-500 dark:from-primary dark:to-pink-500 opacity-90 flex items-center justify-center text-white text-6xl font-bold">
                SU
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
