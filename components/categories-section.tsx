"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { CategoryCard } from "./category-card";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CategoryCardSkeleton } from "./card/skeleton";

interface Category {
  _id: string;
  categoryName: string;
  image?: string;
}

export function CategoriesSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const axiosPublic = useAxios();

  const { data: allCategory = [], isLoading } = useQuery<Category[]>({
    queryKey: ["allCategory"],
    queryFn: async () => {
      const { data } = await axiosPublic("/api/categories");
      return data?.data ?? [];
    },
  });

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const handleDotClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
      setCurrentIndex(index);
    }
  };

  const skeletonItems = Array(4)
    .fill(0)
    .map((_, index) => (
      <CarouselItem
        key={`skeleton-${index}`}
        className="basis-full px-2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
      >
        <CategoryCardSkeleton />
      </CarouselItem>
    ));

  return (
    <section className="mt-24">
      <div className="container space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="h-6 w-3 rounded bg-[var(--site-accent)] md:h-9 md:w-5" />
            <h1 className="heading-size mt-[4px] font-benedict font-medium leading-[120%] text-white [text-shadow:_0_0_1px_#fff,_0_0_15px_#fff,_0_0_15px_#fff]">
              Categories
            </h1>
          </div>
          <p className="mt-1 text-xl font-bold text-white md:mt-2 md:text-2xl lg:text-[26px]">
            Explore our categories
          </p>
        </div>

        <div className="w-full translate-y-[-20px]">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {isLoading
                ? skeletonItems
                : allCategory?.map((category, index: number) => (
                    <CarouselItem
                      key={category._id || index}
                      className="basis-full py-2 pl-2 sm:basis-1/2 md:basis-1/2 md:pl-[25px] lg:basis-1/3 xl:basis-1/4"
                    >
                      <CategoryCard
                        title={category.categoryName}
                        icon={category.image || ""}
                      />
                    </CarouselItem>
                  ))}
            </CarouselContent>
            <div className="mt-6 flex items-center justify-center gap-1 md:mt-10 md:gap-2">
              <div className="flex gap-1 md:gap-2">
                {isLoading
                  ? Array(4)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={`skeleton-dot-${index}`}
                          className={`h-1.5 rounded-full transition-all md:h-2 ${
                            index === 0
                              ? "w-4 bg-[var(--site-accent)] md:w-6"
                              : "w-1.5 bg-white/30 md:w-2"
                          }`}
                        />
                      ))
                  : allCategory?.map((_, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`h-1.5 rounded-full transition-all focus:outline-none md:h-2 ${
                          currentIndex === index
                            ? "w-4 bg-[var(--site-accent)] md:w-6"
                            : "w-1.5 bg-white/30 md:w-2"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
