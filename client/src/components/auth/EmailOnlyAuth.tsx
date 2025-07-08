import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const emailAuthSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type EmailAuthData = z.infer<typeof emailAuthSchema>;

export default function EmailOnlyAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { refetchUser } = useAuth();

  const form = useForm<EmailAuthData>({
    resolver: zodResolver(emailAuthSchema),
    defaultValues: {
      email: "",
    },
  });

  const emailAuthMutation = useMutation({
    mutationFn: async (data: EmailAuthData) => {
      setIsLoading(true);
      // Create a magic link login
      const response = await apiRequest("/api/auth/magic-link", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Check your email",
        description: "We've sent you a magic link to sign in.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Authentication failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit = (data: EmailAuthData) => {
    emailAuthMutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          Quick Sign In
        </h3>
        <p className="text-sm text-gray-300">
          Enter your email to receive a magic link
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-200">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#B7DEE8] text-[#0C2836] hover:bg-[#A1C9D3] font-semibold"
          >
            {isLoading ? "Sending..." : "Send Magic Link"}
          </Button>
        </form>
      </Form>
    </div>
  );
}