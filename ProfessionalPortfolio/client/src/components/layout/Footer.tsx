import { Link } from "wouter";
import { FaLinkedinIn, FaEnvelope, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-800 dark:bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-center md:text-left">&copy; {new Date().getFullYear()} Sanskar Unkule. All rights reserved.</p>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="https://linkedin.com/in/sanskarunkule" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition duration-300"
              aria-label="LinkedIn Profile"
            >
              <FaLinkedinIn />
            </a>
            <a 
              href="mailto:sanskarunkule02@gmail.com" 
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition duration-300"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition duration-300"
              aria-label="GitHub Profile"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
