import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import UserPosts from "./UserPosts";

export const metadata = {
  title: "Text Book | Dashboard",
};

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <main className="mt-20">
      <UserPosts />
    </main>
  );
};

export default Dashboard;
