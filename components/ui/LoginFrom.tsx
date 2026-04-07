"use client";

import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const session = await getSession();
      const role = session?.user?.role;

      toast.success("Login successful");

      if (role === "admin") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg bg-[var(--site-surface)] px-[24px] py-[32px]"
    >
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-[var(--site-border)] bg-[var(--site-panel)] pl-10 text-white placeholder:text-[var(--site-muted)]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-white">
            Password
          </Label>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-[var(--site-border)] bg-[var(--site-panel)] pl-10 pr-10 text-white placeholder:text-[var(--site-muted)]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="flex justify-end">
          <a
            href="/forgot-password"
            className="text-sm leading-none text-white hover:text-[var(--site-accent)]"
          >
            Forgot password?
          </a>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[var(--site-button-bg)] text-[var(--site-button-text)] hover:bg-white"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>

      <div className="text-center text-sm text-[var(--site-muted)]">
        Don&apos;t have an account?{" "}
        <a href="/sign-up" className="text-white hover:text-[var(--site-accent)]">
          Create one
        </a>
      </div>
    </form>
  );
}
