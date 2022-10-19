import Layout from "@/components/Layout";
import Grid from "@/components/Grid";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  // Get all foods
  const session = await getSession(context);

  const foods = await prisma.food.findMany({
    where: { ownerId: session.user.id },
  });
  // Pass the data to the Home page
  return {
    props: {
      foods: JSON.parse(JSON.stringify(foods)),
    },
  };
}

export default function Food({ foods = [] }) {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">
        Top-rated foods to eat
      </h1>
      <p className="text-gray-500">
        Explore some of the best foods in the world
      </p>
      <div className="mt-8">
        <Grid foods={foods} />
      </div>
    </Layout>
  );
}
