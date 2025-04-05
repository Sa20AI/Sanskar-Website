import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white dark:bg-gray-900 shadow-md" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold mr-6">
            <span className="bg-gradient-to-r from-indigo-400 via-primary to-pink-500 dark:from-indigo-300 dark:via-primary dark:to-pink-400 bg-clip-text text-transparent">
              Sanskar<span className="font-bold">.dev</span>
            </span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <NavLink href="#about">About</NavLink>
            <NavLink href="#experience">Experience</NavLink>
            <NavLink href="#projects">Projects</NavLink>
            <NavLink href="#skills">Skills</NavLink>
            <NavLink href="#certificates">Certificates</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="/attached_assets/Sanskar_Resume.pdf" 
              className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md font-medium hidden md:block transition duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </a>
            
            <ThemeToggle />
            
            <Button variant="outline" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      </div>
      
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <a 
      href={href} 
      className="relative font-medium hover:text-primary dark:hover:text-primary transition-colors after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-primary dark:after:bg-primary after:transition-all hover:after:w-full"
    >
      {children}
    </a>
  );
};

export default Header;
