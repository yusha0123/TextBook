"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate } from "../util";
import { ProgressSpinner } from "primereact/progressspinner";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";

interface Props {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
  postTitle: string;
  likes: { id: string; postId: string; userId: string }[];
  comments: {
    id: string;
    user: { name: string; image: string };
    createdAt: string;
    message: string;
  }[];
  queryKey: string;
}
const HeartIcon = ({ fill, onClick }: { fill: boolean; onClick: Function }) => {
  const [hover, setHover] = useState(false);
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill={fill ? "#F31260" : "none"}
      xmlns="http://www.w3.org/2000/svg"
      onClick={() => onClick()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <path
        d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z"
        stroke={fill || hover ? "#F31260" : "#9ba1a6"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const Post = ({
  avatar,
  name,
  postTitle,
  id,
  createdAt,
  comments,
  likes,
  queryKey,
}: Props) => {
  const { data: session } = useSession();
  const { user } = session || {};
  const currentUserLiked =
    (session && likes.some((like) => like.userId === user?.id)) || false;
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const addLike = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts/addLike", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: id,
        }),
      });
      if (res.ok) {
        if (queryKey === "posts") {
          queryClient.invalidateQueries(["posts"]);
        } else {
          queryClient.invalidateQueries(["detail-post"]);
        }
      }
    } catch {
      toast.error("Failed to like the Post!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white my-8 p-8 rounded-lg shadow-md">
      <div className="flex items-center gap-2">
        <Avatar image={avatar} size="large" shape="circle" />
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-gray-600 flex-1">{name}</h3>
          <h4 className="text-sm">{formatDate(createdAt)}</h4>
        </div>
      </div>
      <div className="my-8">
        <p className="break-all">{postTitle}</p>
      </div>
      <div className="flex gap-4 cursor-pointer items-center">
        <Link href={`/post/${id}`}>
          <p className="text-sm font-bold text-gray-600">
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </p>
        </Link>
        <div className="flex items-center gap-1">
          {loading ? (
            <ProgressSpinner
              style={{ width: "20px", height: "20px" }}
              strokeWidth="3"
            />
          ) : (
            <HeartIcon
              fill={currentUserLiked}
              onClick={() => session && addLike(id)}
            />
          )}
          {likes.length}
        </div>
      </div>
    </div>
  );
};

export default Post;
