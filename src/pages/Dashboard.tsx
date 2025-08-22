import React, { useState } from "react";
import Home from "./dashPages/Home";
import Settings from "./dashPages/Settings";
import Users from "./dashPages/Users";
import Sidebar from "../components/Sidebar";
import { GoBell } from "react-icons/go";
const Dashboard = () => {
  const [selected, setSelected] = useState("Home");

  const renderContent = () => {
    switch (selected) {
      case "Home":
        return <Home />;
      case "Users":
        return <Users />;
      case "Settings":
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen ">
      <Sidebar selected={selected} onSelect={setSelected} />
      <div className="flex-1 rounded-4xl m-2 overflow-y-auto  p-6 bg-gray-100 ">
        <div className="mb-6 rounded-full flex items-center justify-between px-10">
          <h1 className="text-3xl font-medium">{selected}</h1>
          <div className="bg-white px-4 py-2 w-60 rounded-full flex items-center justify-between shadow">
            {/* Bell with badge */}
            <div className=" rounded-full hover:bg-gray-300 transition-all duration-300 cursor-pointer p-1 relative">
              <GoBell size={26} />

              {/* Badge */}
              <div className="absolute -top-1 -right-1 bg-red-600 w-4 h-4 rounded-full flex items-center justify-center text-xs text-white">
                2
              </div>
            </div>

            {/* Divider */}
            <div className="border-l h-6 border-gray-300 mx-2"></div>

            {/* User Info */}
            <h1 className="text-sm font-medium">John Brun</h1>
            <img
              className="rounded-full cursor-pointer hover:scale-105 transition-all duration-300 w-10 h-10 object-cover"
              src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg"
              alt="Profile"
            />
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
