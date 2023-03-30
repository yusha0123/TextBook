import Link from "next/link";
import Login from "./Login";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import Logged from "./Logged";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <nav className="flex fixed z-10 top-0 right-0 left-0 backdrop-blur-md justify-between items-center px-5 py-2">
      <Link href={"/"}>
        <h1 className="font-bold text-2xl font-serif tracking-wide">
          TextBook
        </h1>
      </Link>
      <ul className="flex items-center">
        {!session?.user && <Login />}
        {session?.user && (
          <Logged
            image={session.user?.image || ""}
            name={session.user?.name || ""}
          />
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
