import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import api from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const calledRef = useRef(false);
  const [locations, setLocations] = useState([]);
  const [locationId, setLocationId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Load locations from backend
  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    api
      .get("/locations")
      .then((res) => setLocations(res.data))
      .catch(() => setError("Failed to load locations"));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!locationId) return setError("Please select a location");

    const res = await login(username.trim(), password, locationId);
    if (!res.ok) return setError(res.message);

    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-5">
      {/* Left side: form (40%) */}
      <div className="flex flex-col md:col-span-2">
        {/* Form card area */}
        <div className="flex-1 flex items-center">
          <form
            onSubmit={submit}
            className="w-10/12 md:w-4/5 max-w-[480px] mx-auto bg-white rounded-2xl border border-[var(--border)] shadow p-6"
          >
            {/* Logo INSIDE form */}
            <div className="flex flex-col items-center mb-6">
              <img
                src="https://samudrabooks.com/wp-content/themes/book-store/images/default-logo.png"
                alt="Samudra"
                className="h-14 object-contain mb-3"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <h3 className="text-2xl font-bold text-center">Welcome Back</h3>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Location
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[#6f3dc5] focus:border-transparent px-3 py-2"
              >
                <option value="">Select a location</option>
                {locations.map((loc) => (
                  <option key={loc.loca_code} value={loc.loca_code}>
                    {loc.loca_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="mt-1 w-full rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[#6f3dc5] focus:border-transparent px-3 py-2"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
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
                onClick={(e) => {
                  e.preventDefault();
                  alert("Registration is disabled in this demo.");
                }}
                className="text-[#0ea5e9]"
              >
                Register here
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Right side: image (60%) */}
      <div className="hidden md:block md:col-span-3 min-h-screen">
        <img
          src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?cs=srgb&dl=pexels-quintingellar-2199293.jpg&fm=jpg"
          alt="Login visual"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
}
