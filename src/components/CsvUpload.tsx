import React from "react";
import Papa from "papaparse";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface CsvUploadProps {
  addParticipants: (names: string) => void;
}

interface CsvUploadType {
  name: string;
}

const CsvUpload: React.FC<CsvUploadProps> = ({ addParticipants }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file)
      Papa.parse<CsvUploadType>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result) {
            result.data.map((row) => addParticipants(row.name));
          }
        },
      });
  };
  return (
    <div className="flex flex-col items-start justify-center gap-3">
      <Label htmlFor="upload" className="text-slate-800">
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
