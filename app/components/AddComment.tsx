"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

type Comment = {
  postId?: string;
  title: string;
};
type PostProps = {
  id?: string;
};
export default function AddComment({ id }: PostProps) {
  const [title, setTitle] = useState("");
  const { data: session } = useSession();
  const [isDisabled, setIsDisabled] = useState(false);
  const [commentToastId, setCommentToastId] = useState("");

  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    async (data: Comment) => {
      return axios.post("/api/posts/addComment", { data });
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["detail-post"]);
        setTitle("");
        setIsDisabled(false);
        toast.success("Comment added Successfully!", { id: commentToastId });
      },
      onError: (error) => {
        setIsDisabled(false);
        if (error instanceof AxiosError) {
          toast.error("Failed to add your Comment!", { id: commentToastId });
        }
      },
    }
  );

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);

    if (!session) {
      toast.error("Please Sign in to Comment!", { id: commentToastId });
      return;
    }
    setCommentToastId(toast.loading("Adding your comment"));
    mutate({ title, postId: id });
  };
  return (
    <form onSubmit={submitPost} className="my-8">
      <div className="flex flex-col my-2">
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type="text"
          name="title"
          className="p-4 text-lg rounded-md my-2"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          disabled={
            isDisabled || title.length > 300 || title.trim().length === 0
          }
          className=" text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5   disabled:opacity-25"
          type="submit"
        >
          Comment
        </button>
        <p
          className={`font-bold  ${
            title.length > 300 ? "text-red-700" : "text-gray-700"
          } `}
        >{`${title.length}/300`}</p>
      </div>
    </form>
  );
}
