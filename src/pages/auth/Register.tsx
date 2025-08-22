import React, { useState } from "react";
import colors from "../../constants/Colors";
import { CiLock } from "react-icons/ci";
import { IoIosLock } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import API from "../../api/axios";



type RegisterProps = {
  switchToLogin: () => void;
};


const Register: React.FC<RegisterProps> = ({switchToLogin}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
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
    
console.log("logged in") // redirect
  } catch (err) {
    console.error(err.response?.data);
    alert(err.response?.data?.message || "Login failed");
  }
}






const registerUser = async()=>{
    try {
    const res = await API.post("/auth/register", {
      name,
      email,
      password,
      role: "student", // or "teacher/admin"
    });
    console.log(res.data.message);
    loginUser()
  } catch (err) {
    console.error(err.response?.data);
  }
}




  const handleRegister = () => {
    const newErrors: string[] = [];

    // Name validation
    if (!name.trim()) newErrors.push("Name is required.");

    // Email validation
    if (!email.trim()) newErrors.push("Email is required.");
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.push("Email is invalid.");

    // Password validation
    if (!password) newErrors.push("Password is required.");
    else if (password.length < 6)
      newErrors.push("Password must be at least 6 characters.");

    // Retype password validation
    if (!retypePassword) newErrors.push("Retype password is required.");
    else if (password !== retypePassword) newErrors.push("Passwords do not match.");

    // Terms validation
    if (!agreeTerms) newErrors.push("You must agree to the terms.");

    setErrors(newErrors);

    if (newErrors.length === 0) {
      console.log("Name:", name);
      console.log("Email:", email);
      console.log("Password:", password);
      console.log("Retype Password:", retypePassword);
      console.log("Agreed to Terms:", agreeTerms);
      alert("Registration Successful!");

      registerUser()



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
            <h1 className="text-4xl font-bold">Sign up</h1>

            {/* Display Errors */}
            {errors.length > 0 && (
              <div style={{fontSize:10}} className="mt-1 p-1 bg-red-100 text-red-700 rounded">
                {errors.map((err, idx) => (
                  <p key={idx}>{err}</p>
                ))}
              </div>
            )}

            {/* Name Input */}
            <div className="w-full p-2 mt-10 flex flex-row border-b border-gray-200">
              <FaUser />
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-sm pl-3 bg-transparent focus:outline-none placeholder-gray-400 w-full"
              />
            </div>

            {/* Email Input */}
            <div className="w-full p-2 mt-6 flex flex-row border-b border-gray-200">
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

            {/* Retype Password */}
            <div className="w-full p-2 mt-6 flex flex-row border-b border-gray-200">
              <CiLock />
              <input
                type="password"
                placeholder="Retype password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                className="text-sm pl-3 bg-transparent focus:outline-none placeholder-gray-400 w-full"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="w-full gap-2 items-center p-2 mt-6 flex flex-row">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="form-checkbox h-5 w-5 text-purple-600 rounded"
              />
              <p className="text-sm">
                I agree all statements in{" "}
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-blue-500 hover:underline"
                >
                  Terms of services
                </a>
              </p>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              style={{ marginTop: Math.max(5, 20 - errors.length * 5) }}

              className="bg-blue-200 mt-8 hover:bg-blue-300 transition-all duration-300 cursor-pointer w-full py-2 rounded-md"
            >
              Register
            </button>
            <button onClick={switchToLogin} className=" cursor-pointer text-center hover:underline mt-4 w-full " >Already a member. Login!</button>
          </div>
        </div>

        {/* Background Image Section */}
        <div
          style={{
            backgroundImage:
              "url('https://img.freepik.com/premium-photo/tech-startup-garage-scaling_1247135-48.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="flex rounded-xl flex-1 h-full hidden md:flex"
        ></div>
      </div>
    </div>
  );
};

export default Register;
