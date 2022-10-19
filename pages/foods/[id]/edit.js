// pages/foods/[id]/edit.js
import Layout from "@/components/Layout";
import ListingForm from "@/components/ListingForm";
import { getSession } from "next-auth/react";
import axios from "axios";
import { prisma } from "@/lib/prisma";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const redirect = {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };

  // Check if the user is authenticated
  if (!session) {
    return redirect;
  }

  // Retrieve the authenticated user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { listedFoods: true },
  });

  // Check if authenticated user is the owner of this food
  const id = context.params.id;
  const food = user?.listedFoods?.find((food) => food.id === id);
  if (!food) {
    return redirect;
  }

  return {
    props: JSON.parse(JSON.stringify(food)),
  };
}

const Edit = (food = null) => {
  const handleOnSubmit = (data) => axios.patch(`/api/foods/${food.id}`, data);

  return (
    <Layout>
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-xl font-medium text-gray-800">
          Edit your Favorite Food
        </h1>
        <p className="text-gray-500">
          Fill out the form below to update your Favorite food.
        </p>
        <div className="mt-8">
          {food ? (
            <ListingForm
              initialValues={food}
              buttonText="Update food"
              redirectPath={`/foods/${food.id}`}
              onSubmit={handleOnSubmit}
            />
          ) : null}
        </div>
      </div>
    </Layout>
  );
};

export default Edit;
