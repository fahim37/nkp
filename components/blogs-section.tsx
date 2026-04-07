"use client";

import { useEffect, useState } from "react";
import { Blog } from "@/app/blog/_components/type";
import BlogsCard from "./card/blogsCard";
import Link from "next/link";
import { Button } from "./ui/button";
import { MoveRight } from "lucide-react";

export function BlogsSection() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog`);
        const data = await res.json();
        setBlogs(data.blogs);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="container lg:mt-24">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <div className="h-9 w-5 rounded bg-[var(--site-accent)]" />
            <div>
              <h1 className="heading-size font-benedict font-normal leading-[120%] tracking-[0.04em] text-white [text-shadow:_0_0_1px_#fff,_0_0_15px_#fff,_0_0_15px_#fff]">
                Blog
              </h1>
            </div>
          </div>
          <p className="mt-1 text-xl font-bold text-white md:mt-2 md:text-2xl lg:text-[26px]">
            Latest stories from the city
          </p>
        </div>
        <Link href={"/blog"}>
          <Button className="bg-[var(--site-button-bg)] text-[var(--site-button-text)] hover:bg-white">
            Explore now <MoveRight />
          </Button>
        </Link>
      </div>

      <div className="py-8">
        {loading ? (
          <p className="text-center text-white">Loading blog posts...</p>
        ) : (
          <div className="grid grid-cols-1 justify-items-center gap-14 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:gap-8">
            {blogs?.slice(0, 3).map((blog: Blog) => (
              <BlogsCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
