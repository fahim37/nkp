"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { DealsCard } from "@/components/DealsCard";
import { DealsSkeleton } from "@/components/delas_skleton";

interface Deal {
  time: number | undefined;
  bookingCount: number;
  participationsLimit: number | undefined;
  _id: string;
  title: string;
  description: string;
  participations: number;
  shortDescription?: string;
  price: number;
  images: string[];
  offers: string[];
  status: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  scheduleDates?: [];
  timer?: string;
  location?: {
    country: string;
    city: string;
  };
}

export function DealsSection() {
  const axiosInstance = useAxios();

  const { data: response, isLoading } = useQuery({
    queryKey: ["popularDeals"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/deals/popular`);
      return data;
    },
  });

  const dealsData = response?.deals || [];
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const skeletonItems = Array.from(
    { length: itemsPerView },
    (_, index) => index
  );

  return (
    <section>
      <div className="container">
        <div className="mb-4 flex items-start justify-between sm:mb-8 sm:items-center">
          <div className="mb-4 space-y-4 sm:mb-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="h-6 w-3 rounded bg-[var(--site-accent)] sm:h-9 sm:w-5" />
              <div>
                <h1 className="heading-size font-benedict font-normal leading-[120%] tracking-[0.04em] text-white [text-shadow:_0_0_1px_#fff,_0_0_15px_#fff,_0_0_15px_#fff]">
                  Popular
                </h1>
              </div>
            </div>
            <p className="mt-1 text-xl font-bold text-white md:mt-2 md:text-2xl lg:text-[26px]">
              Trending Walk Throughz
            </p>
          </div>

          <div className="mt-2 flex gap-2 sm:mt-0">
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-full border-none bg-[var(--site-button-bg)] hover:bg-white disabled:opacity-50"
              id="carousel-prev-button"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4 text-black sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-full border-none bg-[var(--site-button-bg)] hover:bg-white disabled:opacity-50"
              id="carousel-next-button"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4 text-black sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </Button>
          </div>
        </div>

        <div className="relative px-0 sm:px-4">
          <Carousel
            opts={{ align: "start", loop: false }}
            className="w-full"
            setApi={(api) => {
              if (api) {
                const prevButton = document.getElementById("carousel-prev-button");
                const nextButton = document.getElementById("carousel-next-button");

                if (prevButton) {
                  prevButton.addEventListener("click", () => api.scrollPrev());
                }
                if (nextButton) {
                  nextButton.addEventListener("click", () => api.scrollNext());
                }
              }
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {isLoading ? (
                skeletonItems.map((index) => (
                  <CarouselItem
                    key={`skeleton-${index}`}
                    className={`pl-2 md:pl-4 ${
                      itemsPerView === 1
                        ? "basis-full"
                        : itemsPerView === 2
                          ? "basis-1/2"
                          : "basis-1/3"
                    }`}
                  >
                    <div className="p-1">
                      <DealsSkeleton />
                    </div>
                  </CarouselItem>
                ))
              ) : dealsData.length === 0 ? (
                <CarouselItem className="basis-full pl-2 md:pl-4">
                  <div className="flex h-40 items-center justify-center sm:h-64">
                    <p className="text-center text-sm text-white sm:text-base">
                      No experiences are available right now.
                    </p>
                  </div>
                </CarouselItem>
              ) : (
                dealsData.map((deal: Deal) => (
                  <CarouselItem
                    key={deal._id}
                    className={`${
                      itemsPerView === 1
                        ? "basis-full"
                        : itemsPerView === 2
                          ? "basis-1/2"
                          : "basis-1/3"
                    }`}
                  >
                    <div>
                      <DealsCard
                        id={deal._id}
                        status={deal.status}
                        title={deal.title}
                        shortDescription={deal.shortDescription}
                        image={deal.images[0] || "/assets/deals.png"}
                        description={deal.description}
                        price={deal.price}
                        time={deal.time}
                        createdAt={deal.createdAt}
                        updatedAt={deal.updatedAt}
                        participations={deal.bookingCount}
                        maxParticipants={deal.participationsLimit}
                        scheduleDates={deal.scheduleDates}
                        location={deal.location}
                        timer={deal.timer}
                      />
                    </div>
                  </CarouselItem>
                ))
              )}
            </CarouselContent>
            <div className="hidden">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
