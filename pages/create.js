import Layout from "@/components/Layout";
import ListingForm from "@/components/ListingForm";
import axios from "axios";
import { getSession } from "next-auth/react";

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

  return {
    props: {},
  };
}

const Create = () => {
  const addFood = (data) => axios.post("/api/foods", data);

  return (
    <Layout>
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-xl font-medium text-gray-800">
          List your Favorite Food
        </h1>
        <p className="text-gray-500">
          Fill out the form below to list a new Favorite Food.
        </p>
        <div className="mt-8">
          <ListingForm
            buttonText="Add food"
            redirectPath="/"
            onSubmit={addFood}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Create;
