"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

function ProfileChangepassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken;
  const userId = session?.user?.id;

  const inputClass =
    "border-[var(--site-border)] bg-[var(--site-surface)] pl-10 pr-10 text-[var(--site-muted-strong)] placeholder:text-[var(--site-muted)]";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Your session is invalid. Please sign in again.");
      return;
    }

    setIsLoading(true);

    try {
      if (newPassword !== confirmPassword) {
        throw new Error("The new passwords do not match.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId,
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password could not be changed");
      }

      if (!data.success) {
        throw new Error("Password change failed");
      }

      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password change error:", error);

      if (error instanceof Error) {
        if (error.message.includes("Benutzer nicht gefunden")) {
          toast.error("Your session appears invalid. Please sign out and in again.");
        } else if (error.message.includes("current password")) {
          toast.error("The current password you entered is incorrect.");
        } else {
          toast.error(error.message || "Password could not be changed");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-[var(--site-muted)]" />
          <Input
            id="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-3 text-[var(--site-muted)]"
          >
            {showCurrentPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-[var(--site-muted)]" />
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-3 text-[var(--site-muted)]"
          >
            {showNewPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-[var(--site-muted)]" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-[var(--site-muted)]"
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
        className="w-full bg-[var(--site-button-bg)] text-[var(--site-button-text)] hover:opacity-90"
        disabled={
          isLoading || !currentPassword || !newPassword || !confirmPassword
        }
      >
        {isLoading ? "Updating password..." : "Update password"}
      </Button>
    </form>
  );
}

export default ProfileChangepassword;
