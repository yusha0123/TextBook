import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const details = req.query.details;
      if (!details) {
        throw new Error("Details not provided");
      }
      const data = await prisma.post.findUnique({
        where: {
          id: details.toString(),
        },
        include: {
          user: true,
          Heart: true,
          Comment: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              user: true,
            },
          },
        },
      });
      return res.status(200).json(data);
    } catch (err) {
      res
        .status(403)
        .json({ err: "Error has occured while fetching the Post" });
    }
  }
}
