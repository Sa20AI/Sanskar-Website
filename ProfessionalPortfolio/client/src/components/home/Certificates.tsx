import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, Link as LinkIcon, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { type Certificate } from "@shared/schema";

const Certificates = () => {
  const { ref, isVisible } = useScrollAnimation();
  
  const { data: certificates, isLoading, isError } = useQuery<Certificate[]>({
    queryKey: ['/api/certificates'],
    refetchOnWindowFocus: false
  });
  
  return (
    <section 
      id="certificates" 
      ref={ref} 
      className="py-20 bg-slate-50 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Certifications</h2>
          
          {isLoading ? (
            <div className="flex justify-center my-12">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : isError ? (
            <div className="text-center text-red-500 my-8">
              Failed to load certificates. Please try again later.
            </div>
          ) : certificates && certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {certificates.map((certificate, index) => (
                <CertificateCard key={certificate.id} certificate={certificate} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center my-12 text-slate-500 dark:text-slate-400">
              <Award className="mx-auto h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg">No certificates added yet.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

interface CertificateCardProps {
  certificate: Certificate;
  index: number;
}

const CertificateCard = ({ certificate, index }: CertificateCardProps) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-primary">{certificate.title}</CardTitle>
          <CardDescription>{certificate.issuer}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              <span>{certificate.date}</span>
            </div>
            
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {certificate.description}
            </p>
            
            {certificate.credentialId && (
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <Badge variant="outline" className="font-mono text-xs">
                  ID: {certificate.credentialId}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
        
        {certificate.credentialUrl && (
          <CardFooter>
            <a 
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline text-sm"
            >
              <ExternalLink className="h-3 w-3" />
              View Credential
            </a>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default Certificates;