"use client";

import { useEffect, useState } from "react";
import { getNewsByUserId, deleteNewsById } from "@/lib/actions/news";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { getUser } from "@/lib/actions/auth";

const NewsList = () => {
  const { data: session } = useSession();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUser(session?.user?.email as string);
      console.log("User data in Navbar:", data);
      setUser(data);
    };
    fetchData();

    const fetchNews = async () => {
      try {
        const data = await getNewsByUserId(user?.id);
        setNews(data || []);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [session?.user?.email, user?.id]);

  const handleDelete = async (id: string) => {
    // if (!confirm("Are you sure you want to delete this news item?")) return;
    try {
      await deleteNewsById(id);
      setNews((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">Loading History...</p>
    );

  if (news.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500">No news history found.</p>
    );

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight mb-4">
        Your News History
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full max-w-2xl space-y-4"
      >
        {news.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <Card className="shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium text-gray-800 truncate max-w-xs">
                  {item.input.length > 100
                    ? `${item.input.slice(0, 100)}...`
                    : item.input}
                </CardTitle>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <X size={40} />
                </Button>
              </CardHeader>

              <Separator />

              <CardContent className="py-4">
                <AccordionTrigger className="text-sm text-gray-600 hover:text-gray-800 transition">
                  View Details
                </AccordionTrigger>

                <AccordionContent>
                  <div className="text-gray-700 mt-3 leading-relaxed space-y-2">
                    <p>
                      <span className="font-semibold">News:</span> {item.input}
                    </p>
                    <p>
                      <span className="font-semibold">Result:</span>{" "}
                      <span
                        className={`font-medium ${
                          item.result?.toLowerCase() === "real"
                            ? "text-green-600"
                            : "text-red-600"
                        } transition-colors duration-300`}
                      >
                        {item.result}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Confidence Score:</span>{" "}
                      {item.confidentScore}
                    </p>
                  </div>
                </AccordionContent>
              </CardContent>

              <CardFooter className="text-xs text-gray-400">
                Posted on{" "}
                {new Date(item.createdAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </CardFooter>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default NewsList;
