import React, { useState } from "react";
import axios from "axios";
const SignUp = () => {
  //REACT-FORM-PENDING

  //TESTING
  const [firstName, setFname] = useState("");
  const [lastName, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignUp() {
    const response = await axios.post("http://localhost:5000/user/register", {
      firstName,
      lastName,
      email,
      password,
    });

    console.log(response);
  }

  return (
    <>
      <div>
        <div>
          <h1>Sign Up</h1>
          <p>Welcome back!Please log in to access your account</p>
        </div>
        <div>
          <div>
            <h2>First Name</h2>
            <input
              value={firstName}
              onChange={(e) => setFname(e.target.value)}
              type="text"
              placeholder="Enter your First Name"
            />
          </div>
          <div>
            <h2>Last Name</h2>
            <input
              value={lastName}
              onChange={(e) => setLname(e.target.value)}
              type="text"
              placeholder="Enter your Last Name"
            />
          </div>
          <div>
            <h2>Email</h2>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your Email"
            />
          </div>
          <div>
            <h2>Password</h2>
            <div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your Password"
              />
            </div>
          </div>
          <div>
            <button onClick={handleSignUp}>Sign In</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
