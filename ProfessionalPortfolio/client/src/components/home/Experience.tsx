import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const experiences = [
  {
    title: "Prompt Engineer",
    company: "Zensar Technologies",
    period: "Oct 2024 - Present",
    location: "Client: NVIDIA, Remote",
    responsibilities: [
      "Developed and refined prompt structures to improve AI model accuracy and reliability, focusing on advanced language model training and optimization under NVIDIA's NeMo project.",
      "Collaborated with cross-functional teams to customize prompts for varied applications, ensuring alignment with NVIDIA's project objectives and maintaining high standards of output quality.",
      "Generated dense captions for video data and contributed to chatbot creation planning, enhancing the project's data annotation and quality processes."
    ]
  },
  {
    title: "Prompt Engineer",
    company: "Outlier.ai",
    period: "Nov 2024 - Present",
    location: "Freelance, Remote",
    responsibilities: [
      "Collaborated as a freelance Prompt Engineer at Outlier on diverse projects, including Cypher RLHF Safety, Multilingual Centralized Screening, Kepler RLHF, and Association Plowman.",
      "Evaluated and provided detailed feedback on model-generated responses by employing Reinforcement Learning with Human Feedback (RLHF) techniques.",
      "Assessed prompts and model outputs to identify performance gaps and refine instruction sets, ensuring improved model accuracy and reliability.",
      "Contributed to fine-tuning the model through iterative feedback, enhancing its performance and alignment with project objectives."
    ]
  }
];

const Experience = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <section 
      id="experience" 
      ref={ref} 
      className="py-20 bg-slate-50 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-12 text-center">Professional Experience</h2>
          
          <div className="max-w-4xl mx-auto space-y-12">
            {experiences.map((experience, index) => (
              <ExperienceCard key={index} experience={experience} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface ExperienceProps {
  title: string;
  company: string;
  period: string;
  location: string;
  responsibilities: string[];
}

interface ExperienceCardProps {
  experience: ExperienceProps;
  index: number;
}

const ExperienceCard = ({ experience, index }: ExperienceCardProps) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="hover:translate-y-[-5px] transition-all duration-300"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-wrap justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-primary">{experience.title}</h3>
              <p className="text-lg font-medium">{experience.company}</p>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
                {experience.period}
              </Badge>
            </div>
          </div>
          
          <p className="text-slate-600 dark:text-slate-400 mb-2 italic">{experience.location}</p>
          
          <ul className="space-y-2 text-slate-700 dark:text-slate-300">
            {experience.responsibilities.map((responsibility, i) => (
              <li key={i} className="flex items-start">
                <span className="text-primary mr-2 mt-1"><Check className="h-4 w-4" /></span>
                <span>{responsibility}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Experience;
