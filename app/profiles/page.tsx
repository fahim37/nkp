"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { User, Lock, Calendar, Bell, LogOut } from "lucide-react";
import PersonalInfoForm from "@/components/personal-info-form";
import BookingHistoryTable from "@/components/booking-history-table";
import NotifyMeList from "@/components/notify-me-list";
import { PageHeader } from "@/Shared/PageHeader";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import ProfileChangepassword from "@/components/profileChangepassword";
import { DialogOverlay } from "@radix-ui/react-dialog";
import Link from "next/link";

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
  cityState?: string;
  roadArea?: string;
  avatar?: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("personal-info");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session, update } = useSession();

  const userId = session?.user?.id;
  const accessToken = session?.user?.accessToken;

  const fetchUserData = async () => {
    if (!userId) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/single-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await res.json();
      setUserData(data.data || data.user || data);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load user data");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId, accessToken]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a JPEG, PNG, or WebP image");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile images must be smaller than 2 MB.");
      return;
    }

    try {
      setIsUploading(true);
      if (!userId || !accessToken) {
        throw new Error("Invalid user session");
      }

      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("userId", userId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/update-profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        throw new Error(text.includes("<html") ? "Server error" : text);
      }

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Profile update failed");
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          avatar: data.avatarUrl || data.imageUrl || data.url,
        },
      });

      await fetchUserData();
      toast.success("Profile image updated");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const avatar = userData?.avatar || "";
  const name = userData?.name || "N/A";
  const email = userData?.email || "N/A";

  const navBase =
    "flex w-full items-center rounded-xl p-3 text-left text-[var(--site-muted-strong)] transition-colors";
  const navActive = "bg-[var(--site-panel-strong)]";
  const navIdle = "hover:bg-[var(--site-panel)]";

  return (
    <div>
      <PageHeader title="My Profile" imge="/assets/profile1.jpg" />
      <div className="container flex min-h-screen flex-col pt-[80px] text-[var(--site-muted-strong)] md:flex-row">
        <div className="flex w-full flex-col items-center p-6 md:sticky md:top-0 md:h-screen md:w-80">
          <div className="mb-8 flex flex-col items-center">
            <div className="group relative mb-2 h-32 w-32">
              <div
                className="relative h-full w-full cursor-pointer overflow-hidden rounded-full border border-[var(--site-border)]"
                onClick={handleImageClick}
              >
                <Image
                  src={avatar || "/placeholder.png"}
                  alt=""
                  fill
                  className="scale-[102%] object-cover"
                  priority
                />

                {!avatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/35 text-center text-[12px] transition-opacity group-hover:opacity-100">
                    Upload profile image
                    <div>(max. 2 MB)</div>
                  </div>
                )}
              </div>

              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
                disabled={isUploading}
              />
            </div>

            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-sm text-[var(--site-muted)]">{email}</p>
          </div>

          <nav className="w-full space-y-2">
            <button
              onClick={() => setActiveTab("personal-info")}
              className={`${navBase} ${
                activeTab === "personal-info" ? navActive : navIdle
              }`}
            >
              <User className="mr-3 h-5 w-5" />
              <span>Personal Information</span>
            </button>
            <button
              onClick={() => setActiveTab("change-password")}
              className={`${navBase} ${
                activeTab === "change-password" ? navActive : navIdle
              }`}
            >
              <Lock className="mr-3 h-5 w-5" />
              <span>Change Password</span>
            </button>
            <button
              onClick={() => setActiveTab("booking-history")}
              className={`${navBase} ${
                activeTab === "booking-history" ? navActive : navIdle
              }`}
            >
              <Calendar className="mr-3 h-5 w-5" />
              <span>Booking History</span>
            </button>
            <button
              onClick={() => setActiveTab("notify-me")}
              className={`${navBase} ${
                activeTab === "notify-me" ? navActive : navIdle
              }`}
            >
              <Bell className="mr-3 h-5 w-5" />
              <span>Alert List</span>
            </button>
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="mt-auto flex w-full items-center rounded-xl p-3 text-left text-red-300 transition-colors hover:bg-[var(--site-panel)]"
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Log out</span>
            </button>
          </nav>
        </div>

        <div className="container flex-1 p-6 md:p-10">
          {activeTab === "personal-info" && userData && (
            <PersonalInfoForm
              initialData={{
                name: userData.name || "",
                email: userData.email || "",
                phoneNumber: userData.phoneNumber || "",
                country: userData.country || "",
                cityState: userData.cityState || "",
                roadArea: userData.roadArea || "",
              }}
            />
          )}
          {activeTab === "change-password" && <ProfileChangepassword />}
          {activeTab === "booking-history" && <BookingHistoryTable />}
          {activeTab === "notify-me" && <NotifyMeList />}
        </div>
      </div>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/50" />
        <DialogContent className="fixed left-1/2 top-1/2 z-50 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--site-border)] bg-[var(--site-panel)] p-5 text-[var(--site-muted-strong)] backdrop-blur-lg focus:outline-none sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-4">
            <div>
              <Link href="/">
                <div className="py-1">
                  <div className="flex justify-center">
                    <Image
                      src="/assets/logo-icon.png"
                      alt="Logo"
                      width={1000}
                      height={1000}
                      className="h-[37px] w-[95px]"
                    />
                  </div>
                  <h1 className="mt-[7px] text-[32px] font-benedict font-normal leading-[120%] text-white [text-shadow:_0_0_1px_#fff,_0_0_15px_#fff,_0_0_15px_#fff]">
                    Walk Throughz
                  </h1>
                </div>
              </Link>
            </div>
            <DialogTitle className="text-center text-[16px] font-normal">
              Do you really want to sign out?
            </DialogTitle>
            <div className="mt-6 flex w-full gap-4">
              <button
                onClick={() => {
                  localStorage.clear();
                  signOut({ callbackUrl: "/login" });
                }}
                className="flex-1 rounded-lg bg-[var(--site-button-bg)] p-2 text-[14px] text-[var(--site-button-text)] transition-opacity duration-200 hover:opacity-90"
              >
                Yes
              </button>

              <button
                onClick={() => setShowLogoutDialog(false)}
                className="flex-1 rounded-lg border border-[var(--site-border)] bg-[var(--site-surface)] p-2 text-[14px] text-[var(--site-muted-strong)] transition-colors duration-200 hover:bg-[var(--site-panel-strong)]"
              >
                No
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
