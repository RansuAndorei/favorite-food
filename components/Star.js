import { StarIcon as StartSolid } from "@heroicons/react/solid";
import { StarIcon as StarOutline } from "@heroicons/react/outline";

export const Star = ({ rating, size }) => {
  return (
    <div className="flex items-center justify-center border-black-800">
      {[...Array(5).keys()].map((index) => {
        if (rating - 1 >= index) {
          return (
            <StartSolid width={size} height={size} color="gold" key={index} />
          );
        } else {
          return (
            <StarOutline width={size} height={size} color="gray" key={index} />
          );
        }
      })}
    </div>
  );
};
