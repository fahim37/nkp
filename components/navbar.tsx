"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile-nav";
import { BellRing, Menu, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSocketContext } from "@/Provider/SocketProvider";
import * as React from "react";
import Hideon from "@/Provider/Hideon";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us" },
  { name: "Walk Throughz", href: "/deals" },
  { name: "Blog", href: "/blog" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const isMobile = useMobile();
  const pathname = usePathname();
  const { status, data: sessionData } = useSession();
  const isLoggedIn = status === "authenticated";
  const token = sessionData?.user?.accessToken;
  const role = sessionData?.user?.role;

  const session = useSession();
  const userId = session?.data?.user?.id;

  const { notificationCount, setNotificationCount, isConnected } =
    useSocketContext();

  const markNotificationsAsRead = async () => {
    if (!token) return;
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/read-all?userId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("notificationCount");
      setNotificationCount(0);
    } catch (error) {
      console.error(error);
    }
  };

  const iconLinks = [
    { icon: BellRing, href: "/notifications", count: notificationCount },
    { icon: UserRound, href: "/profiles" },
  ];

  const getIconClasses = (href: string) => `
    relative rounded-full border-2 p-2 transition-colors
    ${
      pathname.startsWith(href)
        ? "border-[var(--site-accent)] bg-[var(--site-surface)]"
        : "border-[var(--site-border)] hover:border-[var(--site-accent)] hover:bg-[var(--site-surface)]"
    }
  `;

  const getIconColor = (href: string) =>
    pathname.startsWith(href)
      ? "text-[var(--site-accent)]"
      : "text-[var(--site-muted-strong)]";

  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  const HIDDEN_ROUTES = [
    "/dashboard",
    "/login",
    "/sign-up",
    "/verify-otp",
    "/registration",
    "/reset-password",
    "/forgot-password",
  ];

  return (
    <Hideon routes={HIDDEN_ROUTES}>
      <header className="sticky top-0 z-50 flex h-[100px] w-full flex-col justify-center border-b border-[var(--site-border)] bg-[var(--site-bg)]/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div>
            <Link href="/">
              <div className="py-1">
                <div className="flex justify-center">
                  <Image
                    src="/assets/logo-icon.png"
                    alt="Logo"
                    width={1000}
                    height={1000}
                    className="h-[30px] w-[80px] lg:h-[37px] lg:w-[95px]"
                  />
                </div>
                <h1 className="logo-size mt-[7px] text-[32px] font-benedict font-normal leading-[120%] text-white [text-shadow:_0_0_1px_#fff,_0_0_15px_#fff,_0_0_15px_#fff]">
                  Walk Throughz
                </h1>
              </div>
            </Link>
          </div>

          {!isMobile && (
            <nav className="hidden md:flex md:gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-[16px] font-medium text-white transition-colors ${
                    isActive(link.href)
                      ? "text-[var(--site-accent)] after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-full after:bg-[var(--site-accent)] after:content-['']"
                      : "after:absolute after:bottom-[-5px] after:left-1/2 after:h-[2px] after:w-0 after:bg-[var(--site-accent)] after:content-[''] hover:text-[var(--site-accent-strong)] hover:after:left-0 hover:after:w-full"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-4">
            {!isLoggedIn && (
              <Link href="/login" className="hidden md:block">
                <Button className="hidden bg-[var(--site-button-bg)] px-6 text-[var(--site-button-text)] hover:bg-white lg:block">
                  Login
                </Button>
              </Link>
            )}

            {role === "admin" && (
              <Link href="/dashboard">
                <Button className="hidden bg-[var(--site-button-bg)] px-6 text-[var(--site-button-text)] hover:bg-white lg:block">
                  Dashboard
                </Button>
              </Link>
            )}

            {isLoggedIn && role === "user" && (
              <div className="hidden items-center gap-2 sm:gap-4 md:flex">
                {iconLinks.map(({ icon: Icon, href }) =>
                  href === "/notifications" ? (
                    <button
                      key={href}
                      onClick={async (e) => {
                        e.preventDefault();
                        await markNotificationsAsRead();
                        router.push(href);
                      }}
                      className={getIconClasses(href)}
                      title={`${
                        isConnected ? "Connected" : "Disconnected"
                      } - ${notificationCount} notifications`}
                    >
                      <Icon className={getIconColor(href)} size={20} />
                      {notificationCount > 0 && (
                        <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">
                          {notificationCount}
                        </span>
                      )}
                    </button>
                  ) : (
                    <Link
                      key={href}
                      href={href}
                      className={getIconClasses(href)}
                    >
                      <Icon className={getIconColor(href)} size={20} />
                    </Link>
                  )
                )}
              </div>
            )}

            {isMobile && (
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5 text-white" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[280px] border-l border-[var(--site-border)] bg-[var(--site-bg)] sm:w-[300px]"
                >
                  <nav className="flex flex-col gap-1 pt-10">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`rounded px-3 py-2 text-base font-medium transition-colors ${
                          isActive(link.href)
                            ? "bg-[var(--site-surface)] font-semibold text-white"
                            : "text-[var(--site-muted)] hover:bg-[var(--site-surface)] hover:text-white"
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}

                    <div className="mx-3 my-2 border-t border-[var(--site-border)]"></div>

                    {!isLoggedIn ? (
                      <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="rounded px-3 py-2 text-base font-medium text-[var(--site-muted)] transition-colors hover:bg-[var(--site-surface)] hover:text-white"
                      >
                        Login
                      </Link>
                    ) : (
                      <>
                        {role === "admin" && (
                          <Link
                            href="/dashboard"
                            onClick={() => setOpen(false)}
                            className="rounded px-3 py-2 text-base font-medium text-[var(--site-muted)] transition-colors hover:bg-[var(--site-surface)] hover:text-white"
                          >
                            Dashboard
                          </Link>
                        )}

                        {role === "user" && (
                          <>
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                await markNotificationsAsRead();
                                router.push("/notifications");
                                setOpen(false);
                              }}
                              className={`rounded px-3 py-2 text-start text-base font-medium transition-colors ${
                                isActive("/notifications")
                                  ? "bg-[var(--site-surface)] font-semibold text-white"
                                  : "text-[var(--site-muted)] hover:bg-[var(--site-surface)] hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span>Notifications</span>
                                {!isConnected && (
                                  <span className="text-xs">(Offline)</span>
                                )}
                                {notificationCount > 0 && (
                                  <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">
                                    {notificationCount}
                                  </span>
                                )}
                              </div>
                            </button>

                            <Link
                              href="/profiles"
                              onClick={() => setOpen(false)}
                              className={`rounded px-3 py-2 text-base font-medium transition-colors ${
                                isActive("/profiles")
                                  ? "bg-[var(--site-surface)] font-semibold text-white"
                                  : "text-[var(--site-muted)] hover:bg-[var(--site-surface)] hover:text-white"
                              }`}
                            >
                              My Account
                            </Link>
                          </>
                        )}
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>
    </Hideon>
  );
}
