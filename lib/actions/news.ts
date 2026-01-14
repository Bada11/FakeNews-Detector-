"use server";

import { News } from "../generated/prisma/client";
import prisma from "../prismadb";

export async function addNews(
  input: string,
  result: string,
  userId?: string,
  confidentScore?: string
) {
  try {
    console.log(input, result, userId, confidentScore);
    const news = await prisma.news.create({
      data: {
        input,
        result,
        user: {
          connect: userId ? { id: userId } : undefined,
        },
        confidentScore: confidentScore,
      },
    });
    if (news) {
      console.log("News added to DB:", news);
      return news as News;
    }
  } catch (error) {
    console.error("Error adding news to DB:", error);
  }
}

export async function getNewsByUserId(userId?: string) {
  try {
    const news = await prisma.news.findMany({
      where: {
        userId,
      },
    });
    if (news) {
      console.log("Fetched news for user:", news);
      return news as News[];
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getNewsById(newsId: string) {
  try {
    const news = await prisma.news.findUnique({
      where: { id: newsId },
    });
    if (news) {
      return news as News;
    }
  } catch (error) {
    console.error;
  }
}

export async function deleteNewsById(newsId: string) {
  try {
    const news = await prisma.news.delete({
      where: { id: newsId },
    });
    if (news) {
      return news;
    }
  } catch (error) {
    console.error;
  }
}
