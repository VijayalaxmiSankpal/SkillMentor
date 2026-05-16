import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

function RatingStars(props) {
  const rating = props.rating || 0;
  const maxStars = props.maxStars || 5;
  const size = props.size || 16;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(function (star) {
        if (star <= rating) {
          return <FaStar key={star} size={size} className="text-amber-400" />;
        } else if (star - 0.5 <= rating) {
          return (
            <div key={star} className="relative" style={{ width: size, height: size }}>
              <FaRegStar size={size} className="text-gray-600 absolute inset-0" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                <FaStar size={size} className="text-amber-400" />
              </div>
            </div>
          );
        } else {
          return <FaRegStar key={star} size={size} className="text-gray-600" />;
        }
      })}
    </div>
  );
}

export default RatingStars;