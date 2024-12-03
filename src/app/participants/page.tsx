/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import CsvUpload from "@/components/CsvUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Participant = {
  name: string;
  _id: string;
};

const ParticipantsPage: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleUploadComplete = (response: any) => {
    if (response.error) {
      setStatusMessage(`Error: ${response.message}`);
    } else {
      setStatusMessage(
        `${response.message}. ${
          response.result?.insertedCount || 0
        } participants added.`
      );
      window.location.reload();
    }
  };

  const handleDeleteAll = async () => {
    const confirmation = confirm(
      "Are you sure you want to delete all participants?"
    );
    if (!confirmation) return;

    setDeleting(true);

    try {
      const response = await fetch("/api/participants", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete participants");
      }

      const data = await response.json();
      alert(`Deleted ${data.deletedCount} participants.`);
      window.location.reload();
    } catch (error: any) {
      console.error("Error deleting participants:", error);
      alert("An error occurred while deleting participants.");
    } finally {
      setDeleting(false);
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
        setParticipants(data.participants);
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
    <div className="flex flex-row items-center justify-center text-start mt-10">
      <Card className="p-5">
        <CardHeader>
          <CardTitle>
            <div className="grid grid-rows-2 items-center justify-start gap-5">
              <div>
                <CsvUpload onUploadComplete={handleUploadComplete} />
                {statusMessage && <p>{statusMessage}</p>}
              </div>
              <div className="flex flex-rows items-center justify-center gap-5">
                <Button
                  onClick={handleDeleteAll}
                  className="hover:bg-orange-600"
                >
                  {deleting
                    ? "Deleting Participants..."
                    : "Delete All Participants"}
                </Button>
                <Link className="underline hover:text-orange-500" href={"/"}>
                  Go back to Home Page
                </Link>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h1 className="font-bold text-2xl mb-5">List of Participants</h1>
          {participants.length > 0 ? (
            <ul className="grid grid-cols-4">
              {participants.map((participant) => (
                <li key={participant._id}>{participant.name}</li>
              ))}
            </ul>
          ) : (
            <p>No participants found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ParticipantsPage;
