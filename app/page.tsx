"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AddPost from "./components/AddPost";
import Post from "./components/Post";
import { motion } from "framer-motion";
import { ProgressSpinner } from "primereact/progressspinner";

const allPosts = async () => {
  const response = await axios.get("/api/posts/getPosts");
  return response.data;
};

export default function Home() {
  const { data, error, isLoading } = useQuery({
    queryFn: allPosts,
    queryKey: ["posts"],
  });
  if (error) return error;
  if (isLoading)
    return (
      <div className="flex items-center justify-center fixed inset-0">
        <ProgressSpinner
          style={{ width: "70px ", height: "70px" }}
          strokeWidth="3"
        />
      </div>
    );
  return (
    <main className="mt-20">
      <AddPost />
      {data?.map(
        (post: {
          id: string;
          user: { name: string; image: string };
          title: string;
          createdAt: string;
          Comment: [];
          Heart: [];
        }) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Post
              name={post.user.name}
              avatar={post.user.image}
              postTitle={post.title}
              id={post.id}
              createdAt={post.createdAt}
              comments={post.Comment}
              likes={post.Heart}
              queryKey="posts"
            />
          </motion.div>
        )
      )}
    </main>
  );
}
