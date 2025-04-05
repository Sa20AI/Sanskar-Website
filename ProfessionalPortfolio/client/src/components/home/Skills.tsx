import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const skillCategories = [
  {
    title: "Programming Languages",
    skills: ["Python", "C"]
  },
  {
    title: "Technical Expertise",
    skills: [
      "Machine Learning", 
      "Data Science", 
      "Big Data Analytics", 
      "NLP", 
      "Database Management", 
      "Data Annotation", 
      "Large Language Model", 
      "Reinforcement Learning from Human Feedback (RLHF)"
    ]
  },
  {
    title: "Machine Learning Frameworks",
    skills: [
      "PyTorch", 
      "TensorFlow", 
      "Pandas", 
      "NumPy", 
      "SciPy", 
      "Scikit-learn", 
      "Superannotate", 
      "Hugging Face", 
      "Chat GPT", 
      "Anthropic"
    ]
  }
];

const skillProgress = [
  { name: "Prompt Engineering", value: 95 },
  { name: "RLHF", value: 90 },
  { name: "Data Annotation", value: 85 },
  { name: "Machine Learning", value: 80 }
];

const Skills = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <section 
      id="skills" 
      ref={ref} 
      className="py-20 bg-slate-50 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-12 text-center">Technical Skills</h2>
          
          <div className="max-w-4xl mx-auto">
            {skillCategories.map((category, index) => (
              <SkillCategory 
                key={index} 
                title={category.title} 
                skills={category.skills} 
                index={index} 
              />
            ))}
            
            <SkillProgressSection skillProgress={skillProgress} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface SkillCategoryProps {
  title: string;
  skills: string[];
  index: number;
}

const SkillCategory = ({ title, skills, index }: SkillCategoryProps) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-10"
    >
      <h3 className="text-xl font-bold mb-6 text-primary">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.1 + i * 0.05 }}
          >
            <Badge 
              variant="outline" 
              className="px-4 py-2 bg-white dark:bg-gray-700 text-slate-700 dark:text-slate-300 shadow-sm font-medium hover:bg-slate-100 dark:hover:bg-gray-600 hover:scale-105 transition-all duration-300"
            >
              {skill}
            </Badge>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

interface SkillProgressSectionProps {
  skillProgress: { name: string; value: number }[];
}

const SkillProgressSection = ({ skillProgress }: SkillProgressSectionProps) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      {skillProgress.map((skill, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
        >
          <div className="flex justify-between mb-2">
            <span className="font-medium">{skill.name}</span>
            <span>{skill.value}%</span>
          </div>
          <Progress 
            value={isVisible ? skill.value : 0} 
            className="h-3 bg-slate-200 dark:bg-gray-700"
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Skills;
