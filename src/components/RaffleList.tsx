import React from "react";

interface RaffleListProps {
  participants: string[];
}

const RaffleList: React.FC<RaffleListProps> = ({ participants }) => {
  return (
    <>
      <h3 className="text-center font-bold text-2xl">Participants</h3>
      <ul>
        {participants.map((participant, index) => (
          <li key={index}>{participant}</li>
        ))}
      </ul>
    </>
  );
};

export default RaffleList;
