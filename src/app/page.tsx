/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WinnerDisplay from "@/components/WinnerDisplay";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Loading from "@/components/Loading";
import { Bounce, toast } from "react-toastify";

type Participant = {
  _id: string; // MongoDB ObjectId
  name: string;
  emp_id: string;
};

const Home: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // For confetti animation
  const [showConfetti, setShowConfetti] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const drawInterval = useRef<number | null>(null);
  const currentWinnerRef = useRef<any | null>(null);

  const pickWinner = () => {
    startDrawing(); // Start the drawing
    console.log("Starting the drawing...");

    // Stop the drawing automatically after 10 seconds
    setTimeout(() => {
      console.log("Stopping the drawing after 10 seconds...");
      stopDrawing();
    }, 10000); // 10,000ms = 10 seconds
  };

  const startDrawing = async () => {
    if (participants.length === 0) {
      toast.warn("No participants available for the draw.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (!isDrawing && participants.length > 0) {
      setIsDrawing(true);
      drawInterval.current = window.setInterval(() => {
        const randomIndex = Math.floor(Math.random() * participants.length);
        setWinner(participants[randomIndex].name);
        currentWinnerRef.current = participants[randomIndex];
      }, 10);
    }
  };

  const stopDrawing = async () => {
    if (participants.length === 0) return;

    const finalWinner = currentWinnerRef.current;

    console.log("Attempting to stop the drawing...");

    if (process.env.NEXT_PUBLIC_RAFFLE_MODE !== "Automatic") {
      if (!isDrawing || !finalWinner) {
        console.log("Either not drawing or no current winner.");
        return;
      }
    }
    setIsDrawing(false);

    if (drawInterval.current) {
      clearInterval(drawInterval.current);
      drawInterval.current = null;
      console.log("Interval cleared.");
    }

    try {
      const response = await fetch("/api/winners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winner: finalWinner }),
      });

      if (!response.ok) {
        throw new Error("Failed to save winner");
      }

      // Update state
      setParticipants((prevParticipants) =>
        prevParticipants.filter(
          (participant) => participant._id !== finalWinner._id
        )
      );

      setWinners((prevWinners) => [...prevWinners, finalWinner]);
      toast.success(`🎉 Winner: ${finalWinner.name} has been saved!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      // Clear the current winner
      currentWinnerRef.current = null; // Clear the reference

      // Start animation and stop after 10 seconds
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 10000);

      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false); // Stop confetti after 5 seconds
      }, 10000);
    } catch (error: any) {
      console.error("Error saving winner:", error);
      toast.error("An error occurred while saving the winner.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const deleteAllWinners = async () => {
    try {
      const response = await fetch("/api/winners", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete all winners");
      }

      // Clear the winners list locally
      setWinners([]);
      toast.success("All winners have been deleted.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error: any) {
      console.error("Error deleting all winners:", error);
      toast.error("An error occurred while deleting all winners.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const titleCase = (str: any) => {
    str = str.toLowerCase().split(" ");
    for (let i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(" ");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const participantsResponse = await fetch("/api/participants");
        const winnersResponse = await fetch("/api/winners");

        if (!participantsResponse.ok || !winnersResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const participantsData = await participantsResponse.json();
        const winnersData = await winnersResponse.json();

        setParticipants(participantsData.participants || []);
        setWinners(winnersData.winners || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error)
    return <p className="text-center mt-5 sm:mt-20 text-2xl">Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 m-10 items-center justify-center">
      <Card>
        <CardHeader className="bg-sky-500 rounded-t-lg">
          <CardTitle className="text-center text-2xl sm:text-3xl text-white">
            {process.env.NEXT_PUBLIC_RAFFLE_TITLE}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center mt-5">
          {loading ? (
            <Loading />
          ) : (
            <div>
              <WinnerDisplay
                winner={winner}
                isDrawing={isDrawing}
                startDrawing={startDrawing}
                stopDrawing={stopDrawing}
                pickWinner={pickWinner}
                isAnimating={isAnimating}
                showConfetti={showConfetti}
              />
              <div className="flex flex-col items-center justify-center mt-10">
                <h3 className="text-3xl font-bold">List of Winners</h3>
                <ul className="mt-3 text-2xl list-decimal text-start  ">
                  {winners.length > 0 ? (
                    winners.map((winner) => (
                      <li key={winner._id}>
                        {winner.emp_id} - {titleCase(winner.name)}
                      </li>
                    ))
                  ) : (
                    <p>No winners selected. Please start the draw.</p>
                  )}
                </ul>
                <div className="mt-10 flex flex-col sm:flex-row gap-5 w-full sm:w-auto items-center justify-center">
                  <Link href={"/participants"}>
                    <Button className="w-full min-w-40">Go Participants</Button>
                  </Link>
                  <Button
                    className="w-full min-w-40"
                    onClick={deleteAllWinners}
                  >
                    Reset Winners
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
