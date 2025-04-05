import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertCertificateSchema, 
  insertProfileSummarySchema 
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      // Ensure directory exists
      const uploadDir = path.join(process.cwd(), "attached_assets");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      // Use original name but make it safe
      const originalName = file.originalname;
      const safeName = originalName.replace(/[^a-zA-Z0-9_.-]/g, "_");
      cb(null, Date.now() + "-" + safeName);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only certain file types
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPEG, PNG and GIF files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for contact messages
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const validatedData = insertContactSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const validationError = fromZodError(validatedData.error);
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: validationError.message 
        });
      }
      
      // Store the contact message
      const contactMessage = await storage.createContactMessage(validatedData.data);
      
      return res.status(201).json({ 
        success: true, 
        message: "Message sent successfully",
        data: contactMessage
      });
      
    } catch (error) {
      console.error("Error submitting contact form:", error);
      return res.status(500).json({ 
        success: false, 
        message: "An error occurred while sending your message" 
      });
    }
  });

  app.get("/api/contact", async (_req: Request, res: Response) => {
    try {
      const messages = await storage.getContactMessages();
      return res.status(200).json({ 
        success: true, 
        data: messages 
      });
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      return res.status(500).json({ 
        success: false, 
        message: "An error occurred while fetching messages" 
      });
    }
  });

  // API routes for certificates
  app.get("/api/certificates", async (_req: Request, res: Response) => {
    try {
      const certificates = await storage.getCertificates();
      return res.status(200).json({ 
        success: true, 
        data: certificates 
      });
    } catch (error) {
      console.error("Error fetching certificates:", error);
      return res.status(500).json({ 
        success: false, 
        message: "An error occurred while fetching certificates" 
      });
    }
  });

  app.get("/api/certificates/:id", async (req: Request, res: Response) => {
    try {
      const certificateId = parseInt(req.params.id);
      
      if (isNaN(certificateId)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid certificate ID" 
        });
      }
      
      const certificate = await storage.getCertificate(certificateId);
      
      if (!certificate) {
        return res.status(404).json({ 
          success: false, 
          message: "Certificate not found" 
        });
      }
      
      return res.status(200).json({ 
        success: true, 
        data: certificate 
      });
    } catch (error) {
      console.error("Error fetching certificate:", error);
      return res.status(500).json({ 
        success: false, 
        message: "An error occurred while fetching the certificate" 
      });
    }
  });

  app.post("/api/certificates", async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const validatedData = insertCertificateSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const validationError = fromZodError(validatedData.error);
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: validationError.message 
        });
      }
      
      // Store the certificate
      const certificate = await storage.createCertificate(validatedData.data);
      
      return res.status(201).json({ 
        success: true, 
        message: "Certificate added successfully",
        data: certificate
      });
      
    } catch (error) {
      console.error("Error adding certificate:", error);
      return res.status(500).json({ 
        success: false, 
        message: "An error occurred while adding the certificate" 
      });
    }
  });

  app.put("/api/certificates/:id", async (req: Request, res: Response) => {
    try {
      const certificateId = parseInt(req.params.id);
      
      if (isNaN(certificateId)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid certificate ID" 
        });
      }
      
      // Validate the request body - we allow partial updates
      const updatedCertificate = await storage.updateCertificate(certificateId, req.body);
      
      if (!updatedCertificate) {
        return res.status(404).json({ 
          success: false, 
          message: "Certificate not found" 
        });
      }
      
      return res.status(200).json({ 
        success: true, 
        message: "Certificate updated successfully",
        data: updatedCertificate
      });
      
    } catch (error) {
      console.error("Error updating certificate:", error);
      return res.status(500).json({ 
        success: false, 
        message: "An error occurred while updating the certificate" 
      });
    }
  });

  app.delete("/api/certificates/:id", async (req: Request, res: Response) => {
    try {
      const certificateId = parseInt(req.params.id);
      
      if (isNaN(certificateId)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid certificate ID" 
        });
      }
      
      const isDeleted = await storage.deleteCertificate(certificateId);
      
      if (!isDeleted) {
        return res.status(404).json({ 
          success: false, 
          message: "Certificate not found" 
        });
      }
      
      return res.status(200).json({ 
        success: true, 
        message: "Certificate deleted successfully"
      });
      
    } catch (error) {
      console.error("Error deleting certificate:", error);
      return res.status(500).json({ 
        success: false, 
        message: "An error occurred while deleting the certificate" 
      });
    }
  });

  // API routes for profile summary
  app.get("/api/profile", async (_req: Request, res: Response) => {
    try {
      const profile = await storage.getProfileSummary();
      
      if (!profile) {
        return res.status(404).json({ 
          success: false, 
          message: "Profile summary not found" 
        });
      }
      
      return res.status(200).json({ 
        success: true, 
        data: profile 
      });
    } catch (error) {
      console.error("Error fetching profile summary:", error);
      return res.status(500).json({ 
        success: false, 
        message: "An error occurred while fetching the profile summary" 
      });
    }
  });

  app.put("/api/profile/:id", async (req: Request, res: Response) => {
    try {
      const profileId = parseInt(req.params.id);
      
      if (isNaN(profileId)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid profile ID" 
        });
      }
      
      // Update profile summary
      const updatedProfile = await storage.updateProfileSummary(profileId, req.body);
      
      if (!updatedProfile) {
        return res.status(404).json({ 
          success: false, 
          message: "Profile summary not found" 
        });
      }
      
      return res.status(200).json({ 
        success: true, 
        message: "Profile updated successfully",
        data: updatedProfile
      });
      
    } catch (error) {
      console.error("Error updating profile summary:", error);
      return res.status(500).json({ 
        success: false, 
        message: "An error occurred while updating the profile summary" 
      });
    }
  });

  // File upload endpoint for resume
  app.post("/api/upload/resume", upload.single("resume"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded"
        });
      }
      
      // Get the file path
      const filePath = `/attached_assets/${req.file.filename}`;
      
      // Get current profile
      const profile = await storage.getProfileSummary();
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Profile not found"
        });
      }
      
      // Update resume URL
      const updatedProfile = await storage.updateProfileSummary(profile.id, {
        resumeUrl: filePath
      });
      
      return res.status(200).json({
        success: true,
        message: "Resume uploaded successfully",
        data: {
          resumeUrl: filePath,
          profile: updatedProfile
        }
      });
      
    } catch (error) {
      console.error("Error uploading resume:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while uploading the resume"
      });
    }
  });

  // File upload endpoint for certificate images
  app.post("/api/upload/certificate", upload.single("certificateImage"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded"
        });
      }
      
      // Get the file path
      const filePath = `/attached_assets/${req.file.filename}`;
      
      return res.status(200).json({
        success: true,
        message: "Certificate image uploaded successfully",
        data: {
          imageUrl: filePath
        }
      });
      
    } catch (error) {
      console.error("Error uploading certificate image:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while uploading the certificate image"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
