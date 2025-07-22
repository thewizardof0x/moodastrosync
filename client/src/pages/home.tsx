import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Star, Mail, Sparkles, Smile, Send, Loader2, CheckCircle, AlertTriangle, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertSubmissionSchema, horoscopeSigns, type InsertSubmission } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<InsertSubmission>({
    resolver: zodResolver(insertSubmissionSchema),
    defaultValues: {
      email: "",
      horoscopeSign: "",
      mood: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertSubmission) => {
      const response = await apiRequest("POST", "/api/submissions", data);
      return response.json();
    },
    onSuccess: () => {
      setShowSuccess(true);
      setShowError(false);
      form.reset();
      // Scroll to success message
      setTimeout(() => {
        document.getElementById("successMessage")?.scrollIntoView({ 
          behavior: "smooth", 
          block: "center" 
        });
      }, 100);
    },
    onError: (error: any) => {
      setShowError(true);
      setShowSuccess(false);
      setErrorMessage(error.message || "Something went wrong. Please try again later.");
      // Scroll to error message
      setTimeout(() => {
        document.getElementById("errorMessage")?.scrollIntoView({ 
          behavior: "smooth", 
          block: "center" 
        });
      }, 100);
    },
  });

  const onSubmit = (data: InsertSubmission) => {
    setShowSuccess(false);
    setShowError(false);
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full mb-4">
            <Star className="text-white text-2xl" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Horoscope Mood Tracker</h1>
          <p className="text-gray-600">Share your cosmic energy and current vibe</p>
        </div>

        {/* Main Form Card */}
        <Card className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Input */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                        <Mail className="mr-2 text-indigo-500" size={16} />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Horoscope Sign Selection */}
                <FormField
                  control={form.control}
                  name="horoscopeSign"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                        <Sparkles className="mr-2 text-violet-500" size={16} />
                        Horoscope Sign
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200">
                            <SelectValue placeholder="Select your zodiac sign" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {horoscopeSigns.map((sign) => (
                            <SelectItem key={sign.value} value={sign.value}>
                              {sign.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mood Input */}
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                        <Smile className="mr-2 text-yellow-500" size={16} />
                        Current Mood
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe how you're feeling right now..."
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <div className="mt-1 text-xs text-gray-500">
                        Share your emotions, energy level, or general state of mind
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending to the Universe...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send My Cosmic Data
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Success Message */}
        {showSuccess && (
          <div id="successMessage" className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="text-green-500 mr-3" size={20} />
              <div>
                <h3 className="text-sm font-medium text-green-800">Success!</h3>
                <p className="text-sm text-green-700 mt-1">
                  Your cosmic data has been sent successfully. The universe has received your message! ✨
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {showError && (
          <div id="errorMessage" className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="text-red-500 mr-3" size={20} />
              <div>
                <h3 className="text-sm font-medium text-red-800">Oops!</h3>
                <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Your data is securely processed and sent to Make.com</p>
          <div className="flex items-center justify-center mt-2">
            <Shield className="mr-1" size={14} />
            <span>Privacy Protected</span>
            <span className="mx-2">•</span>
            <Lock className="mr-1" size={14} />
            <span>SSL Secured</span>
          </div>
        </div>
      </div>
    </div>
  );
}
