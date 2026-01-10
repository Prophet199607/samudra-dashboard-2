import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    location: "",
    role: "",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/users");
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        // Fallback for different response structure if any
        setUsers(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get("/roles");
      if (response.data.success) {
        setRoles(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Filter
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  // Form Handlers
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormError("");
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      password: "",
      location: "",
      role: roles.length > 0 ? roles[0].name : "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      password: "", // Password empty for update unless changing
      location: user.location,
      role: user.roles && user.roles.length > 0 ? user.roles[0].name : "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.role) {
      setFormError("Please fill in all required fields.");
      return;
    }
    if (!editingUser && !formData.password) {
      setFormError("Password is required for new users.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      if (editingUser) {
        // Update
        const payload = {
          name: formData.name,
          location: formData.location,
          role: formData.role,
        };
        if (formData.password) {
          payload.password = formData.password;
        }

        const response = await api.put(`/users/${editingUser.id}`, payload);
        if (response.data.success) {
          await fetchUsers();
          setIsModalOpen(false);
        } else {
          setFormError(response.data.message || "Failed to update user");
        }
      } else {
        // Create
        const response = await api.post("/users", formData);
        if (response.data.success) {
          await fetchUsers();
          setIsModalOpen(false);
        } else {
          setFormError(response.data.message || "Failed to create user");
        }
      }
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "An error occurred"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (user) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setSubmitting(true);
    try {
      const response = await api.delete(`/users/${deletingUser.id}`);
      if (response.data.success) {
        await fetchUsers();
        setIsDeleteModalOpen(false);
        setDeletingUser(null);
      } else {
        alert(response.data.message || "Failed to delete user");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-3">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <FaUserPlus />
          Add User
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && (
          <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              Loading users...
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {user.name}
                      </td>
                      <td className="px-6 py-4">
                        {user.roles && user.roles.length > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {user.roles[0].name}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">No Role</span>
                        )}
                      </td>
                      <td className="px-2 py-2 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <FaEdit className="w-4 h-4 opacity-70 hover:opacity-100" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <FaTrash className="w-4 h-4 opacity-70 hover:opacity-100" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      {search
                        ? "No users match your search."
                        : "No users found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">
                {editingUser ? "Edit User" : "Create New User"}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {formError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password{" "}
                  {editingUser && (
                    <span className="text-gray-400 font-normal">
                      (Leave blank to keep current)
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!editingUser}
                  minLength={6}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm transition-colors disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Delete User?
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deletingUser?.name}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium shadow-sm"
                disabled={submitting}
              >
                {submitting ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
