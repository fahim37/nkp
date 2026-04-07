"use client";

import { useState, useMemo } from "react";
import { Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface Location {
  country: string;
  city: string;
}

interface ScheduleDate {
  _id: string;
  active: boolean;
  bookedCount: number;
  date: string;
  participationsLimit: number;
}

interface Deal {
  _id: string;
  title: string;
  price: number;
  description: string;
  location: Location;
  status: string;
  offers: string[];
  participations: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  scheduleDates: ScheduleDate[];
  category?: string;
  time?: number;
  timer?: string;
  __v?: number;
}

type PaymentStatus = "complete" | "pending" | "failed";

interface Booking {
  _id: string;
  bookingId: string;
  dealsId: Deal;
  isBooked: boolean;
  notifyMe: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  price?: number;
  scheduleDate?: string;
  quantity?: number;
  paymentStatus?: PaymentStatus;
  __v?: number;
}

interface ApiResponse {
  success: boolean;
  data: Booking[];
}

interface SingleBookingResponse {
  success: boolean;
  data: Booking;
}

export default function BookingHistoryTable() {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken as string | undefined;
  const userId = session?.user?.id as string | undefined;

  const fetchBookings = async (): Promise<ApiResponse> => {
    if (!userId || !accessToken) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/notify-false?user=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    return response.json();
  };

  const fetchBookingById = async (
    id: string
  ): Promise<SingleBookingResponse> => {
    if (!accessToken) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch booking details");
    }
    return response.json();
  };

  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["bookings", userId],
    queryFn: fetchBookings,
    enabled: !!userId && !!accessToken,
  });

  const completedBookings = useMemo(
    () =>
      data?.data.filter((b) => (b.paymentStatus ?? "pending") === "complete") ??
      [],
    [data?.data]
  );

  const {
    data: bookingDetails,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = useQuery<SingleBookingResponse>({
    queryKey: ["booking", selectedBookingId],
    queryFn: () => fetchBookingById(selectedBookingId!),
    enabled: !!selectedBookingId && isModalOpen && !!accessToken,
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMM, yyyy");
  };

  const formatPrice = (price: number | undefined) => {
    if (typeof price !== "number") return "EUR 0.00";
    return `EUR ${price.toFixed(2)}`;
  };

  const handleViewClick = (id: string) => {
    setSelectedBookingId(id);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-full px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-semibold text-[var(--site-muted-strong)]">
          Booking History
        </h2>
        <div className="overflow-hidden rounded-2xl bg-[var(--site-panel)]/70">
          <div className="min-w-full overflow-x-auto">
            <div className="grid grid-cols-5 bg-[var(--site-panel-strong)] py-3 px-4">
              <div className="text-sm font-medium text-[var(--site-muted)]">
                Walk Through
              </div>
              <div className="text-sm font-medium text-[var(--site-muted)]">
                Booking Code
              </div>
              <div className="text-sm font-medium text-[var(--site-muted)]">
                Date
              </div>
              <div className="text-sm font-medium text-[var(--site-muted)]">
                Price
              </div>
              <div className="text-sm font-medium text-[var(--site-muted)]">
                Details
              </div>
            </div>
            <div className="divide-y divide-[var(--site-border)]">
              {Array(8)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="grid grid-cols-5 py-3 px-4">
                    <Skeleton className="h-4 w-32 bg-[var(--site-surface)]" />
                    <Skeleton className="h-4 w-16 bg-[var(--site-surface)]" />
                    <Skeleton className="h-4 w-24 bg-[var(--site-surface)]" />
                    <Skeleton className="h-4 w-16 bg-[var(--site-surface)]" />
                    <Skeleton className="h-5 w-5 rounded-full bg-[var(--site-surface)]" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className="mx-auto max-w-full px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-semibold text-[var(--site-muted-strong)]">
          Booking History
        </h2>
        <div className="rounded-md border border-red-800 bg-red-900/20 p-4">
          <p className="text-red-300">Unable to load bookings: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-full px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-2xl font-semibold text-[var(--site-muted-strong)]">
        Booking History
      </h2>

      {completedBookings.length === 0 ? (
        <div className="rounded-2xl bg-[var(--site-panel)]/70 p-6 text-center text-[var(--site-muted)]">
          No completed bookings yet.
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl bg-[var(--site-panel)]/70 sm:block">
            <div className="min-w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--site-border)]">
                <thead>
                  <tr className="bg-[var(--site-panel-strong)]">
                    <th className="py-3 px-4 text-left text-sm font-medium text-[var(--site-muted)]">
                      Walk Through
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-[var(--site-muted)]">
                      Booking Code
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-[var(--site-muted)]">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-[var(--site-muted)]">
                      Price
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-[var(--site-muted)]">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--site-border)]">
                  {completedBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="py-3 px-4 text-sm text-[var(--site-muted-strong)]">
                        {booking?.dealsId?.title}
                      </td>
                      <td className="py-3 px-4 text-sm text-[var(--site-muted-strong)]">
                        #{booking?.bookingId?.slice(-4)}
                      </td>
                      <td className="py-3 px-4 text-sm text-[var(--site-muted-strong)]">
                        {formatDate(booking?.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-sm text-[var(--site-muted-strong)]">
                        {formatPrice(
                          (booking?.dealsId?.price ?? 0) *
                            (booking?.quantity ?? 1)
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-[var(--site-muted-strong)]">
                        <button
                          className="text-[var(--site-muted-strong)] transition-colors hover:text-[var(--site-accent-strong)]"
                          onClick={() => handleViewClick(booking._id)}
                          aria-label="View details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 sm:hidden">
            {completedBookings.map((booking) => (
              <div
                key={booking._id}
                className="space-y-2 rounded-2xl bg-[var(--site-panel)]/70 p-4"
              >
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--site-muted)]">
                    Walk Through
                  </span>
                  <span className="text-sm text-[var(--site-muted-strong)]">
                    {booking?.dealsId?.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--site-muted)]">
                    Booking Code
                  </span>
                  <span className="text-sm text-[var(--site-muted-strong)]">
                    #{booking?.bookingId?.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--site-muted)]">Date</span>
                  <span className="text-sm text-[var(--site-muted-strong)]">
                    {formatDate(booking?.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--site-muted)]">Price</span>
                  <span className="text-sm text-[var(--site-muted-strong)]">
                    {formatPrice(
                      (booking?.dealsId?.price ?? 0) * (booking?.quantity ?? 1)
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--site-muted)]">
                    Details
                  </span>
                  <button
                    className="text-[var(--site-muted-strong)] transition-colors hover:text-[var(--site-accent-strong)]"
                    onClick={() => handleViewClick(booking._id)}
                    aria-label="View details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-[var(--site-border)] bg-[var(--site-bg)] text-[var(--site-muted-strong)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Booking Details
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--site-accent)] disabled:pointer-events-none">
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="space-y-4 p-4">
              <Skeleton className="h-6 w-3/4 bg-[var(--site-surface)]" />
              <Skeleton className="h-4 w-1/2 bg-[var(--site-surface)]" />
              <Skeleton className="h-20 w-full bg-[var(--site-surface)]" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-4 w-full bg-[var(--site-surface)]" />
                <Skeleton className="h-4 w-full bg-[var(--site-surface)]" />
                <Skeleton className="h-4 w-full bg-[var(--site-surface)]" />
                <Skeleton className="h-4 w-full bg-[var(--site-surface)]" />
              </div>
            </div>
          ) : detailsError instanceof Error ? (
            <div className="rounded-md border border-red-800 bg-red-900/20 p-4">
              <p className="text-red-300">
                Unable to load booking details: {detailsError.message}
              </p>
            </div>
          ) : bookingDetails ? (
            <div className="space-y-6 p-2">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  {bookingDetails?.data?.dealsId?.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-[var(--site-border)] bg-[var(--site-surface)] text-[var(--site-muted-strong)]"
                  >
                    #{bookingDetails?.data?.bookingId?.slice(-4)}
                  </Badge>
                  <Badge
                    variant={
                      bookingDetails?.data?.isBooked ? "default" : "secondary"
                    }
                    className={
                      bookingDetails?.data?.isBooked
                        ? "bg-emerald-600 text-white"
                        : "bg-[var(--site-panel-strong)] text-[var(--site-muted-strong)]"
                    }
                  >
                    {bookingDetails.data.isBooked ? "Booked" : "Pending"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-medium text-[var(--site-muted)]">
                  Description
                </h4>
                <div
                  className="list-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      bookingDetails?.data?.dealsId?.description ??
                      "No description available",
                  }}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-[var(--site-muted)]">
                    Price
                  </h4>
                  <p className="text-sm font-semibold">
                    {formatPrice(
                      (bookingDetails?.data?.dealsId?.price ?? 0) *
                        (bookingDetails?.data?.quantity ?? 1)
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-[var(--site-muted)]">
                    Location
                  </h4>
                  <p className="text-sm">
                    {bookingDetails?.data?.dealsId?.location
                      ? `${bookingDetails.data.dealsId.location.city}, ${bookingDetails.data.dealsId.location.country}`
                      : "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-[var(--site-muted)]">
                    Booking Date
                  </h4>
                  <p className="text-sm">
                    {formatDate(bookingDetails?.data?.createdAt)}
                  </p>
                </div>
              </div>

              {bookingDetails?.data?.dealsId?.offers?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-[var(--site-muted)]">
                    Offers
                  </h4>
                  <div className="rounded-md bg-[var(--site-surface)] p-3">
                    <ul className="list-inside list-disc space-y-1">
                      {(() => {
                        try {
                          const raw = bookingDetails?.data?.dealsId.offers[0];
                          const parsedOffers =
                            typeof raw === "string" ? JSON.parse(raw) : raw;
                          return Array.isArray(parsedOffers) ? (
                            parsedOffers.map((offer, index) => (
                              <li key={index} className="text-sm">
                                {offer}
                              </li>
                            ))
                          ) : (
                            <li className="text-sm">
                              {bookingDetails.data.dealsId.offers[0] as string}
                            </li>
                          );
                        } catch {
                          return (
                            <li className="text-sm">
                              {bookingDetails?.data?.dealsId?.offers?.[0]}
                            </li>
                          );
                        }
                      })()}
                    </ul>
                  </div>
                </div>
              )}

              {bookingDetails?.data?.dealsId?.images?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-[var(--site-muted)]">
                    Images
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {bookingDetails.data.dealsId.images.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        width={300}
                        height={300}
                        alt={`Deal image ${index + 1}`}
                        className="h-32 w-full rounded-md object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border-[var(--site-border)] bg-[var(--site-button-bg)] text-[var(--site-button-text)] hover:opacity-90"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
