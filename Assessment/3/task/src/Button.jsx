import React from "react";

function CustomButton() {
  const handleClick = () => {
    console.log("Button clicked!");
  };
  return (
    <div>
      <button
        onClick={handleClick}
        className="bg-blue-500 text-orange-200 p-2 rounded hover:bg-blue-700 m-4"
      >
        Click Me!
      </button>
    </div>
  );
}

export default CustomButton;
