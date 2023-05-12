import React from "react";

import { UilMoon, UilSun } from "@iconscout/react-unicons";
import "../../App.css";

const DarkModeToggle = (props) => {
  return (
    <div className="flex items-center">
      <div className="ml-auto">
        <button
          className={`
        flex items-center justify-center w-10 h-10 rounded-full focus:outline-none transition-colors duration-300 ${
          props.isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-300"
        }`}
          onClick={props.handleDarkModeToggle}
        >
          {props.isDarkMode ? (
            <UilMoon fill="#FFFFFF" className="w-5 h-5 text-gray-800" />
          ) : (
            <UilSun fill="#ddddd" className="w-5 h-5 text-gray-200" />
          )}
        </button>
      </div>
    </div>
  );
};

export default DarkModeToggle;
