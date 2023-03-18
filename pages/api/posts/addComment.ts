import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import prisma from "../../../prisma/client";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res
      .status(401)
      .json({ message: "Please sign in to create a comment." });
  }

  const { title, postId } = req.body.data;
  // Get user from database
  const prismaUser = await prisma.user.findUnique({
    where: { email: session?.user?.email || undefined },
  });

  // Create comment
  try {
    const result = await prisma.comment.create({
      data: {
        message: title as string,
        postId: postId as string,
        userId: prismaUser?.id as string,
      },
    });

    return res.json(result);
  } catch (err) {
    res.status(402).json({ err: "Error has occured while making a comment" });
  }
}
