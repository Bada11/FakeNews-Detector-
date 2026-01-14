"use client";

import { getUser } from "@/lib/actions/auth";
import { stat } from "fs";
import { BrainCircuit } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [user, setUser] = React.useState<any>(null);

  /*useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/login";
    }
  }, [status]);*/

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUser(session?.user?.email as string);
      console.log("User data in Navbar:", data);
      setUser(data);
    };
    fetchData();
  }, [session?.user?.email]);

  const isOnNewsPage = pathname === "/newsresult";

  return (
    <div className="w-full h-16 flex items-center justify-between px-10 bg-white border-b border-gray-300">
      <h1 className="flex gap-2 items-center text-lg font-semibold">
        <BrainCircuit size={20} className="text-purple-600" />
        Lexi
      </h1>

      {session?.user ? (
        <div className="flex items-center gap-3">
          <div className="">
            <Image
              src={user?.profilePicture}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover"
              width={100}
              height={100}
            />
          </div>
          <div className="hidden md:flex flex-col">{user?.username}</div>
          {isOnNewsPage ? (
            <Link href="/">
              <button className="bg-purple-500 px-4 py-2 rounded-md text-white text-[14px] hover:bg-purple-600 transition">
                Back to Analyze
              </button>
            </Link>
          ) : (
            <Link href="/newsresult">
              <button className="bg-purple-500 px-4 py-2 rounded-md text-white text-[14px] hover:bg-purple-600 transition">
                News History
              </button>
            </Link>
          )}

          <button
            onClick={() => signOut()}
            className="bg-red-500 px-4 py-2 rounded-md text-white text-[14px] hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <Link href="/login">
            <button className="bg-purple-500 px-4 py-2 rounded-md text-white text-[14px] hover:bg-purple-600 transition">
              Login
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
