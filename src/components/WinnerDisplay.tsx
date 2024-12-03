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
    <div>
      <h3>Winner</h3>
      {winner ? <p>{winner}</p> : <p>No winner yet.</p>}
      <div className="flex flex-row gap-5 w-full">
        <Button className="w-full" onClick={startDrawing} disabled={isDrawing}>
          Start Draw
        </Button>
        <Button className="w-full" onClick={stopDrawing} disabled={!isDrawing}>
          Stop Draw
        </Button>
      </div>
    </div>
  );
};

export default WinnerDisplay;
