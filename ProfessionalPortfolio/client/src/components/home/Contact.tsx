import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaLinkedinIn, FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setIsSubmitting(true);
      await apiRequest("POST", "/api/contact", data);
      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Your message couldn't be sent. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section 
      id="contact" 
      ref={ref} 
      className="py-20 bg-white dark:bg-gray-800"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-12 text-center">Get In Touch</h2>
          
          <div className="flex flex-col md:flex-row gap-12 max-w-5xl mx-auto">
            <div className="md:w-1/2">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6 text-primary">Contact Information</h3>
                  
                  <div className="space-y-6">
                    <ContactInfo 
                      icon={<FaEnvelope />} 
                      title="Email" 
                      value="sanskarunkule02@gmail.com" 
                      isLink={true} 
                      href="mailto:sanskarunkule02@gmail.com" 
                    />
                    
                    <ContactInfo 
                      icon={<FaPhone />} 
                      title="Phone" 
                      value="+91 8879092506" 
                      isLink={true} 
                      href="tel:+918879092506" 
                    />
                    
                    <ContactInfo 
                      icon={<FaLinkedinIn />} 
                      title="LinkedIn" 
                      value="linkedin.com/in/sanskarunkule" 
                      isLink={true} 
                      href="https://linkedin.com/in/sanskarunkule" 
                      external={true} 
                    />
                    
                    <ContactInfo 
                      icon={<FaMapMarkerAlt />} 
                      title="Location" 
                      value="Navi Mumbai, India" 
                    />
                  </div>
                  
                  <div className="mt-8">
                    <a 
                      href="/attached_assets/Sanskar_Resume.pdf" 
                      className="block w-full bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 text-white text-center py-3 rounded-md font-medium transition duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Resume
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:w-1/2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Subject" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Your message" 
                            className="resize-none" 
                            rows={5} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface ContactInfoProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  isLink?: boolean;
  href?: string;
  external?: boolean;
}

const ContactInfo = ({ icon, title, value, isLink = false, href = "#", external = false }: ContactInfoProps) => {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="text-primary dark:text-primary">{icon}</span>
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        {isLink ? (
          <a 
            href={href} 
            className={`${title === "LinkedIn" ? "text-primary dark:text-primary hover:underline" : "text-slate-600 dark:text-slate-400"}`}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {value}
          </a>
        ) : (
          <p className="text-slate-600 dark:text-slate-400 break-all">{value}</p>
        )}
      </div>
    </div>
  );
};

export default Contact;
