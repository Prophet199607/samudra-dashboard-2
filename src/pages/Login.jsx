import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const LOCATIONS = [
  "SAMUDRA PUBLISHERS",
  "SAMUDRA BOOK SHOP – KURUNEGALA",
  "SAMUDRA BOOK SHOP – KURUNEGALA NEW",
  "SAMUDRA BOOK SHOP – KANDY",
  "SAMUDRA BOOK SHOP – MATARA",
  "SAMUDRA BOOK SHOP – BORELLA",
  "KURUNEGALA",
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [location, setLocation] = useState("");
  const [username, setUsername] = useState("onimta");      // default
  const [password, setPassword] = useState("samudra@123"); // default
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const res = login(username.trim(), password, location);
    if (!res.ok) return setError(res.message);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side: form */}
      <div className="flex flex-col">
        {/* Brand row — centered and same width as the form */}
        <div className="w-11/12 md:w-3/4 max-w-[560px] mx-auto pt-8 flex justify-center">
          <img
            src="https://samudrabooks.com/wp-content/themes/book-store/images/default-logo.png"
            alt="Samudra"
            className="h-12 object-contain"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>

        {/* Form card area */}
        <div className="flex-1 flex items-center">
          <form
            onSubmit={submit}
            className="w-11/12 md:w-3/4 max-w-[560px] mx-auto bg-white rounded-2xl border border-[var(--border)] shadow p-8"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Welcome Back</h3>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[#6f3dc5] focus:border-transparent px-3 py-2"
              >
                <option value="">Select a location</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="mt-1 w-full rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[#6f3dc5] focus:border-transparent px-3 py-2"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[#6f3dc5] focus:border-transparent px-3 py-2"
              />
            </div>

            {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

            <div className="flex items-center justify-between mt-4">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-white font-semibold bg-[#120a2b] hover:brightness-110"
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => alert("Please contact the administrator.")}
                className="text-sm font-semibold text-[#101167]"
              >
                Forgot password?
              </button>
            </div>

            <p className="text-sm mt-6 text-gray-700 text-center md:text-left">
              Don’t have an account?{" "}
              <a
                href="#!"
                onClick={(e) => { e.preventDefault(); alert('Registration is disabled in this demo.'); }}
                className="text-[#0ea5e9]"
              >
                Register here
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Right side: image */}
      <div className="hidden md:block">
        <img
          src="https://netinsight.net/wp-content/uploads/2024/03/DALL%C2%B7E-2024-03-04-13.00.08-Create-a-modern-and-professional-image-for-a-tech-blog-post-about-seamless-media-integration.-The-image-should-depict-a-digital-landscape-with-flowing.webp"
          alt="Login visual"
          className="w-full h-full object-cover object-left"
        />
      </div>
    </div>
  );
}
