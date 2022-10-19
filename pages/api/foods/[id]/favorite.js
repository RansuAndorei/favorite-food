import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  // TODO: Retrieve food ID from request
  const { id } = req.query;

  // TODO: Add food to favorite
  if (req.method === "PUT") {
    const favorite = await prisma.food.update({
      data: {
        favoriteUser: { push: id },
      },
      where: {
        id: id,
      },
    });
    res.status(200).json(favorite);
  }
  // TODO: Remove food from favorite
  else if (req.method === "DELETE") {
    const favoriteList = await prisma.food.findUnique({
      where: {
        id: id,
      },
      select: {
        favoriteList: true,
      },
    });

    const newFavoriteList = favoriteList.filter((favorite) => favorite !== id);
    const favorite = await prisma.food.update({
      data: {
        favoriteUser: newFavoriteList,
      },
      where: {
        id: id,
      },
    });
    res.status(200).json(favorite);
  }
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
