import { getSession } from "next-auth/react";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { listedFoods: true },
  });

  const { id } = req.query;
  if (!user?.listedFoods?.find((food) => food.id === id)) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  if (req.method === "PATCH") {
    try {
      const food = await prisma.food.update({
        where: { id },
        data: req.body,
      });
      res.status(200).json(food);
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.favorite.deleteMany({
        where: {
          foodId: id,
        },
      });

      const food = await prisma.food.delete({
        where: { id },
      });

      if (food.image) {
        const path = food.image.split(`${process.env.SUPABASE_BUCKET}/`)?.[1];
        await supabase.storage.from(process.env.SUPABASE_BUCKET).remove([path]);
      }

      res.status(200).json(food);
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["PATCH"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
