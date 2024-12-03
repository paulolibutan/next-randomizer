"use client";

import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CsvUpload from "@/components/CsvUpload";
import RaffleList from "@/components/RaffleList";
import WinnerDisplay from "@/components/WinnerDisplay";

const Home: React.FC = () => {
  const [participants, setParticipants] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const drawInterval = useRef<number | null>(null);

  const addParticipants = (name: string) => {
    setParticipants((prev) => [...prev, name]);
  };

  const startDrawing = () => {
    if (!isDrawing && participants.length > 0) {
      setIsDrawing(true);
      drawInterval.current = window.setInterval(() => {
        const randomIndex = Math.floor(Math.random() * participants.length);
        setWinner(participants[randomIndex]);
      }, 100);
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      if (drawInterval.current) {
        clearInterval(drawInterval.current);
        drawInterval.current = null;
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <Card className="flex flex-col items-center p-10 shadow-md">
        <CardHeader>
          <CardTitle className="font-extrabold text-3xl text-emerald-500">
            Raffle Randomizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col item-center justify-center gap-3">
            <CsvUpload addParticipants={addParticipants} />
            <RaffleList participants={participants} />
            <WinnerDisplay
              winner={winner}
              startDrawing={startDrawing}
              stopDrawing={stopDrawing}
              isDrawing={isDrawing}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
