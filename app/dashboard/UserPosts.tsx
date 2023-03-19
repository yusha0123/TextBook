"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import EditPost from "./EditPost";

const fetchUserPosts = async () => {
  const response = await axios.get("/api/posts/authPosts");
  return response.data;
};
type AuthPosts = {
  email: string;
  id: string;
  image: string;
  name: string;
  Post: {
    createdAt: string;
    id: string;
    title: string;
    Comment: [];
    Heart: [];
  }[];
};
export default function UserPosts(): JSX.Element {
  const { data, isLoading } = useQuery<AuthPosts>({
    queryFn: fetchUserPosts,
    queryKey: ["user-posts"],
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
      <div className="text-center text-red-600 mt-10 text-lg">
        {data?.Post.length === 0 &&
          "You have 0 Posts ,Post Something to see it here!"}
      </div>
      {data?.Post?.map((post) => (
        <EditPost
          id={post.id}
          key={post.id}
          avatar={data.image}
          name={data.name}
          title={post.title}
          comments={post.Comment}
          likes={post.Heart}
          createdAt={post.createdAt}
        />
      ))}
    </div>
  );
}
