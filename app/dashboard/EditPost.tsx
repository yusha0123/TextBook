"use client";

import Image from "next/image";
import { useState } from "react";
import Toggle from "./Toggle";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";

type EditProps = {
  id: string;
  avatar: string;
  name: string;
  title: string;
  comments?: {
    id: string;
    user: { name: string; image: string };
    createdAt: string;
    message: string;
  }[];
  likes: { id: string; postId: string; userId: string }[];
  createdAt: string;
};

const HeartIcon = ({ fill }: { fill: boolean }) => {
  const [hover, setHover] = useState(false);
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill={fill ? "#F31260" : "none"}
      xmlns="http://www.w3.org/2000/svg"
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

export default function EditPost({
  avatar,
  name,
  title,
  comments,
  id,
  likes,
  createdAt,
}: EditProps) {
  const [toggle, setToggle] = useState(false);
  const queryClient = useQueryClient();
  const moment = require("moment");
  const [deleteToastID, setDeleteToastID] = useState("");
  const { data: session } = useSession();
  const { user } = session || {};
  const currentUserLiked =
    (session && likes.some((like) => like.userId === user?.id)) || false;

  const { mutate } = useMutation(
    async (id: string) =>
      await axios.delete("/api/posts/deletePost", { data: id }),
    {
      onError: (error) => {
        toast.error("Error has Occurred while deleting your Post!", {
          id: deleteToastID,
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["user-posts"]);
        toast.success("Post has been deleted.", { id: deleteToastID });
      },
    }
  );

  const deletePost = () => {
    setDeleteToastID(
      toast.loading("Deleting your post...", { id: deleteToastID })
    );
    mutate(id);
  };

  return (
    <>
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.8 }}
        transition={{ ease: "easeOut" }}
        className="bg-white my-8 p-8 rounded-lg "
      >
        <div className="flex items-center gap-2">
          <Image width={32} height={32} src={avatar} alt="avatar" />
          <h3 className="font-bold text-gray-700 flex-1">{name}</h3>
          <h4 className="text-sm text-gray-400">
            {moment(createdAt).fromNow()}
          </h4>
        </div>
        <div className="my-8 ">
          <p className="break-all">{title}</p>
        </div>
        <div className="flex items-center gap-4 cursor-pointer">
          <Link href={`/post/${id}`}>
            <p className=" text-sm font-bold text-gray-700">
              {comments?.length}{" "}
              {comments?.length === 1 ? "Comment" : "Comments"}
            </p>
          </Link>
          <div className="flex items-center gap-1 flex-1">
            <HeartIcon fill={currentUserLiked} />
            <p>{likes.length}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setToggle(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </motion.div>
      {toggle && <Toggle deletePost={deletePost} setToggle={setToggle} />}
    </>
  );
}
