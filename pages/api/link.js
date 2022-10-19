import { prisma } from "@/lib/prisma";

// GET
// PATCH

const handle = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { email } = req.query;
      const link = await prisma.link.findFirst({
        where: {
          email: `${email}`,
        },
        rejectOnNotFound: false,
      });
      res.status(200).json(link);
    } catch (e) {
      res.status(500).send({ message: "Internal server error." });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      const link = await prisma.link.delete({
        where: {
          linkId: Number(`${id}`),
        },
      });
      res.status(200).json(link);
    } catch {
      res.status(500).send({ message: "Internal server error." });
    }
  }
};
export default handle;
