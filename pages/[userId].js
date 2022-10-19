import Layout from "@/components/Layout";
import Grid from "@/components/Grid";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

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

  if (session.user.id === context.params.userId) {
    return {
      redirect: {
        destination: "/my-foods",
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: context.params.userId },
    include: {
      listedFoods: {
        where: { isPublic: true },
      },
    },
  });

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Pass the data to the Foods component
  return {
    props: {
      foods: JSON.parse(JSON.stringify(user.listedFoods)),
      user: JSON.parse(JSON.stringify(user)),
    },
  };
}

const Foods = ({ foods = [], user = {} }) => {
  return (
    <Layout>
      <div className="flex items-center w-full gap-5 mt-5 cursor-pointer">
        {user.image ? (
          <div className="w-10 h-10 ml-2 overflow-hidden rounded-full">
            <Image
              src={user.image}
              alt={user.name || "Avatar"}
              layout="responsive"
              width={10}
              height={10}
              objectFit="contain"
            />
          </div>
        ) : (
          <UserIcon className="w-6 h-6 text-gray-400" />
        )}
        <h1 className="text-xl font-medium text-gray-800">{user.name}</h1>
      </div>

      <p className="mt-5 text-gray-500">Listed Foods</p>
      <div className="mt-8">
        <Grid foods={foods} />
      </div>
    </Layout>
  );
};

export default Foods;
