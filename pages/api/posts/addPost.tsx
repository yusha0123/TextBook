import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Please sign in to Post !" });
    }
    const title: string = req.body.title;
    const User = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? "" },
    });

    if (title.length > 300) {
      return res.status(403).json({ message: "Length of post is too long!" });
    }
    if (!title.length) {
      return res.status(403).json({ message: "Please submit a valid Post!" });
    }

    try {
      if (User) {
        const result = await prisma.post.create({
          data: {
            title,
            userId: User.id,
          },
        });
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(403).json({ error: "Something went Wrong!" });
    }
  }
}
