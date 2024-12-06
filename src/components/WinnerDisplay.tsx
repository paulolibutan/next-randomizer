import React from "react";
import { Button } from "./ui/button";

interface WinnerDisplayProps {
  winner: string | null;
  isDrawing: boolean;
  startDrawing: () => void;
  stopDrawing: () => void;
  pickWinner: () => void;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({
  winner,
  isDrawing,
  startDrawing,
  stopDrawing,
  pickWinner,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <h3 className="text-center font-bold text-3xl">Winner:</h3>
      <div className="text-6xl sm:text-7xl  font-bold">
        {winner ? <p>{winner}</p> : <p>No winner yet.</p>}
      </div>
      <div className="flex flex-col sm:flex-row gap-5 mt-5 w-full sm:w-auto">
        <Button
          className={`w-full bg-orange-500 min-w-40 ${
            process.env.NEXT_PUBLIC_RAFFLE_MODE === "Automatic" && "hidden"
          }`}
          onClick={startDrawing}
          disabled={isDrawing}
        >
          Start Draw
        </Button>
        <Button
          className={`w-full bg-blue-950 min-w-40 ${
            process.env.NEXT_PUBLIC_RAFFLE_MODE === "Automatic" && "hidden"
          }`}
          onClick={stopDrawing}
          disabled={!isDrawing}
        >
          Stop Draw
        </Button>
        <Button
          className={`w-full bg-orange-500 min-w-40 ${
            process.env.NEXT_PUBLIC_RAFFLE_MODE === "Manual" && "hidden"
          }`}
          onClick={pickWinner}
          disabled={isDrawing}
        >
          Start Draw
        </Button>
      </div>
    </div>
  );
};

export default WinnerDisplay;
