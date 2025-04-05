import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  useEffect(() => {
    // Prevent scrolling when menu is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleNavClick = (href: string) => {
    onClose();
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 300); // Small delay to allow menu animation to complete
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
            className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white dark:bg-gray-900 z-50 md:hidden shadow-xl overflow-y-auto"
          >
            <div className="p-5 flex justify-between items-center">
              <div className="text-xl font-bold">
                <span className="bg-gradient-to-r from-indigo-400 via-primary to-pink-500 dark:from-indigo-300 dark:via-primary dark:to-pink-400 bg-clip-text text-transparent">
                  Sanskar<span className="font-bold">.dev</span>
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex flex-col p-5 space-y-5">
              <NavItem href="#about" onClick={() => handleNavClick("#about")}>About</NavItem>
              <NavItem href="#experience" onClick={() => handleNavClick("#experience")}>Experience</NavItem>
              <NavItem href="#projects" onClick={() => handleNavClick("#projects")}>Projects</NavItem>
              <NavItem href="#skills" onClick={() => handleNavClick("#skills")}>Skills</NavItem>
              <NavItem href="#certificates" onClick={() => handleNavClick("#certificates")}>Certificates</NavItem>
              <NavItem href="#contact" onClick={() => handleNavClick("#contact")}>Contact</NavItem>
              <a 
                href="/attached_assets/Sanskar_Resume.pdf"
                className="bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-md font-medium text-center transition duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const NavItem = ({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) => {
  return (
    <a 
      href={href} 
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className="py-2 px-4 text-lg font-medium hover:bg-slate-100 dark:hover:bg-gray-800 rounded-md transition-colors"
    >
      {children}
    </a>
  );
};

export default MobileMenu;
