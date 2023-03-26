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
    return res.status(401).json({ message: "Please sign in to update Post!" });
  }

  const { id, newPost } = req.body.data;
  if (newPost.length > 300) {
    return res.status(403).json({ message: "Length of post is too long!" });
  }
  if (!newPost.length) {
    return res.status(403).json({ message: "Please submit a valid Post!" });
  }
  try {
    const result = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title: newPost,
      },
    });

    return res.json(result);
  } catch (err) {
    res.status(402).json({ err: "Error has occured while making a comment" });
  }
}
