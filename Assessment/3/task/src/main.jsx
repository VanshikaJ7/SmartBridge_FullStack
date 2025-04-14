import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import Button from "./Button.jsx";
import "./index.css";
import LoginForm from "./LoginForm.jsx";
import FormSubmit from "./FormSubmit.jsx";
import TextUpdater from "./TextUpdater.jsx";
import UserCard from "./UserCard.jsx";

function App() {
  const [currentPage, setCurrentPage] = useState("textUpdater");

  const renderPage = () => {
    switch (currentPage) {
      case "textUpdater":
        return <TextUpdater />;
      case "FormSubmit":
        return <FormSubmit />;
      case "userCard":
        return (
          <UserCard
            name="Jai Vadula"
            email="jai.vadula2021@vitbhopal.ac.in"
          />
        );
      case "Button":
        return <Button />;
      case "loginForm":
        return <LoginForm />;
      default:
        return <TextUpdater />;
    }
  };

  return (
    <StrictMode>
      <div className="bg-blue-400 decoration-black w-full h-screen absolute top-0 left-0">
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 m-5"
          onClick={() => setCurrentPage("textUpdater")}
        >
          TextUpdater
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 m-5"
          onClick={() => setCurrentPage("FormSubmit")}
        >
          FormSubmit
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 m-5"
          onClick={() => setCurrentPage("userCard")}
        >
          UserCard
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 m-5"
          onClick={() => setCurrentPage("Button")}
        >
          Button
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 m-5"
          onClick={() => setCurrentPage("loginForm")}
        >
          LoginForm
        </button>
        {renderPage()}
      </div>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<App />);
