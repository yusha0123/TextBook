"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

const AddPost = () => {
  const [title, setTitle] = useState("");
  const [disabled, isDisabled] = useState(false);
  const [postId, setPostId] = useState("");
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    async (title: string) => await axios.post("/api/posts/addPost", { title }),
    {
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data.message, { id: postId });
        }
        isDisabled(false);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
        toast.success("Posted Successfully!", { id: postId });
        setTitle("");
        isDisabled(false);
      },
    }
  );

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostId(toast.loading("Posting..."));
    isDisabled(true);
    mutate(title);
  };
  return (
    <form
      onSubmit={submitPost}
      className="bg-white my-4 p-5 rounded-md shadow-md"
    >
      <div className="my-3">
        <textarea
          className="block p-3 my-2 w-full bg-gray-200 rounded-lg outline-1"
          placeholder="Write your thoughts here..."
          value={title}
          rows={3}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <p
          className={`font-bold text-sm ${
            title.length > 300 ? "text-red-700" : "text-gray-700"
          }`}
        >{`${title.length}/300`}</p>
        <button
          type="submit"
          disabled={disabled || title.trim().length === 0 || title.length > 300}
          className="text-white bg-blue-700 hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-2 mr-2 mb-2 focus:outline-none"
        >
          Post
        </button>
      </div>
    </form>
  );
};

export default AddPost;
