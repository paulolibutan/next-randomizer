/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Papa from "papaparse";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface CsvUploadProps {
  onUploadComplete: (response: any) => void;
}

interface CsvUploadType {
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
            const names = result.data.map((row) => row.name);

            try {
              const response = await fetch("/api/participants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ participants: names }),
              });

              if (response.ok) {
                const result = await response.json();
                onUploadComplete(result);
                alert("Participants uploaded successfully!");
              } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
              }
            } catch (error) {
              console.error("Error uploading participants:", error);
              alert("An error occurred while uploading participants.");
            }
          }
        },
      });
  };
  return (
    <div className="flex flex-col items-start justify-center gap-3">
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
