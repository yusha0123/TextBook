"use client";
import AddComment from "@/app/components/AddComment";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import Post from "@/app/components/Post";

type URL = {
  params: {
    slug: string;
  };
  searchParams: string;
};

interface CommentType {
  id: number;
  message: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    image: string;
  };
}
const fetchDetails = async (slug: string) => {
  const response = await axios.get(`/api/posts/${slug}`);
  return response.data;
};

export default function PostDetail(url: URL) {
  const moment = require("moment");
  const { data, isLoading } = useQuery({
    queryKey: ["detail-post"],
    queryFn: () => fetchDetails(url.params.slug),
  });
  if (isLoading)
    return (
      <>
        <div className="flex items-center justify-center fixed inset-0">
          <div
            className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></div>
        </div>
      </>
    );

  return (
    <div>
      <Post
        id={data?.id}
        name={data?.user.name}
        avatar={data?.user.image}
        postTitle={data?.title}
        comments={data?.Comment}
        createdAt={data?.createdAt}
        likes={data?.Heart}
        queryKey="detail-post"
      />
      <AddComment id={data?.id} />
      {data?.Comment?.map((comment: CommentType) => (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.8 }}
          transition={{ ease: "easeOut" }}
          className="my-6 bg-white p-8 rounded-md"
          key={comment.id}
        >
          <div className="flex items-center gap-2">
            <Image
              width={24}
              height={24}
              src={comment.user?.image}
              alt="avatar"
            />
            <h3 className="font-bold flex-1">{comment?.user?.name}</h3>
            <h2 className="text-sm">{moment(comment.createdAt).fromNow()}</h2>
          </div>
          <div className="py-4">{comment.message}</div>
        </motion.div>
      ))}
    </div>
  );
}
