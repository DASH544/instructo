import axios from "axios";
import React, { useState } from "react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignIn() {
    const response = await axios.post("http://localhost:5000/user/login", {
      email,
      password,
    },
      { withCredentials: true });
    console.log(response);
  }
  return (
    <>
      <div>
        <div>
          <h1>Sign In</h1>
          <p>Welcome back!Please log in to access your account</p>
        </div>
        <div>
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
            <button onClick={handleSignIn}>Sign In</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
