import React from "react";
import HashLoader from "react-spinners/HashLoader";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <HashLoader color={"#FF7900"} />
    </div>
  );
};

export default Loading;
