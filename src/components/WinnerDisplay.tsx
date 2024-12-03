import React from "react";
import { Button } from "./ui/button";

interface WinnerDisplayProps {
  winner: string | null;
  isDrawing: boolean;
  startDrawing: () => void;
  stopDrawing: () => void;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({
  winner,
  isDrawing,
  startDrawing,
  stopDrawing,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <h3 className="text-center font-bold text-4xl">Winner:</h3>
      <div className="text-7xl font-bold">
        {winner ? <p>{winner}</p> : <p>No winner yet.</p>}
      </div>
      <div className="grid grid-cols-2 gap-5 mt-5">
        <Button
          className="w-full min-w-64 bg-orange-400"
          onClick={startDrawing}
          disabled={isDrawing}
        >
          Start Draw
        </Button>
        <Button
          className="w-full min-w-64 bg-blue-950"
          onClick={stopDrawing}
          disabled={!isDrawing}
        >
          Stop Draw
        </Button>
      </div>
    </div>
  );
};

export default WinnerDisplay;
