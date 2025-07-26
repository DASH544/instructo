import React from "react";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto mt-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div>
              <svg
                width="55"
                height="54"
                viewBox="0 0 55 54"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.333313"
                  width="54"
                  height="54"
                  rx="8"
                  fill="#FF9500"
                />
                <path
                  d="M11.5003 43.6666L22.3336 32.8333H33.167V22L44.0003 32.8333L33.167 43.6666H11.5003Z"
                  fill="white"
                />
                <path
                  d="M11.5003 22L22.3336 32.8333V22H33.167L44.0003 11.1666H22.3336L11.5003 22Z"
                  fill="white"
                />
              </svg>
            </div>
            <div>
              <ol className="flex items-center gap-8">
                <li>Home</li>
                <li>Courses</li>
                <li>Contact Us</li>
                <li>About Us</li>
              </ol>
            </div>
          </div>
          <div className="flex gap-4">
            <Link to="/signup">
              <button>Sign Up</button>
            </Link>
            <Link to="/signin">
              <button>Sign In</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
