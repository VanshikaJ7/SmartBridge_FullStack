import React, { useState } from "react";

function TextUpdater() {
  const [text, setText] = useState("");
  return (
    <div className="p-4">
      <input
        type="text"
        className="border p-2 rounded bg-yellow-700 text-white"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type here"
      />
      <p className="decoration-black-500 mt-2">You typed: {text}</p>
    </div>
  );
}

export default TextUpdater;
