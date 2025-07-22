import type { Express } from "express";
import { createServer, type Server } from "http";
import axios from "axios";
import { storage } from "./storage";
import { insertSubmissionSchema, type InsertSubmission } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Submit horoscope data and forward to Make.com webhook
  app.post("/api/submissions", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertSubmissionSchema.parse(req.body);

      // Store submission
      const submission = await storage.createSubmission(validatedData);

      // Forward to Make.com webhook
      let webhookUrl = process.env.MAKE_WEBHOOK_URL || process.env.WEBHOOK_URL;
      
      if (!webhookUrl) {
        console.error("No Make.com webhook URL configured");
        return res.status(500).json({ 
          message: "Webhook configuration error. Please contact support." 
        });
      }

      // Handle Make.com webhook URL format correctly
      if (!webhookUrl.startsWith('http://') && !webhookUrl.startsWith('https://')) {
        // Make.com webhook format: token@hook.region.make.com
        if (webhookUrl.includes('@hook.') && webhookUrl.includes('.make.com')) {
          const [token, hostPart] = webhookUrl.split('@');
          webhookUrl = `https://${hostPart}/${token}`;
        } else {
          webhookUrl = 'https://' + webhookUrl;
        }
      }
      
      console.log('Attempting webhook to:', webhookUrl);

      // Send simple JSON data according to Make.com documentation
      const webhookData = {
        email: submission.email,
        horoscope_sign: submission.horoscopeSign,
        mood: submission.mood
      };
      
      console.log('Sending webhook data:', JSON.stringify(webhookData, null, 2));
      
      const webhookResponse = await axios.post(webhookUrl, webhookData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (webhookResponse.status < 200 || webhookResponse.status >= 300) {
        console.error(`Webhook failed: ${webhookResponse.status} ${webhookResponse.statusText}`);
        return res.status(500).json({ 
          message: "Failed to send data to external service. Please try again." 
        });
      }

      res.json({ 
        message: "Your cosmic data has been sent successfully! ✨",
        id: submission.id 
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Please check your form data and try again.",
          errors: error.errors 
        });
      }

      console.error("Submission error:", error);
      res.status(500).json({ 
        message: "An unexpected error occurred. Please try again later." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
