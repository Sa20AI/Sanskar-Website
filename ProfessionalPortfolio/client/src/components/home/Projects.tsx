import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ProjectorIcon, Video, Search } from "lucide-react";

const projects = [
  {
    title: "Cypher RLHF Safety",
    period: "Nov 2024 - Present",
    tags: ["LLM", "RLHF"],
    icon: <ShieldAlert className="h-12 w-12" />,
    bgClass: "from-primary/90 to-pink-500/90 dark:from-primary/90 dark:to-pink-500/90",
    description: [
      "Applied Reinforcement Learning with Human Feedback (RLHF) to evaluate and provide feedback on user-entered prompts and model-generated responses.",
      "Identified improvement areas in prompt-response interactions to enhance model performance and alignment with desired outcomes.",
      "Contributed to the iterative refinement of the model by ensuring high-quality feedback and effective instruction adjustments."
    ]
  },
  {
    title: "Association Plowman",
    period: "Nov 2024 - Present",
    tags: ["LLM", "RLHF"],
    icon: <ProjectorIcon className="h-12 w-12" />,
    bgClass: "from-indigo-500/90 to-primary/90 dark:from-primary/90 dark:to-indigo-500/90",
    description: [
      "Leveraged Reinforcement Learning with Human Feedback (RLHF) to evaluate problem statements and ensure prompts adhered to clarity and alignment with user instructions.",
      "Debugged and tested model-generated code to verify functionality and compliance with user requirements.",
      "Delivered constructive feedback to refine prompts and model responses, enhancing overall performance and usability."
    ]
  },
  {
    title: "Dense Video Captioning Commercial VITA",
    period: "Oct 2024 - Present",
    tags: ["LLM", "Data Annotation"],
    icon: <Video className="h-12 w-12" />,
    bgClass: "from-pink-500/90 to-indigo-500/90 dark:from-pink-500/90 dark:to-indigo-500/90",
    description: [
      "Annotated video datasets by crafting precise event captions and global captions to facilitate accurate model training for dense video captioning.",
      "Performed Quality Assurance (QA) to ensure high-quality annotations, validating data accuracy and consistency to optimize model performance.",
      "Contributed to enhancing the efficiency of AI models by delivering reliable and comprehensive video captioning datasets."
    ]
  },
  {
    title: "Information Retrieval Using Evolutionary Algorithm",
    period: "Jul 2023 - Apr 2024",
    tags: ["NLP", "IR", "ML"],
    icon: <Search className="h-12 w-12" />,
    bgClass: "from-primary/90 to-indigo-500/90 dark:from-indigo-500/90 dark:to-pink-500/90",
    description: [
      "Developed a comprehensive system for efficient information retrieval using evolutionary algorithms.",
      "Implemented inverted indexing and an advanced document indexing method.",
      "Applied modified genetic algorithm, cultural algorithm, and other optimization methods to enhance search accuracy."
    ]
  }
];

const Projects = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <section 
      id="projects" 
      ref={ref} 
      className="py-20 bg-white dark:bg-gray-800"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Projects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface ProjectProps {
  title: string;
  period: string;
  tags: string[];
  icon: React.ReactNode;
  bgClass: string;
  description: string[];
}

interface ProjectCardProps {
  project: ProjectProps;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:translate-y-[-5px] transition-all duration-300 hover:shadow-lg">
        <div className={`h-48 bg-gradient-to-r ${project.bgClass} p-6 flex items-center justify-center`}>
          <div className="text-white">
            {project.icon}
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold">{project.title}</h3>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
              {project.period}
            </Badge>
          </div>
          
          <div className="mb-4 flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 mb-6">
            {project.description.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-primary mr-2 mt-0.5 text-xs">●</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Projects;
