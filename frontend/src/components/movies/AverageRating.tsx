import React, { useEffect, useState } from "react";
import { getAverageRatingForShow } from "@/api/MovieAPI";

interface AverageRatingProps {
  showId: string;
}

const AverageRating: React.FC<AverageRatingProps> = ({ showId }) => {
  const [average, setAverage] = useState<number | null>(null);

  useEffect(() => {
    getAverageRatingForShow(showId).then(setAverage);
  }, [showId]);

  if (average === null) return null;

  return (
    <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
      <span>⭐ {average.toFixed(1)}</span>
    </div>
  );
};

export default AverageRating;
