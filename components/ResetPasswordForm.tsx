"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    const storedEmail = searchParams.get("email");
    if (!storedEmail) {
      toast.error("Email not found in the URL.");
    } else {
      setEmail(storedEmail);
    }

    if (
      searchParams.get("token") === null &&
      searchParams.get("email") === null
    ) {
      window.location.href = "/";
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const resetToken = searchParams.get("token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            token: resetToken,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successfully.");
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("resetToken");
        router.push("/login");
      } else {
        toast.error(data.message || "Password reset failed.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
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
        <Label htmlFor="password" className="text-white">
          New password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-[var(--site-border)] bg-[var(--site-panel)] pl-10 pr-10 text-white placeholder:text-[var(--site-muted)]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-white">
          Confirm password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="border-[var(--site-border)] bg-[var(--site-panel)] pl-10 pr-10 text-white placeholder:text-[var(--site-muted)]"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-400"
            aria-label={
              showConfirmPassword
                ? "Hide password confirmation"
                : "Show password confirmation"
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[var(--site-button-bg)] text-[var(--site-button-text)] hover:bg-white"
        disabled={isLoading}
      >
        {isLoading ? "Resetting password..." : "Reset password"}
      </Button>

      <div className="text-center text-sm text-[var(--site-muted)]">
        Back to{" "}
        <a href="/login" className="text-white hover:text-[var(--site-accent)]">
          login
        </a>
      </div>
    </form>
  );
}
