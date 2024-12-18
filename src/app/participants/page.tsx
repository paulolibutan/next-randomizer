/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import CsvUpload from "@/components/CsvUpload";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";

type Participant = {
  name: string;
  _id: string;
  emp_id: string;
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
      fetchParticipants();
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
      toast.success(`Deleted ${data.deletedCount} participants.`, {
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
      fetchParticipants();
    } catch (error: any) {
      console.error("Error deleting participants:", error);
      toast.error("An error occurred while deleting participants.", {
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
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

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

  if (error)
    return <p className="text-center mt-10 text-2xl">Error: {error}</p>;

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
              <div className="flex flex-row items-center justify-center mt-10">
                <Card className="flex flex-col gap-5 items-center justify-center p-10 sm:w-[60%]">
                  <div className="flex flex-col sm:flex-row gap-5 w-full items-center justify-center">
                    <Button className="w-full sm:w-auto sm:min-w-56">
                      <Link className="w-full" href={"/"}>
                        Go back to home page
                      </Link>
                    </Button>

                    <Button
                      className="w-full sm:w-auto sm:min-w-56"
                      onClick={handleDeleteAll}
                    >
                      {deleting
                        ? "Deleting participants..."
                        : "Delete All Participants"}
                    </Button>
                  </div>
                  <CsvUpload onUploadComplete={handleUploadComplete} />
                  {statusMessage && <p>{statusMessage}</p>}
                </Card>
              </div>
              <div className="mt-10 flex flex-row items-center justify-center">
                <Card className="p-10 sm:w-[60%]">
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center">
                            Unique ID
                          </TableHead>
                          <TableHead className="text-center">
                            Employee ID
                          </TableHead>
                          <TableHead className="text-center">
                            Full Name
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {participants.map((participant) => (
                          <TableRow key={participant._id}>
                            <TableCell className="font-medium">
                              {participant._id}
                            </TableCell>
                            <TableCell className="font-medium">
                              {participant.emp_id}
                            </TableCell>
                            <TableCell className="font-medium">
                              {participant.name}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ParticipantsPage;
