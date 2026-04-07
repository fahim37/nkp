"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSocketContext } from "@/Provider/SocketProvider";
import type {
  Notification as SocketNotification,
  Deal as SocketDeal,
} from "@/Provider/SocketProvider";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  BellRing,
  Clock,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";

function normalizeLocation(loc: unknown): string | undefined {
  if (!loc) return undefined;
  if (typeof loc === "string") return loc.trim() || undefined;
  if (typeof loc === "object" && loc !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const country = (loc as any)?.country?.trim?.() ?? "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const city = (loc as any)?.city?.trim?.() ?? "";
    const combined = [city, country].filter(Boolean).join(", ");
    return combined || undefined;
  }
  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeDeal(raw: any): SocketDeal {
  return {
    _id: String(raw?._id ?? ""),
    title: String(raw?.title ?? ""),
    description: String(raw?.description ?? ""),
    participationsLimit: Number(raw?.participationsLimit ?? 0),
    price: Number(raw?.price ?? 0),
    location: normalizeLocation(raw?.location),
    images: Array.isArray(raw?.images) ? raw.images.map(String) : undefined,
    offers: Array.isArray(raw?.offers) ? raw.offers.map(String) : undefined,
    status: raw?.status ? String(raw.status) : undefined,
    category: raw?.category,
    time: typeof raw?.time === "number" ? raw.time : undefined,
    createdAt: raw?.createdAt ? String(raw.createdAt) : undefined,
    updatedAt: raw?.updatedAt ? String(raw.updatedAt) : undefined,
    __v: typeof raw?.__v === "number" ? raw.__v : undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeNotification(raw: any): SocketNotification {
  let dealId: SocketNotification["dealId"] = undefined;

  if (raw?.dealId && typeof raw.dealId === "object") {
    dealId = normalizeDeal(raw.dealId);
  } else if (typeof raw?.dealId === "string") {
    dealId = raw.dealId;
  }

  return {
    _id: String(raw?._id ?? ""),
    message: String(raw?.message ?? ""),
    createdAt: String(raw?.createdAt ?? new Date().toISOString()),
    updatedAt: String(raw?.updatedAt ?? new Date().toISOString()),
    userId: String(raw?.userId ?? ""),
    isRead: Boolean(raw?.isRead),
    type: String(raw?.type ?? ""),
    dealId,
    auction: raw?.auction
      ? { title: String(raw.auction?.title ?? "") }
      : undefined,
  };
}

const Notifications = () => {
  const { notifications, setNotifications, setNotificationCount, socket } =
    useSocketContext();
  const session = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.data as any)?.user?.id as string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = (session?.data as any)?.user?.accessToken as string | undefined;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingAsRead, setMarkingAsRead] = useState(false);
  const [markingIndividual, setMarkingIndividual] = useState<string | null>(
    null
  );

  const sortedNotifications = useMemo(
    () =>
      [...notifications].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [notifications]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedNotifications.length / itemsPerPage) || 1;
  const paginatedNotifications = sortedNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const markNotificationsAsRead = async () => {
    if (!token || markingAsRead) return;

    setMarkingAsRead(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/read-all?userId=${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      setNotifications((prev) => {
        const next = prev.map((n) => ({ ...n, isRead: true }));
        setNotificationCount(0);
        return next;
      });

      localStorage.removeItem("notificationCount");
      toast.success("All notifications marked as read.");
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
      toast.error("Notifications could not be marked as read.");
    } finally {
      setMarkingAsRead(false);
    }
  };

  const markSingleNotificationAsRead = async (notificationId: string) => {
    if (!token || markingIndividual === notificationId) return;

    setMarkingIndividual(notificationId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      setNotifications((prev) => {
        const next = prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        );
        const unread = next.filter((n) => !n.isRead).length;
        setNotificationCount(unread);
        return next;
      });

      if (socket) socket.emit("mark_notification_read", notificationId);
      toast.success("Notification marked as read.");
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      toast.error("The notification could not be updated.");
    } finally {
      setMarkingIndividual(null);
    }
  };

  useEffect(() => {
    const fetchInitialNotifications = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/notifications?userId=${userId}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data?.notifications)) {
          const normalized: SocketNotification[] =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (data.notifications as any[]).map(normalizeNotification);

          setNotifications(normalized);
          setNotificationCount(normalized.filter((n) => !n.isRead).length);
        } else {
          const msg = data?.message || "Failed to fetch notifications";
          setError(msg);
          toast.error(msg);
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(msg);
        toast.error("Notifications could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialNotifications();
  }, [userId, token, setNotifications, setNotificationCount]);

  const formatNotificationTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hr ago`;
      if (diffInMinutes < 10080) {
        const days = Math.floor(diffInMinutes / 1440);
        return `${days} day${days === 1 ? "" : "s"} ago`;
      }

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    } catch {
      return "Unknown date";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "deal_status_change":
        return <Clock className="h-4 w-4 text-[var(--site-muted-strong)]" />;
      case "new_deal":
        return <BellRing className="h-4 w-4 text-[var(--site-muted-strong)]" />;
      default:
        return <BellRing className="h-4 w-4 text-[var(--site-muted-strong)]" />;
    }
  };

  const getDealTitle = (notification: SocketNotification) => {
    if (!notification.dealId) return "";
    if (typeof notification.dealId === "string") {
      return `Deal ID: ${notification.dealId}`;
    }
    return notification.dealId.title || "";
  };

  const getDealId = (notification: SocketNotification) => {
    if (!notification.dealId) return "";
    if (typeof notification.dealId === "string") return notification.dealId;
    return notification.dealId._id || "";
  };

  const getDealLocation = (notification: SocketNotification) => {
    if (!notification.dealId || typeof notification.dealId === "string") {
      return "";
    }
    return notification.dealId.location ?? "";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="border-[var(--site-border)] bg-[var(--site-panel)]">
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <Skeleton className="h-4 w-4 rounded-full bg-[var(--site-surface)]" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-[var(--site-surface)]" />
                    <Skeleton className="h-3 w-1/2 bg-[var(--site-surface)]" />
                  </div>
                  <Skeleton className="h-3 w-16 bg-[var(--site-surface)]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Card className="border-[var(--site-border)] bg-[var(--site-panel)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[var(--site-muted-strong)]">
              <BellRing className="h-5 w-5" />
              Error loading notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-[var(--site-muted)]">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-[var(--site-border)] text-[var(--site-muted-strong)] hover:bg-[var(--site-panel-strong)]"
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-[var(--site-border)] bg-[var(--site-panel)]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between py-5">
            <div className="flex items-center justify-center gap-3 text-[var(--site-muted-strong)]">
              <BellRing className="h-5 w-5" />
              Notifications
            </div>
            <div className="flex items-center gap-2">
              {sortedNotifications.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markNotificationsAsRead}
                  disabled={markingAsRead}
                  className="border-[var(--site-border)] text-[var(--site-muted-strong)] hover:bg-[var(--site-panel-strong)]"
                >
                  {markingAsRead ? "Updating..." : "Mark all as read"}
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedNotifications.length === 0 ? (
            <div className="py-8 text-center">
              <BellRing className="mx-auto mb-4 h-12 w-12 text-[var(--site-muted)]" />
              <h3 className="mb-2 text-lg font-medium text-[var(--site-muted-strong)]">
                No notifications yet
              </h3>
              <p className="text-[var(--site-muted)]">
                Your notifications will appear here as soon as they arrive.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedNotifications.map((notification) => {
                const dealId = getDealId(notification);
                const dealTitle = getDealTitle(notification);
                const dealLocation = getDealLocation(notification);

                return (
                  <div
                    key={notification._id}
                    className={`flex items-start space-x-4 rounded-xl border p-4 transition-colors ${
                      notification.isRead
                        ? "border-[var(--site-border)] bg-[var(--site-surface)] text-[var(--site-muted)] hover:bg-[var(--site-panel-strong)]/70"
                        : "border-[var(--site-border)] border-l-[10px] border-l-[var(--site-accent)] bg-[var(--site-surface)] text-[var(--site-muted-strong)] hover:bg-[var(--site-panel-strong)]/70"
                    }`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="min-w-0 flex-1">
                      {dealId ? (
                        <Link
                          href={`/deals/${dealId}`}
                          onClick={() =>
                            !notification.isRead &&
                            markSingleNotificationAsRead(notification._id)
                          }
                          className="block cursor-pointer"
                        >
                          <p
                            className={`mb-1 text-sm ${
                              notification.isRead
                                ? "font-normal text-[var(--site-muted)]"
                                : "font-medium text-[var(--site-muted-strong)]"
                            }`}
                          >
                            {notification.message}
                          </p>

                          {dealTitle && !dealTitle.startsWith("Deal ID:") && (
                            <p
                              className={`mb-1 text-sm font-semibold ${
                                notification.isRead
                                  ? "text-[var(--site-muted)]"
                                  : "text-[var(--site-muted-strong)]"
                              }`}
                            >
                              {dealTitle}
                            </p>
                          )}

                          <div className="mb-1 flex items-center gap-2">
                            {dealLocation && (
                              <span className="flex items-center gap-1 text-xs text-[var(--site-muted)]">
                                <MapPin className="h-4 w-4" /> {dealLocation}
                              </span>
                            )}
                          </div>

                          {notification.auction && (
                            <p className="mb-2 text-sm text-[var(--site-muted)]">
                              Linked to: {notification.auction.title}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <p className="text-xs text-[var(--site-muted)]">
                              {formatNotificationTime(notification.createdAt)}
                            </p>

                            {!notification.isRead &&
                              markingIndividual === notification._id && (
                                <span className="text-xs text-[var(--site-muted)]">
                                  Marking as read...
                                </span>
                              )}
                          </div>
                        </Link>
                      ) : (
                        <div
                          onClick={() =>
                            !notification.isRead &&
                            markSingleNotificationAsRead(notification._id)
                          }
                          className="cursor-pointer"
                        >
                          <p
                            className={`mb-1 text-sm ${
                              notification.isRead
                                ? "font-normal text-[var(--site-muted)]"
                                : "font-medium text-[var(--site-muted-strong)]"
                            }`}
                          >
                            {notification.message}
                          </p>

                          {notification.auction && (
                            <p className="mb-2 text-sm text-[var(--site-muted)]">
                              Linked to: {notification.auction.title}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <p className="text-xs text-[var(--site-muted)]">
                              {formatNotificationTime(notification.createdAt)}
                            </p>

                            {!notification.isRead &&
                              markingIndividual === notification._id && (
                                <span className="text-xs text-[var(--site-muted)]">
                                  Marking as read...
                                </span>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {sortedNotifications.length > itemsPerPage && (
                <div className="mt-6 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="border-[var(--site-border)] text-[var(--site-muted-strong)] hover:bg-[var(--site-panel-strong)]"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => goToPage(pageNum)}
                          className={`h-10 w-10 p-0 ${
                            currentPage === pageNum
                              ? "bg-[var(--site-button-bg)] text-[var(--site-button-text)]"
                              : "border-[var(--site-border)] text-[var(--site-muted-strong)] hover:bg-[var(--site-panel-strong)]"
                          }`}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="px-2 text-[var(--site-muted)]">...</span>
                    )}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(totalPages)}
                        className="h-10 w-10 border-[var(--site-border)] p-0 text-[var(--site-muted-strong)] hover:bg-[var(--site-panel-strong)]"
                      >
                        {totalPages}
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="border-[var(--site-border)] text-[var(--site-muted-strong)] hover:bg-[var(--site-panel-strong)]"
                  >
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
