"use client";
import Analyze from "@/components/Analyze";
import { ArrowRight, BrainCircuit } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-10 py-2 gap-5">
        <div className=" animate-bounce border-[1px] border-purple-400 rounded-full px-8 py-1 text-[12px] flex gap-2 items-center ">
          <BrainCircuit size={15} className="text-purple-600" />
          <h1 className="text-purple-600"> AI Powered news detection app</h1>
        </div>
        <h1 className="text-[40px] font-bold">
          Your Reliable AI for{" "}
          <span className="text-purple-600">Fake News Detection</span>
        </h1>
        <p className="text-[16px] text-center max-w-[800px] text-gray-600">
          Verify the credibility of news articles in real-time with cutting-edge
          AI technology. Stay informed, stay protected, and fight misinformation
          with confidence!
        </p>
        <div className="flex gap-3">
          <button className="bg-purple-500 px-10 rounded-sm py-3  text-white text-[16px] flex gap-2 items-center hover:bg-purple-600 transition">
            Get Started for free!
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
      <Analyze />
    </>
  );
}
