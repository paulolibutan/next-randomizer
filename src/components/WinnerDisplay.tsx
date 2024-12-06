import React from "react";
import { Button } from "./ui/button";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface WinnerDisplayProps {
  winner: string | null;
  isDrawing: boolean;
  startDrawing: () => void;
  stopDrawing: () => void;
  pickWinner: () => void;
  isAnimating: boolean;
  showConfetti: boolean;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({
  winner,
  isDrawing,
  startDrawing,
  stopDrawing,
  pickWinner,
  isAnimating,
  showConfetti,
}) => {
  const { width, height } = useWindowSize(); // For confetti to cover the entire screen

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      {showConfetti && <Confetti width={width} height={height} />}
      <h3 className="text-center font-bold text-3xl">Winner:</h3>
      <div
        className={`text-6xl sm:text-7xl  font-bold ${
          isAnimating && "zoom-winner"
        }`}
      >
        {winner ? <p>{winner.toUpperCase()}</p> : <p>No winner yet.</p>}
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
