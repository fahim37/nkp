"use client";

import { MoveLeft, MoveRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

type User = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  country?: string;
};

type Comment = {
  _id: string;
  userId: User;
  message: string;
  blogId: string;
  createdAt: string;
  __v: number;
};

type CommentsResponse = {
  success: boolean;
  comments: Comment[];
};

interface BlogCommentsSectionProps {
  blogId: string;
}

export function BlogCommentsSection({ blogId }: BlogCommentsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading, isError } = useQuery<CommentsResponse>({
    queryKey: ["comments", blogId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${blogId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      return response.json();
    },
  });

  const handlePrev = () => {
    if (!data?.comments?.length) return;
    setCurrentIndex(
      (prev) => (prev - 1 + data.comments.length) % data.comments.length
    );
  };

  const handleNext = () => {
    if (!data?.comments?.length) return;
    setCurrentIndex((prev) => (prev + 1) % data.comments.length);
  };

  if (isLoading) {
    return (
      <section className="container py-[50px] lg:mt-24">
        <div className="text-gray-800">Loading comments...</div>
      </section>
    );
  }

  if (isError || !data?.success) {
    return (
      <section className="container py-[50px] lg:mt-24">
        <div className="text-gray-800">
          Failed to load comments. Please try again later.
        </div>
      </section>
    );
  }

  if (!data.comments || data.comments.length === 0) {
    return (
      <section className="container rounded-2xl bg-white py-6 lg:mt-24">
        <div className="text-center text-black">No comments are available yet.</div>
      </section>
    );
  }

  const comment = data.comments[currentIndex];
  const user = comment.userId;

  const formattedDate = new Date(comment.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <section className="container !mt-[-70px] rounded-2xl bg-white py-4">
      <div className="relative mb-5 py-8 pl-6">
        <p className="text-lg italic text-[#212121]">{comment.message}</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-700">
            {user.avatar ? (
              <Image
                src={user.avatar || "/placeholder.svg"}
                alt={`${user.name}'s avatar`}
                className="h-full w-full object-cover"
                width={100}
                height={100}
              />
            ) : (
              <span className="text-lg font-bold text-white">
                {user.name?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-800 lg:text-lg">
              {user.name || "Unknown User"}
            </h4>
            <p className="text-sm text-gray-600">{formattedDate}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="group flex items-center justify-center rounded-sm border border-gray-300 bg-[#212121] px-[35px] py-[15px] hover:bg-white hover:text-black"
            onClick={handlePrev}
          >
            <MoveLeft className="h-4 w-4 -rotate-45 text-white group-hover:text-black" />
            <span className="sr-only">Previous</span>
          </button>
          <button
            className="group flex items-center justify-center rounded-sm border border-gray-300 bg-[#212121] px-[35px] py-[15px] hover:bg-white hover:text-black"
            onClick={handleNext}
          >
            <MoveRight className="h-4 w-4 -rotate-45 text-white group-hover:text-black" />
            <span className="sr-only">Next</span>
          </button>
        </div>
      </div>
    </section>
  );
}
