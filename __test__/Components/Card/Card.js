import Image from "next/image";
import React from "react";

const Card = ({ name }) => {
  return (
    <div className="w-100">
      <a className="block w-full">
        <div className="relative">
          <div className="overflow-hidden bg-gray-200 rounded-lg shadow aspect-w-16 aspect-h-9">
            <Image
              src={
                "https://cmxohivoakygaalicrhd.supabase.in/storage/v1/object/public/favoritefoods/VOeLEgpf1An_l0pK_JXDY.jpeg"
              }
              alt={name}
              layout="fill"
              objectFit="cover"
              className="transition hover:opacity-80"
              data-testid="cardImage"
            />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              console.log("CLICKED");
            }}
            className="absolute top-2 right-2"
          >
            {/* {session && (
            <HeartIcon
              className={`w-7 h-7 drop-shadow-lg transition ${
                favorite ? "text-red-500" : "text-white"
              }`}
            />
          )} */}
          </button>
        </div>
        <div className="flex flex-wrap items-center w-full mt-2 font-semibold leading-tight text-gray-700">
          <p data-testid="cardTitle">{name}</p>
          <span className="ml-2">
            <Star rating={4} size={20} />
          </span>
        </div>
        <p className="mt-2"></p>
      </a>
    </div>
  );
};

import { StarIcon as StartSolid } from "@heroicons/react/solid";
import { StarIcon as StarOutline } from "@heroicons/react/outline";

const Star = ({ rating, size }) => {
  let solid = 0;
  let outline = 0;
  return (
    <div className="flex items-center justify-center border-black-800">
      {[...Array(5).keys()].map((index) => {
        if (rating - 1 >= index) {
          solid += 1;
          return (
            <StartSolid
              width={size}
              height={size}
              color="gold"
              key={index}
              data-testid={`solidStar${solid}`}
            />
          );
        } else {
          outline += 1;
          return (
            <StarOutline
              width={size}
              height={size}
              color="gray"
              key={index}
              data-testid={`outlineStar${outline}`}
            />
          );
        }
      })}
    </div>
  );
};

export default Card;
