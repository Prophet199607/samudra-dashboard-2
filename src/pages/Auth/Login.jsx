import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/auth-context.js";
import externalApi from "../../services/externalApi";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const calledRef = useRef(false);
  const [locations, setLocations] = useState([]);
  const [locationId, setLocationId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    externalApi
      .get("/Master/GetLocations")
      .then((res) => {
        if (res.data && Array.isArray(res.data.locations)) {
          setLocations(res.data.locations);
        } else {
          setError("Invalid data received from server");
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.error || "Failed to load locations");
      });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!locationId) {
      setError("Please select a location");
      return;
    }

    setLoading(true);
    const res = await login(name.trim(), password, locationId);
    setLoading(false);

    if (!res.ok) {
      setError(res.message || "Login failed");
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-5">
      {/* Left side: form */}
      <div className="flex flex-col md:col-span-2">
        <div className="flex-1 flex items-center">
          <form
            onSubmit={submit}
            className="w-10/12 md:w-4/5 max-w-[480px] mx-auto bg-white rounded-2xl border border-[var(--border)] shadow p-6"
          >
            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
              <img
                src="https://samudrabooks.com/wp-content/themes/book-store/images/default-logo.png"
                alt="Samudra"
                className="h-14 object-contain mb-3"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <h3 className="text-2xl font-bold text-center">Welcome Back</h3>
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Location
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="mt-1 text-sm w-full rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[#6f3dc5] focus:border-transparent px-3 py-2"
              >
                <option value="">Select a location</option>
                {locations.map((loc) => (
                  <option key={loc.Code} value={loc.Code}>
                    {loc.Description}
                  </option>
                ))}
              </select>
            </div>

            {/* Username */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Username
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Username"
                className="mt-1 text-sm w-full rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[#6f3dc5] focus:border-transparent px-3 py-2"
              />
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1  text-sm w-full rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[#6f3dc5] focus:border-transparent px-3 py-2"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="text-red-600 text-sm mb-3 text-left">{error}</div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-between mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`px-5 py-2 w-full rounded-xl text-white font-semibold bg-[#120a2b] hover:brightness-110 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            <p className="text-xs mt-4 text-gray-700 text-center">V1.0.0</p>
          </form>
        </div>
      </div>

      {/* Right side image */}
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
