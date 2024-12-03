import Link from "next/link";
import React from "react";

const RaffleList: React.FC = () => {
  return (
    <>
      <div className="text-center font-bold text-2xl mt-5 underline">
        <Link href={"/participants"}>View or Update Participants</Link>
      </div>
    </>
  );
};

export default RaffleList;
