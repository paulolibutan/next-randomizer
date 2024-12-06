/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Papa from "papaparse";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Bounce, toast } from "react-toastify";

interface CsvUploadProps {
  onUploadComplete: (response: any) => void;
}

interface CsvUploadType {
  emp_id: string;
  name: string;
}

const CsvUpload: React.FC<CsvUploadProps> = ({ onUploadComplete }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file)
      Papa.parse<CsvUploadType>(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
          if (result) {
            const participants = result.data.map((row) => ({
              emp_id: row.emp_id.trim(),
              name: row.name.trim(),
            }));

            try {
              const response = await fetch("/api/participants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ participants }),
              });

              if (response.ok) {
                const result = await response.json();
                onUploadComplete(result);
                toast.success("Participants uploaded successfully!", {
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
              } else {
                const errorData = await response.json();
                toast.error(`Error: ${errorData.message}`, {
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
            } catch (error) {
              console.error("Error uploading participants:", error);
              toast.error("An error occurred while uploading participants.", {
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
          }
        },
      });
  };
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-3">
      <Label htmlFor="upload" className="text-slate-800 font-bold">
        Upload Participants (.csv)
      </Label>
      <Input
        id="upload"
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default CsvUpload;
