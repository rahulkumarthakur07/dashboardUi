import React, { useContext, useState } from "react";
import colors from "../../constants/Colors";
import { IoIosLock } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";



type LoginProps = {
  switchToRegister: () => void;
};
const Login: React.FC<LoginProps> = ({switchToRegister}) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const {setUser} = useContext(AuthContext)
  const [errors, setErrors] = useState<string[]>([]);



const loginUser = async ()=>{
  try {
    const res = await API.post("/auth/login", {
      email,
      password,
    });

    // Save token to localStorage
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user)
console.log("logged in") // redirect
  } catch (err) {
    console.error(err.response?.data);
    alert(err.response?.data?.message || "Login failed");
  }
}



  const handleRegister = () => {
    const newErrors: string[] = [];


    // Email validation
    if (!email.trim()) newErrors.push("Email is required.");
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.push("Email is invalid.");

    // Password validation
    if (!password) newErrors.push("Password is required.");
    else if (password.length < 6)
      newErrors.push("Password must be at least 6 characters.");
    setErrors(newErrors);

    if (newErrors.length === 0) {
      console.log("Email:", email);
      console.log("Password:", password);
    
      

loginUser()


    } else {
      console.log("Errors:", newErrors);
    }
  };

  return (
    <div
      style={{ backgroundColor: colors.neutral.grayLight }}
      className="h-lvh w-lvw flex items-center justify-center"
    >
      <div className="w-full md:w-7/12 bg-white shadow-md p-4 h-10/12 flex flex-row flex-wrap rounded-4xl">
        {/* Form Section */}
        <div className="flex justify-center py-10 rounded-xl flex-1 h-full w-full md:w-auto">
          <div className="w-full md:w-3/4 p-4">
            <h1 className="text-4xl font-bold">Login</h1>

            {/* Display Errors */}
            {errors.length > 0 && (
              <div style={{fontSize:10}} className="mt-1 p-1 bg-red-100 text-red-700 rounded">
                {errors.map((err, idx) => (
                  <p key={idx}>{err}</p>
                ))}
              </div>
            )}



            {/* Email Input */}
            <div className="w-full p-2 mt-19 flex flex-row border-b border-gray-200">
              <MdEmail />
              <input
                type="text"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm pl-3 bg-transparent focus:outline-none placeholder-gray-400 w-full"
              />
            </div>

            {/* Password Input */}
            <div className="w-full p-2 mt-6 flex flex-row border-b border-gray-200">
              <IoIosLock />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-sm pl-3 bg-transparent focus:outline-none placeholder-gray-400 w-full"
              />
            </div>



         

            {/* Register Button */}
            <button
              onClick={handleRegister}
              style={{ marginTop: 80 }}

              className="bg-blue-200 mt-8 hover:bg-blue-300 transition-all duration-300 cursor-pointer w-full py-2 rounded-md"
            >
              Login
            </button>
            <button onClick={switchToRegister} className=" cursor-pointer text-center hover:underline mt-4 w-full " >Dont have an account, Register!</button>
          </div>
        </div>

        {/* Background Image Section */}
        <div
          style={{
            backgroundImage:
              "url('https://foundr.com/wp-content/uploads/2023/01/Social-media-management-tools.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "130%",
            backgroundColor:"#BDD4E6"
          }}
          className="flex rounded-xl flex-1 h-full hidden md:flex"
        ></div>
      </div>
      </div>

  );
};

export default Login;
