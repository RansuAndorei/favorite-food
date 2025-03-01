import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  // Check if user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  // Create new food
  if (req.method === "POST") {
    try {
      const { image, title, description, rating, isPublic } = req.body;

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      const food = await prisma.food.create({
        data: {
          image,
          title,
          description,
          rating,
          isPublic: isPublic,
          ownerId: user.id,
        },
      });
      res.status(200).json(food);
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
