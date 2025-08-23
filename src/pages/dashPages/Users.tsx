import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";




const Users = () => {
const {user} = useContext(AuthContext)

  return (
    <div className="bg-white shadow rounded p-6">
      <h2 className="text-xl font-bold mb-4">Users List</h2>
      <button onClick={()=>{
            console.log(JSON.parse(localStorage.getItem('user')))
      }}  >
        click
      </button>
    </div>
  );
};

export default Users;
