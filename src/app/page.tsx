/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RaffleList from "@/components/RaffleList";
import WinnerDisplay from "@/components/WinnerDisplay";

type Participant = {
  _id: string; // MongoDB ObjectId
  name: string;
};

const Home: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const drawInterval = useRef<number | null>(null);

  const startDrawing = () => {
    if (participants.length < 1) {
      alert("No participants uploaded.");
    }
    if (!isDrawing && participants.length > 0) {
      setIsDrawing(true);
      drawInterval.current = window.setInterval(() => {
        const randomIndex = Math.floor(Math.random() * participants.length);
        setWinner(participants[randomIndex].name);
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

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch("/api/participants");
        if (!response.ok) {
          throw new Error("Failed to fetch participants");
        }
        const data = await response.json();
        setParticipants(data.participants || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-2xl">Loading participants...</p>
    );
  if (error)
    return <p className="text-center mt-10 text-2xl">Error: {error}</p>;

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-40">
      <Card className="flex flex-col items-center shadow-md w-full h-full border-b-orange-500 border-b-8">
        <CardHeader className="bg-sky-500 w-full rounded-t-lg">
          <CardTitle className="font-bold text-5xl text-white text-center">
            {process.env.NEXT_PUBLIC_RAFFLE_TITLE}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10">
          <div className="flex flex-col item-center justify-center gap-3">
            <WinnerDisplay
              winner={winner}
              startDrawing={startDrawing}
              stopDrawing={stopDrawing}
              isDrawing={isDrawing}
            />
            <RaffleList />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
