"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { registerUser } from "@/app/actions/auth";
import { toast } from "sonner";

export function RegisterForm() {
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firstChecked, setFirstChecked] = useState(false);
  const [secondChecked, setSecondChecked] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setAgreedToTerms(firstChecked && secondChecked);
  }, [firstChecked, secondChecked]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!agreedToTerms) {
      toast.error("You must accept the terms to continue.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerUser({
        name,
        email,
        password,
        phoneNumber,
      });

      if (result.success) {
        sessionStorage.setItem("registerEmail", email);
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(result.message);
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
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            id="username"
            placeholder="Enter your username"
            value={name}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border-[var(--site-border)] bg-[var(--site-panel)] pl-10 text-white placeholder:text-[var(--site-muted)]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
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
        <Label htmlFor="phone">Phone number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhone(e.target.value)}
            className="border-[var(--site-border)] bg-[var(--site-panel)] pl-10 text-white placeholder:text-[var(--site-muted)]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="border-[var(--site-border)] bg-[var(--site-panel)] pl-10 pr-10 text-white placeholder:text-[var(--site-muted)]"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-400"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={firstChecked}
            onCheckedChange={(checked) => setFirstChecked(checked as boolean)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none text-[var(--site-muted)] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <Link href="/report" className="text-white hover:text-[var(--site-accent)]">
              Terms &amp; Conditions
            </Link>
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="privacy"
            checked={secondChecked}
            onCheckedChange={(checked) => setSecondChecked(checked as boolean)}
          />
          <label
            htmlFor="privacy"
            className="text-sm font-medium leading-none text-[var(--site-muted)] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I have read and accept the{" "}
            <Link
              href="/refund-policies"
              className="text-white hover:text-[var(--site-accent)]"
            >
              Privacy Policy
            </Link>
            .
          </label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[var(--site-button-bg)] text-[var(--site-button-text)] hover:bg-white"
        disabled={isLoading || !agreedToTerms}
      >
        {isLoading ? "Creating account..." : "Create account"}
      </Button>

      <div className="text-center text-sm text-[var(--site-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="text-white hover:text-[var(--site-accent)]">
          Sign in
        </Link>
      </div>
    </form>
  );
}
