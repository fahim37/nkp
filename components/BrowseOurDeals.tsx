"use client";

import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { DealsCard } from "./DealsCard";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { DealsCardSkeleton } from "./skeleton/dealsSkeleton";

interface ScheduleDate {
  date: string;
  active: boolean;
  participationsLimit: number;
  bookedCount: number;
  _id: string;
}

interface Deal {
  timer: string | undefined;
  time: number | undefined;
  bookingCount: number;
  participationsLimit: number | undefined;
  _id: string;
  title: string;
  shortDescription?: string;
  description: string;
  participations: number;
  price: number;
  images: string[];
  offers: string[];
  status: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  scheduleDates?: ScheduleDate[];
  location?: {
    country: string;
    city: string;
  };
}

export function BrowseOurDeals() {
  const axiosInstance = useAxios();

  const { data: response, isLoading } = useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/deals?showAll=true`);
      return data;
    },
  });

  const dealsData: Deal[] = response?.deals || [];

  const skeletonItems = Array(6)
    .fill(0)
    .map((_, index) => (
      <div key={`skeleton-${index}`}>
        <div className="mx-auto w-full">
          <DealsCardSkeleton />
        </div>
      </div>
    ));

  return (
    <section className="container mt-24">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <div className="h-9 w-5 rounded bg-[var(--site-accent)]" />
            <div>
              <h1 className="heading-size font-benedict font-normal leading-[120%] tracking-[0.04em] text-white [text-shadow:_0_0_1px_#fff,_0_0_15px_#fff,_0_0_15px_#fff]">
                Walk Throughz
              </h1>
            </div>
          </div>
          <p className="my-2 text-xl font-bold text-white md:my-3 md:text-2xl lg:text-[26px]">
            Find your next Walk Through
          </p>
        </div>
        <Link href={"/deals"}>
          <Button className="bg-[var(--site-button-bg)] text-[var(--site-button-text)] hover:bg-white">
            Explore now <MoveRight />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 space-y-5 pt-6 md:grid-cols-2 md:space-y-0 lg:grid-cols-3">
        {isLoading
          ? skeletonItems
          : dealsData.slice(0, 9).map((deal) => (
              <div key={deal._id}>
                <div className="mx-auto w-full md:max-[32%]">
                  <DealsCard
                    id={deal._id}
                    title={deal.title}
                    status={deal.status}
                    image={deal.images[0] || "/assets/deals.png"}
                    shortDescription={deal.shortDescription}
                    description={deal.description}
                    time={deal.time}
                    createdAt={deal.createdAt}
                    updatedAt={deal.updatedAt}
                    price={deal.price}
                    participations={deal.bookingCount}
                    maxParticipants={deal.participationsLimit}
                    scheduleDates={deal.scheduleDates}
                    location={deal.location}
                    timer={deal.timer}
                  />
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}
