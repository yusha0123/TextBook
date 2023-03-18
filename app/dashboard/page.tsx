import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import UserPosts from "./UserPosts";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/sign");
  }
  return (
    <main>
      <h1 className="text-2xl font-bold">Welcome {session?.user?.name}</h1>
      <UserPosts />
    </main>
  );
};

export default Dashboard;
