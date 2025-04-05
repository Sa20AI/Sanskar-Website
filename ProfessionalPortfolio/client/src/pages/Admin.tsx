import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Trash2, 
  PlusCircle, 
  Save, 
  X, 
  Award, 
  User, 
  Calendar,
  ExternalLink,
  Upload
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { type Certificate, type ProfileSummary } from "@shared/schema";

// Certificate form schema
const certificateFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  issuer: z.string().min(2, { message: "Issuer must be at least 2 characters" }),
  date: z.string().min(2, { message: "Date is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  imageUrl: z.string().optional(),
});

// Profile form schema
const profileFormSchema = z.object({
  title: z.string().min(2, { message: "Name must be at least 2 characters" }),
  headline: z.string().min(5, { message: "Headline must be at least 5 characters" }),
  bio: z.string().min(20, { message: "Bio must be at least 20 characters" }),
});

type CertificateFormValues = z.infer<typeof certificateFormSchema>;
type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Admin = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [editingCertificateId, setEditingCertificateId] = useState<number | null>(null);
  const [isAddingCertificate, setIsAddingCertificate] = useState(false);
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Fetch certificates
  const { 
    data: certificates, 
    isLoading: isLoadingCertificates, 
    isError: isCertificatesError 
  } = useQuery<Certificate[]>({
    queryKey: ['/api/certificates'],
    refetchOnWindowFocus: false
  });
  
  // Fetch profile
  const { 
    data: profile, 
    isLoading: isLoadingProfile, 
    isError: isProfileError 
  } = useQuery<ProfileSummary>({
    queryKey: ['/api/profile'],
    refetchOnWindowFocus: false
  });

  // Certificate form
  const certificateForm = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: {
      title: "",
      issuer: "",
      date: "",
      description: "",
      credentialId: "",
      credentialUrl: "",
      imageUrl: "",
    }
  });
  
  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      title: "",
      headline: "",
      bio: ""
    }
  });
  
  // Set profile form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        title: profile.title,
        headline: profile.headline,
        bio: profile.bio
      });
    }
  }, [profile, profileForm]);
  
  // Set certificate form values when editing
  useEffect(() => {
    if (editingCertificateId && certificates) {
      const certificate = certificates.find(cert => cert.id === editingCertificateId);
      if (certificate) {
        certificateForm.reset({
          title: certificate.title,
          issuer: certificate.issuer,
          date: certificate.date,
          description: certificate.description,
          credentialId: certificate.credentialId || "",
          credentialUrl: certificate.credentialUrl || "",
          imageUrl: certificate.imageUrl || ""
        });
      }
    }
  }, [editingCertificateId, certificates, certificateForm]);
  
  // Reset certificate form
  const resetCertificateForm = () => {
    certificateForm.reset({
      title: "",
      issuer: "",
      date: "",
      description: "",
      credentialId: "",
      credentialUrl: "",
      imageUrl: ""
    });
    setEditingCertificateId(null);
    setIsAddingCertificate(false);
  };
  
  // Handle certificate submission
  const onSubmitCertificate = async (data: CertificateFormValues) => {
    try {
      if (editingCertificateId) {
        // Update existing certificate
        await apiRequest("PUT", `/api/certificates/${editingCertificateId}`, data);
        toast({
          title: "Success!",
          description: "Certificate updated successfully."
        });
      } else {
        // Add new certificate
        await apiRequest("POST", "/api/certificates", data);
        toast({
          title: "Success!",
          description: "Certificate added successfully."
        });
      }
      
      // Refetch certificates
      queryClient.invalidateQueries({ queryKey: ['/api/certificates'] });
      resetCertificateForm();
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save certificate. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle profile update
  const onSubmitProfile = async (data: ProfileFormValues) => {
    try {
      if (!profile) {
        toast({
          title: "Error",
          description: "Profile data not available.",
          variant: "destructive"
        });
        return;
      }
      
      await apiRequest("PUT", `/api/profile/${profile.id}`, data);
      toast({
        title: "Success!",
        description: "Profile updated successfully."
      });
      
      // Refetch profile
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle certificate deletion
  const handleDeleteCertificate = async (id: number) => {
    if (!confirm("Are you sure you want to delete this certificate?")) {
      return;
    }
    
    try {
      await apiRequest("DELETE", `/api/certificates/${id}`);
      toast({
        title: "Success!",
        description: "Certificate deleted successfully."
      });
      
      // Refetch certificates
      queryClient.invalidateQueries({ queryKey: ['/api/certificates'] });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete certificate. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle resume upload
  const handleResumeUpload = async () => {
    if (!selectedResume) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append("resume", selectedResume);
      
      const response = await fetch("/api/upload/resume", {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload resume");
      }
      
      const result = await response.json();
      
      toast({
        title: "Success!",
        description: "Resume uploaded successfully."
      });
      
      // Refetch profile
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      setSelectedResume(null);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Generate current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10); // YYYY-MM-DD
  };
  
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Sanskar Unkule</title>
      </Helmet>
      
      <div className="container mx-auto py-16 px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="profile" className="min-w-[120px]">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="certificates" className="min-w-[120px]">
              <Award className="mr-2 h-4 w-4" />
              Certificates
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Form */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Update Profile Information</CardTitle>
                  <CardDescription>
                    Update your name, headline, and bio that appears throughout your website.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingProfile ? (
                    <div className="flex justify-center my-8">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : isProfileError ? (
                    <div className="text-red-500 my-4">
                      Failed to load profile data. Please refresh the page.
                    </div>
                  ) : (
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
                        <FormField
                          control={profileForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="headline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Professional Headline</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Prompt Engineer & AI Specialist" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio / Summary</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Brief description of your professional background and expertise" 
                                  className="min-h-[120px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full">
                          Save Profile
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
              
              {/* Resume Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Resume Management</CardTitle>
                  <CardDescription>
                    Upload a new version of your resume.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile?.resumeUrl && (
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Current Resume</h3>
                      <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                        <span className="text-sm truncate mr-2">
                          {profile.resumeUrl.split('/').pop()}
                        </span>
                        <a
                          href={profile.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <Label htmlFor="resume">Upload New Resume (PDF)</Label>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setSelectedResume(e.target.files?.[0] || null)}
                    />
                    <Button 
                      onClick={handleResumeUpload} 
                      disabled={!selectedResume || isUploading}
                      className="w-full"
                    >
                      {isUploading ? (
                        <>
                          <span className="mr-2">Uploading...</span>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Resume
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Certificate Form */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>
                    {editingCertificateId ? "Edit Certificate" : isAddingCertificate ? "Add Certificate" : "Certificate Manager"}
                  </CardTitle>
                  <CardDescription>
                    {editingCertificateId ? "Update certificate details" : isAddingCertificate ? "Add a new certificate" : "Add or edit your professional certificates"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(isAddingCertificate || editingCertificateId) ? (
                    <Form {...certificateForm}>
                      <form onSubmit={certificateForm.handleSubmit(onSubmitCertificate)} className="space-y-4">
                        <FormField
                          control={certificateForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Certificate Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Prompt Engineering Certification" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={certificateForm.control}
                          name="issuer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Issuing Organization</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. DeepLearning.AI" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={certificateForm.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date Issued</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  max={getCurrentDate()}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={certificateForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Brief description of the certificate and skills acquired" 
                                  className="min-h-[80px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={certificateForm.control}
                          name="credentialId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Credential ID (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. ABC123XYZ" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={certificateForm.control}
                          name="credentialUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Credential URL (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={resetCertificateForm}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                          <Button type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            {editingCertificateId ? "Update" : "Save"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Award className="h-12 w-12 text-primary mb-4" />
                      <h3 className="text-lg font-medium mb-2">Manage Your Certificates</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
                        Add your professional certifications to showcase your credentials.
                      </p>
                      <Button 
                        onClick={() => setIsAddingCertificate(true)}
                        className="w-full"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Certificate
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Certificates List */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Your Certificates</CardTitle>
                  <CardDescription>
                    View and manage all your professional certificates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingCertificates ? (
                    <div className="flex justify-center my-8">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : isCertificatesError ? (
                    <div className="text-red-500 my-4">
                      Failed to load certificates. Please refresh the page.
                    </div>
                  ) : certificates && certificates.length > 0 ? (
                    <ScrollArea className="h-[500px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Issuer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {certificates.map((certificate) => (
                            <TableRow key={certificate.id}>
                              <TableCell className="font-medium">{certificate.title}</TableCell>
                              <TableCell>{certificate.issuer}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Calendar className="mr-1 h-3 w-3 text-slate-500" />
                                  <span className="text-slate-600 dark:text-slate-400 text-sm">
                                    {certificate.date}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingCertificateId(certificate.id)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteCertificate(certificate.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-12">
                      <Award className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Certificates Yet</h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-6">
                        You haven't added any certificates yet. Add your first certificate to showcase your credentials.
                      </p>
                      {!isAddingCertificate && (
                        <Button 
                          onClick={() => setIsAddingCertificate(true)}
                          className="mx-auto"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add First Certificate
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Admin;