"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

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
    setCommentToastId(toast.loading("Please wait..."));
    mutate({ title, postId: id });
  };
  return (
    <form onSubmit={submitPost} className="my-8">
      <div className="flex flex-col my-3">
        <InputText onChange={(e) => setTitle(e.target.value)} value={title} />
      </div>
      <div className="flex items-center justify-between">
        <Button
          disabled={
            isDisabled || title.length > 300 || title.trim().length === 0
          }
          label="Comment"
          type="submit"
          severity="help"
          rounded
          size="small"
        />
        <p
          className={`font-bold  ${
            title.length > 300 ? "text-red-700" : "text-gray-700"
          } `}
        >{`${title.length}/300`}</p>
      </div>
    </form>
  );
}
