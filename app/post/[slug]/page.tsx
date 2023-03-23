"use client";
import AddComment from "@/app/components/AddComment";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Post from "@/app/components/Post";
import { formatDate } from "@/app/util";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";

type URL = {
  params: {
    slug: string;
  };
  searchParams: string;
};

interface CommentType {
  id: string;
  message: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
}
const fetchDetails = async (slug: string) => {
  const response = await axios.get(`/api/posts/${slug}`);
  return response.data;
};

export default function PostDetail(url: URL) {
  const { data: session } = useSession();
  const [toggle, setToggle] = useState(false);
  const idRef = useRef("");
  const queryClient = useQueryClient();
  const [toastId, setToastId] = useState("");
  const { user } = session || {};
  const { data, isLoading } = useQuery({
    queryKey: ["detail-post"],
    queryFn: () => fetchDetails(url.params.slug),
  });

  const { mutate } = useMutation(
    async (id: string) =>
      await axios.delete("/api/posts/deleteComment", { data: id }),
    {
      onError: (error) => {
        toast.error("Error has Occurred while deleting your Comment!", {
          id: toastId,
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["detail-post"]);
        toast.success("Comment deleted Successfully!", { id: toastId });
      },
    }
  );

  const deleteComment = (id: string) => {
    setToastId(toast.loading("Deleting your Comment..."));
    mutate(id);
  };
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
    <>
      <div className="mt-16">
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
            className="my-6 bg-white p-8 rounded-md shadow-sm"
            key={comment.id}
          >
            <div className="flex items-center gap-2">
              <Image
                width={30}
                height={30}
                src={comment.user?.image}
                alt="avatar"
                className="rounded-full"
              />
              <div className="flex flex-col gap-1 flex-1">
                <h3 className="font-bold flex-1">{comment?.user?.name}</h3>
                <h2 className="text-sm">{formatDate(comment.createdAt)}</h2>
              </div>
              {user?.id === comment.user?.id && (
                <button
                  className="text-white bg-red-500 p-2 text-sm rounded"
                  onClick={() => {
                    idRef.current = comment.id;
                    setToggle(true);
                  }}
                >
                  <i className="pi pi-trash" />
                </button>
              )}
            </div>
            <div className="py-4">{comment.message}</div>
          </motion.div>
        ))}
      </div>
      <ConfirmDialog
        visible={toggle}
        onHide={() => setToggle(false)}
        message="Are you sure you want to delete this Comment?"
        header="Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={() => deleteComment(idRef.current)}
        reject={() => setToggle(false)}
      />
    </>
  );
}
