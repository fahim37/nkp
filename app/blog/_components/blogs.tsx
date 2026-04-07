"use client";
import React from "react";
import BlogsCard from "@/components/card/blogsCard";
import { Blog } from "./type";
import { PageHeader } from "@/Shared/PageHeader";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useQuery } from "@tanstack/react-query";

const fetchBlogs = async (): Promise<{ blogs: Blog[] }> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog`);
  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }
  return res.json();
};

function Blogs() {
  const {
    data: blogsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const blogs = blogsData?.blogs || [];

  const SkeletonBlogCard = () => (
    <div className="max-w-[370px]">
      <Skeleton height={222} width="100%" className="rounded-t-xl" />
      <div className="p-2">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton width={100} height={16} />
          <Skeleton width={80} height={16} />
        </div>
        <Skeleton width="80%" height={20} count={2} />
      </div>
    </div>
  );

  if (isError) {
    return (
      <section>
        <PageHeader title="Our Blog" imge="/assets/Blogbanner.jpg" />
        <div className="container my-24 text-center">
          <div className="text-red-500">
            Error loading blogs: {error.message}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <PageHeader title="Our Blog" imge="/assets/Blogbanner.jpg" />

      <div className="container my-10">
        <h1 className="mb-8 text-center text-[25px] font-bold text-white lg:text-[32px]">
          City stories and fresh perspectives
        </h1>
        <div className="mb-12 text-center text-base text-gray-300 lg:text-[18px]">
          Our blog is for people who love cities in all their corners, ideas,
          and encounters. We write about the questions that shape urban life:
          how cities evolve, how people discover new favorite places, and what
          makes a day in the city feel memorable. Read through, follow your
          curiosity, and find new angles for your own city experience.
        </div>
      </div>
      <div className="container my-24">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <SkeletonBlogCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {blogs.map((blog: Blog) => (
              <BlogsCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Blogs;
