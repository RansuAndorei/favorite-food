import { getSession } from "next-auth/react";
import Layout from "@/components/Layout";
import Grid from "@/components/Grid";
import { prisma } from "@/lib/prisma";

export async function getServerSideProps(context) {
  // Check if user is authenticated
  const session = await getSession(context);

  // If not, redirect to the homepage
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const favoriteFoods = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      food: true,
    },
  });

  // Pass the data to the Foods component
  return {
    props: {
      foods: JSON.parse(
        JSON.stringify(favoriteFoods.map((favorite) => favorite.food))
      ),
    },
  };
}

const Favorites = ({ foods = [] }) => {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">Your Favorites</h1>
      <p className="text-gray-500">
        Manage your Favorite Foods and update your favorites
      </p>
      <div className="mt-8">
        <Grid foods={foods} />
      </div>
    </Layout>
  );
};

export default Favorites;
