"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import EditPost from "./EditPost";
import { ProgressSpinner } from "primereact/progressspinner";

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
      <div className="flex items-center justify-center fixed inset-0">
        <ProgressSpinner
          style={{ width: "70px ", height: "70px" }}
          strokeWidth="3"
        />
      </div>
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
