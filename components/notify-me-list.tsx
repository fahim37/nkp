"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { DealsCard } from "./deals-card";
import { toast } from "sonner";

interface Booking {
  participationsLimit: number | undefined;
  participations: number;
  price: number;
  description: string;
  images: string[];
  title: string;
  status: string | undefined;
  _id: string;
  dealsId: {
    images: string[];
    participationsLimit: number | undefined;
    _id: string;
    title: string;
    description: string;
    price: number;
    participations: number;
    maxParticipants: number;
    image: string;
    status: string;
  };
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function NotifyMeList() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session?.user?.id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/notify-true?user=${session.user.id}&page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch alerts");
        }

        const data = await response.json();

        if (data.success) {
          setBookings(data.data);
          setPagination(data.pagination);
        } else {
          throw new Error(data.message || "Failed to fetch alerts");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [session, page, limit, token]);

  const handlePageChange = (newPage: number) => {
    router.push(`?page=${newPage}&limit=${limit}`);
  };

  const handleRemoveNotification = async (bookingId: string) => {
    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove alert");
      }

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );

      toast.success("Alert removed");
    } catch (error) {
      console.error("Error removing notification:", error);
      toast.error("Failed to remove alert");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold text-[var(--site-muted-strong)]">
        Alert List
      </h1>

      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--site-accent)]" />
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-300">
          <p>{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-8 text-center text-[var(--site-muted)]">
          <p>No alerts found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            {bookings.map((booking) => (
              <DealsCard
                key={booking.dealsId?._id}
                id={booking?.dealsId?._id}
                status={booking.dealsId?.status}
                title={booking.dealsId?.title}
                image={booking.dealsId?.images?.[0] || "/assets/deals.png"}
                description={booking.dealsId?.description}
                price={booking.dealsId?.price}
                participations={booking.dealsId?.participations}
                maxParticipants={booking.dealsId?.maxParticipants}
                showRemoveNotification={true}
                bookingId={booking._id}
                onRemoveNotification={handleRemoveNotification}
              />
            ))}
          </div>

          {pagination.totalPages > 0 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="border-[var(--site-border)] bg-[var(--site-panel)] text-[var(--site-muted-strong)] hover:bg-[var(--site-panel-strong)] hover:text-[var(--site-muted-strong)]"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((pageNumber) => (
                <Button
                  key={pageNumber}
                  variant={
                    pageNumber === pagination.currentPage ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                  className="min-w-[40px] border-[var(--site-border)] bg-[var(--site-panel)] text-[var(--site-muted-strong)] hover:bg-[var(--site-panel-strong)] hover:text-[var(--site-muted-strong)]"
                >
                  {pageNumber}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="border-[var(--site-border)] bg-[var(--site-panel)] text-[var(--site-muted-strong)] hover:bg-[var(--site-panel-strong)] hover:text-[var(--site-muted-strong)]"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
