"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface PersonalInfoData {
  name: string;
  email: string;
  phoneNumber: string;
  country?: string;
  cityState?: string;
  roadArea?: string;
}

export default function PersonalInfoForm({
  initialData,
}: {
  initialData: PersonalInfoData;
}) {
  const { data: session, update: updateSession } = useSession();
  const [formData, setFormData] = useState<PersonalInfoData>({
    name: initialData.name || "",
    email: initialData.email || "",
    phoneNumber: initialData.phoneNumber || "",
    country: initialData.country || "",
    cityState: initialData.cityState || "",
    roadArea: initialData.roadArea || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast.error("Authentication required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              (session?.user as { accessToken?: string })?.accessToken || ""
            }`,
          },
          body: JSON.stringify({
            userId: session.user.id,
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            ...(formData.country && { country: formData.country }),
            ...(formData.cityState && { cityState: formData.cityState }),
            ...(formData.roadArea && { roadArea: formData.roadArea }),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile could not be updated");
      }

      toast.success("Profile updated");

      await updateSession({
        ...session,
        user: {
          ...session.user,
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          country: formData.country,
          cityState: formData.cityState,
          roadArea: formData.roadArea,
        },
      });

      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Profile could not be updated"
      );
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phoneNumber: initialData.phoneNumber || "",
        country: initialData.country || "",
        cityState: initialData.cityState || "",
        roadArea: initialData.roadArea || "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "border-[var(--site-border)] bg-[var(--site-surface)] text-[var(--site-muted-strong)] placeholder:text-[var(--site-muted)]";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-[var(--site-muted-strong)] md:text-2xl">
          Personal Information
        </h1>
        {!isEditing && (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="bg-[var(--site-button-bg)] text-sm text-[var(--site-button-text)] hover:opacity-90"
            disabled={!session}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm text-[var(--site-muted-strong)]">
              Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name || ""}
              onChange={handleChange}
              disabled={!isEditing || !session}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm text-[var(--site-muted-strong)]">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email || ""}
              onChange={handleChange}
              disabled={true}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phoneNumber"
              className="block text-sm text-[var(--site-muted-strong)]"
            >
              Mobile Number
            </label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter your mobile number"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              disabled={!isEditing || !session}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="country" className="block text-sm text-[var(--site-muted-strong)]">
              Country
            </label>
            <Input
              id="country"
              name="country"
              value={formData.country || ""}
              onChange={handleChange}
              disabled={!isEditing || !session}
              className={inputClass}
              placeholder="Enter your country"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cityState" className="block text-sm text-[var(--site-muted-strong)]">
              City
            </label>
            <Input
              id="cityState"
              name="cityState"
              value={formData.cityState || ""}
              onChange={handleChange}
              disabled={!isEditing || !session}
              className={inputClass}
              placeholder="Enter your city"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  name: initialData.name || "",
                  email: initialData.email || "",
                  phoneNumber: initialData.phoneNumber || "",
                  country: initialData.country || "",
                  cityState: initialData.cityState || "",
                  roadArea: initialData.roadArea || "",
                });
                setIsEditing(false);
              }}
              className="border-[var(--site-border)] bg-[var(--site-surface)] text-[var(--site-muted-strong)] hover:bg-[var(--site-panel-strong)]"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[var(--site-button-bg)] text-[var(--site-button-text)] hover:opacity-90"
              disabled={isLoading || !session}
            >
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
