import React, { useContext, useState } from "react";
import {
  HomeIcon as HomeOutline,
  UserIcon as UserOutline,
  Cog6ToothIcon as CogOutline,
} from "@heroicons/react/24/outline";

import {
  HomeIcon as HomeSolid,
  UserIcon as UserSolid,
  Cog6ToothIcon as CogSolid,
} from "@heroicons/react/24/solid";
import { CiLogout } from "react-icons/ci";
import { AuthContext } from "../context/AuthContext";
import Modal from "./Modal";
type SidebarProps = {
  selected: string;
  onSelect: (name: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ selected, onSelect }) => {
  const menuItems = [
    {
      name: "Home",
      icon: <HomeOutline className="w-8 h-8 mr-2 text-black" />,
      activeIcon: <HomeSolid className="w-8 h-8 mr-2 text-purple-700" />,
    },
    {
      name: "Users",
      icon: <UserOutline className="w-8 h-8 mr-2 text-black" />,
      activeIcon: <UserSolid className="w-8 h-8 mr-2 text-purple-700" />,
    },
    {
      name: "Settings",
      icon: <CogOutline className="w-8 h-8 mr-2 text-black" />,
      activeIcon: <CogSolid className="w-8 h-8 mr-2 text-purple-700" />,
    },
  ];


  const {  logout } = useContext(AuthContext);
  const [isModalOpen, setModalOpen] = useState (false);

 const handleLogoutClick = () => {
    setModalOpen(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setModalOpen(false);
  };

  const handleCancelLogout = () => {
    setModalOpen(false);
  };


  return (
    <div className=" px-5 w-64 justify-between py-6 h-screen bg-white  flex flex-col">
      <Modal
        isOpen={isModalOpen}
        title="Confirm Logout"
        message="Do you really want to logout?"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
      <div className="flex flex-col">
        <div  className="flex  mb-6 items-center flex-row">
          <img
            className="h-10 cursor-pointer "
            src={
              "https://upload.wikimedia.org/wikipedia/commons/d/db/Zeronet_logo.png"
            }
          />
          <h1 className="text-2xl cursor-pointer font-bold text-gray-700">SAAS</h1>
        </div>
        <div>
          {menuItems.map((item) => (
            <button
              onClick={() => onSelect(item.name)}
              className={`flex transition-all hover:bg-purple-100 hover:scale-102 transform rounded-xl duration-300 ease-in-out text-black w-full ${
                selected === item.name ? "bg-gray-100 text-black " : "bg-white"
              } p-2 items-center cursor-pointer my-1`}
            >
              {" "}
              {selected === item.name ? item.activeIcon : item.icon} {item.name}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleLogoutClick} className="flex px-4 py-3 bg-red-50 cursor-pointer hover:bg-red-100 transition-all hover:scale-102 rounded-xl items-center flex-row">
        <CiLogout color="red" />
        <h1 className="text-xl ml-3 text-red-400">Logout</h1>
      </button>
    </div>
  );
};

export default Sidebar;
