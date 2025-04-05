import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import { FaGraduationCap, FaEnvelope, FaPhone } from "react-icons/fa";
import { FaCode, FaBrain, FaRobot, FaTag } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <section 
      id="about" 
      ref={ref} 
      className="py-20 bg-white dark:bg-gray-800"
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col md:flex-row gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-8 inline-block border-b-4 border-primary pb-2">About Me</h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                I'm a Prompt Engineer with expertise in AI model optimization and LLM implementations. With a background in Computer Engineering from SIES Graduate School of Technology, I've developed a strong foundation in machine learning, data science, and NLP.
              </p>
              <p>
                Currently working at Zensar Technologies for NVIDIA's NeMo project, I specialize in developing and refining prompt structures to improve AI model accuracy and reliability. I also collaborate as a freelance Prompt Engineer with Outlier.ai on diverse projects including Cypher RLHF Safety and Multilingual Centralized Screening.
              </p>
              <p>
                My expertise includes Reinforcement Learning with Human Feedback (RLHF), where I evaluate and provide detailed feedback on model-generated responses to enhance performance and alignment with project objectives.
              </p>
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 dark:bg-primary/10 rounded-md">
                  <FaGraduationCap className="text-primary dark:text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Education</h3>
                  <p className="text-slate-600 dark:text-slate-400">BE in Computer Engineering, SIES Graduate School of Technology</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 dark:bg-primary/10 rounded-md">
                  <FaEnvelope className="text-primary dark:text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-slate-600 dark:text-slate-400">sanskarunkule02@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 dark:bg-primary/10 rounded-md">
                  <FaPhone className="text-primary dark:text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-slate-600 dark:text-slate-400">+91 8879092506</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-6 max-w-md">
              <SkillCard 
                icon={<FaCode />} 
                title="Prompt Engineering" 
                description="Creating optimized prompt structures for AI models" 
              />
              <SkillCard 
                icon={<FaBrain />} 
                title="RLHF" 
                description="Reinforcement Learning with Human Feedback" 
              />
              <SkillCard 
                icon={<FaRobot />} 
                title="LLM Optimization" 
                description="Enhancing large language model performance" 
              />
              <SkillCard 
                icon={<FaTag />} 
                title="Data Annotation" 
                description="Creating high-quality training datasets" 
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface SkillCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SkillCard = ({ icon, title, description }: SkillCardProps) => {
  return (
    <Card className="hover:translate-y-[-5px] transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="text-primary dark:text-primary text-4xl mb-2">
          {icon}
        </div>
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
      </CardContent>
    </Card>
  );
};

export default About;
