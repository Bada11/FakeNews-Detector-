"use client"; // since we’re using useState + fetch

import { getUser } from "@/lib/actions/auth";
import { addNews, getNewsByUserId } from "@/lib/actions/news";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Analyze = () => {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  // const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUser(session?.user?.email as string);
      console.log("User data in Navbar:", data);
      setUser(data);
    };
    fetchData();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      alert("Please enter some news text.");
      return;
    }

    // 🧹 Reset previous result and set loading
    setResult("");
    setConfidence("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      // 🧠 Update prediction result
      if (data && data.prediction) {
        setResult(data.prediction);
        setConfidence(data.confidence);
        if (user && user.id) {
          const newsResponse = await addNews(
            input,
            data.prediction,
            user?.id,
            data.confidence
          );
          console.log("News saved:", newsResponse);
        } else {
          const newsResponse = await addNews(
            input,
            data.prediction,

            data.confidence
          );
          console.log("News saved:", newsResponse);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("Error connecting to API");
    } finally {
      // ✅ Stop loading
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const getNews = async () => {
  //     const news = await getNewsByUserId();
  //     console.log("Fetched news:", news);
  //     setNews(news || []);
  //   };
  //   getNews();
  // }, []);

  return (
    <div className="flex flex-col items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-full max-w-md"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter news text here..."
          className="border rounded-lg p-3"
        />
        <button
          type="submit"
          className="bg-purple-500 px-10 rounded-sm py-3 text-white text-[16px] flex gap-2 items-center hover:bg-purple-600 transition"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Check News"}
        </button>
      </form>

      {result && (
        <div className="mt-6 text-lg font-semibold">
          Prediction:{" "}
          <span
            className={
              result === "REAL"
                ? "text-green-600"
                : result === "FAKE"
                ? "text-red-600"
                : "text-gray-600"
            }
          >
            {result}
          </span>
          {confidence && (
            <p className="mt-6 text-lg font-semibold">
              Confidence: <span className="text-600">{confidence}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Analyze;
