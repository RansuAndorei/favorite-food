import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";
import { HeartIcon } from "@heroicons/react/solid";
import { Star } from "../components/Star";
import { useSession } from "next-auth/react";

const Card = ({
  id = "",
  image = "",
  title = "",
  rating = 1,
  favorite = false,
  onClickFavorite = () => null,
}) => {
  const { data: session } = useSession();

  return (
    <Link href={`/foods/${id}`}>
      <a className="block w-full">
        <div className="relative">
          <div className="overflow-hidden bg-gray-200 rounded-lg shadow aspect-w-16 aspect-h-9">
            {image ? (
              <Image
                src={image}
                alt={title}
                layout="fill"
                objectFit="cover"
                className="transition hover:opacity-80"
              />
            ) : null}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (typeof onClickFavorite === "function") {
                onClickFavorite(id);
              }
            }}
            className="absolute top-2 right-2"
          >
            {session && (
              <HeartIcon
                className={`w-7 h-7 drop-shadow-lg transition ${
                  favorite ? "text-red-500" : "text-white"
                }`}
              />
            )}
          </button>
        </div>
        <div className="flex flex-wrap items-center w-full mt-2 font-semibold leading-tight text-gray-700">
          {title ?? ""}
          <span className="ml-2">
            <Star rating={rating} size={20} />
          </span>
        </div>
        <p className="mt-2"></p>
      </a>
    </Link>
  );
};

Card.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  guests: PropTypes.number,
  beds: PropTypes.number,
  baths: PropTypes.number,
  price: PropTypes.number,
  favorite: PropTypes.bool,
  onClickFavorite: PropTypes.func,
};

export default Card;
