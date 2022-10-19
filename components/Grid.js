import PropTypes from "prop-types";
import Card from "../components/Card";
import { ExclamationIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const Grid = ({ foods = [] }) => {
  const isEmpty = foods.length === 0;
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (session) {
      (async () => {
        const favoriteList = (
          await axios.get(`/api/${session.user?.id}/favorites`)
        ).data;
        setFavorites(favoriteList.map((favorite) => favorite.foodId));
      })();
    }
  }, [session]);

  const toggleFavorite = async (id) => {
    if (favorites.includes(id)) {
      setFavorites((prev) => prev.filter((prev) => prev !== id));
      await axios.delete(`/api/${session.user.id}/favorites`, {
        data: { deleteId: id },
      });
    } else {
      setFavorites((prev) => [...prev, id]);
      await axios.post(`/api/${session.user.id}/favorites`, { addId: id });
    }
  };

  return isEmpty ? (
    <p className="inline-flex items-center px-4 py-2 space-x-1 rounded-md text-amber-700 bg-amber-100 max-w-max">
      <ExclamationIcon className="w-5 h-5 mt-px shrink-0" />
      <span>Unfortunately, there is nothing to display yet.</span>
    </p>
  ) : (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {foods.map((food) => (
        <Card
          key={food.id}
          {...food}
          onClickFavorite={toggleFavorite}
          favorite={!!favorites.includes(food.id)}
        />
      ))}
    </div>
  );
};

Grid.propTypes = {
  foods: PropTypes.array,
};

export default Grid;
