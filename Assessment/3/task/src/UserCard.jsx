import React from "react";

function UserCard({ name, email }) {
  return (
    <div className="bg-yellow-200 p-4 rounded shadow-md w-80 m-4">
      <h2 className="text-lg font-bold text-blue-500">{name}</h2>
      <p className="text-gray-600">{email}</p>
    </div>
  );
}

export default UserCard;
