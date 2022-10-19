import PropTypes from "prop-types";
import Card from "../Card/Card";
import { ExclamationIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import axios from "axios";

const Grid = ({ foods = [], session = {} }) => {
  const isEmpty = foods.length === 0;
  const [favorites, setFavorites] = useState([]);

  return isEmpty ? (
    <p className="inline-flex items-center px-4 py-2 space-x-1 rounded-md text-amber-700 bg-amber-100 max-w-max">
      <ExclamationIcon className="w-5 h-5 mt-px shrink-0" />
      <span>Unfortunately, there is nothing to display yet.</span>
    </p>
  ) : (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {foods.map((food, index) => (
        <Card name={food.title} key={index} />
      ))}
    </div>
  );
};

Grid.propTypes = {
  foods: PropTypes.array,
};

export default Grid;
