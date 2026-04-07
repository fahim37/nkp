"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOpenDialog(true);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Unable to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-lg space-y-4 rounded-lg bg-[var(--site-surface)] px-[24px] py-[32px]"
      >
        <div className="space-y-1 text-center">
          <h1 className="text-[26px] font-semibold leading-[120%] text-white lg:text-[32px]">
            Request reset link
          </h1>
          <p className="text-[14px] text-[var(--site-muted)] lg:text-[16px]">
            Enter your email to receive a password reset link.
          </p>
        </div>

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

        <Button
          type="submit"
          className="w-full bg-[var(--site-button-bg)] text-[var(--site-button-text)] hover:bg-white"
          disabled={isLoading}
        >
          {isLoading ? "Sending link..." : "Reset password"}
        </Button>
      </form>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-lg rounded-xl border border-[var(--site-border)] bg-[var(--site-surface)] text-white shadow-xl">
          <DialogHeader className="flex flex-col items-center space-y-3">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-[var(--site-border)] bg-[var(--site-bg)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <DialogTitle className="text-xl font-semibold text-white">
              Check your inbox
            </DialogTitle>
            <DialogDescription className="text-center text-[var(--site-muted)]">
              We sent a password reset link to{" "}
              <span className="font-semibold text-white">{email}</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            <Button
              onClick={() => {
                setOpenDialog(false);
                router.push("/login");
              }}
              className="bg-[var(--site-button-bg)] text-[var(--site-button-text)] hover:bg-white"
            >
              Back to login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
