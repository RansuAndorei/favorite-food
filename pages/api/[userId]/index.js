import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const { userId } = req.query;

  if (req.method === "PATCH") {
    try {
      const { name, username, password } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          username,
          password,
        },
      });
      res.status(200).json(user);
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
