import React, { useState, useEffect, useRef } from "react";
import api from "../../../services/api";

export default function Permissions() {
  // Data States
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  // Loading States
  const [rolesLoading, setRolesLoading] = useState(false);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [creatingRole, setCreatingRole] = useState(false);
  const [creatingPermission, setCreatingPermission] = useState(false);

  // Error States
  const [rolesError, setRolesError] = useState("");
  const [permissionsError, setPermissionsError] = useState("");
  const [createError, setCreateError] = useState("");

  // Search States
  const [roleSearch, setRoleSearch] = useState("");
  const [permSearch, setPermSearch] = useState("");

  // Modal States
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  // Form States
  const [roleName, setRoleName] = useState("");
  const [permissionName, setPermissionName] = useState("");

  // Edit/Delete States
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [editingRoleData, setEditingRoleData] = useState(null);
  const [isDeleteRoleModalOpen, setIsDeleteRoleModalOpen] = useState(false);
  const [deletingRoleData, setDeletingRoleData] = useState(null);

  const [isEditPermissionModalOpen, setIsEditPermissionModalOpen] =
    useState(false);
  const [editingPermissionData, setEditingPermissionData] = useState(null);
  const [isDeletePermissionModalOpen, setIsDeletePermissionModalOpen] =
    useState(false);
  const [deletingPermissionData, setDeletingPermissionData] = useState(null);

  // Action Loading States
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch roles and permissions from backend
  const fetchRoles = async () => {
    setRolesLoading(true);
    setRolesError("");
    try {
      const response = await api.get("/roles");
      if (response.data && response.data.success) {
        setRoles(response.data.data || []);
      } else {
        // Handle case where response might be direct array (backward compatibility)
        if (Array.isArray(response.data)) {
          setRoles(response.data);
        } else {
          setRolesError("Failed to load roles");
        }
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRolesError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load roles. Please check your connection."
      );
    } finally {
      setRolesLoading(false);
    }
  };

  const fetchPermissions = async () => {
    setPermissionsLoading(true);
    setPermissionsError("");
    try {
      const response = await api.get("/permissions");
      if (response.data && response.data.success) {
        setPermissions(response.data.data || []);
      } else {
        // Handle case where response might be direct array (backward compatibility)
        if (Array.isArray(response.data)) {
          setPermissions(response.data);
        } else {
          setPermissionsError("Failed to load permissions");
        }
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
      setPermissionsError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load permissions. Please check your connection."
      );
    } finally {
      setPermissionsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  // Handlers
  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    setCreatingRole(true);
    setCreateError("");

    try {
      const response = await api.post("/roles", {
        name: roleName.trim(),
      });

      if (response.data.success) {
        // Refresh roles list
        await fetchRoles();
        setRoleName("");
        setIsRoleModalOpen(false);
      } else {
        setCreateError(response.data.message || "Failed to create role");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to create role. Please try again.";
      setCreateError(errorMessage);
    } finally {
      setCreatingRole(false);
    }
  };

  const handleCreatePermission = async (e) => {
    e.preventDefault();
    if (!permissionName.trim()) return;

    setCreatingPermission(true);
    setCreateError("");

    try {
      const response = await api.post("/permissions", {
        name: permissionName.trim(),
      });

      if (response.data.success) {
        // Refresh permissions list
        await fetchPermissions();
        setPermissionName("");
        setIsPermissionModalOpen(false);
      } else {
        setCreateError(response.data.message || "Failed to create permission");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to create permission. Please try again.";
      setCreateError(errorMessage);
    } finally {
      setCreatingPermission(false);
    }
  };

  // --- Role Actions (Edit/Delete) ---
  const openEditRole = (role) => {
    setEditingRoleData(role);
    setRoleName(role.name);
    setCreateError("");
    setIsEditRoleModalOpen(true);
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!roleName.trim() || !editingRoleData) return;
    setUpdating(true);
    setCreateError("");

    try {
      const response = await api.put(`/roles/${editingRoleData.id}`, {
        name: roleName.trim(),
      });

      if (response.data.success) {
        await fetchRoles();
        setIsEditRoleModalOpen(false);
        setEditingRoleData(null);
        setRoleName("");
      } else {
        setCreateError(response.data.message || "Failed to update role");
      }
    } catch (error) {
      setCreateError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update role"
      );
    } finally {
      setUpdating(false);
    }
  };

  const openDeleteRole = (role) => {
    setDeletingRoleData(role);
    setIsDeleteRoleModalOpen(true);
  };

  const handleDeleteRole = async () => {
    if (!deletingRoleData) return;
    setDeleting(true);
    try {
      const response = await api.delete(`/roles/${deletingRoleData.id}`);
      if (response.data.success) {
        await fetchRoles();
        setIsDeleteRoleModalOpen(false);
        setDeletingRoleData(null);
      } else {
        alert(response.data.message || "Failed to delete role");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to delete role"
      );
    } finally {
      setDeleting(false);
    }
  };

  // --- Permission Actions (Edit/Delete) ---
  const openEditPermission = (perm) => {
    setEditingPermissionData(perm);
    setPermissionName(perm.name);
    setCreateError("");
    setIsEditPermissionModalOpen(true);
  };

  const handleUpdatePermission = async (e) => {
    e.preventDefault();
    if (!permissionName.trim() || !editingPermissionData) return;
    setUpdating(true);
    setCreateError("");

    try {
      const response = await api.put(
        `/permissions/${editingPermissionData.id}`,
        {
          name: permissionName.trim(),
        }
      );

      if (response.data.success) {
        await fetchPermissions();
        setIsEditPermissionModalOpen(false);
        setEditingPermissionData(null);
        setPermissionName("");
      } else {
        setCreateError(response.data.message || "Failed to update permission");
      }
    } catch (error) {
      setCreateError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update permission"
      );
    } finally {
      setUpdating(false);
    }
  };

  const openDeletePermission = (perm) => {
    setDeletingPermissionData(perm);
    setIsDeletePermissionModalOpen(true);
  };

  const handleDeletePermission = async () => {
    if (!deletingPermissionData) return;
    setDeleting(true);
    try {
      const response = await api.delete(
        `/permissions/${deletingPermissionData.id}`
      );
      if (response.data.success) {
        await fetchPermissions();
        setIsDeletePermissionModalOpen(false);
        setDeletingPermissionData(null);
      } else {
        alert(response.data.message || "Failed to delete permission");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to delete permission"
      );
    } finally {
      setDeleting(false);
    }
  };

  // Filtering
  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(roleSearch.toLowerCase())
  );
  const filteredPermissions = permissions.filter((p) =>
    p.name.toLowerCase().includes(permSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Roles & Permissions</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* --- Roles Card (Left) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
            <h2 className="font-semibold text-gray-700 text-lg">Roles</h2>
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              + Create Role
            </button>
          </div>

          <div className="p-5 flex-1">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search roles..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
              />
            </div>

            {rolesError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {rolesError}
              </div>
            )}

            <div className="overflow-x-auto">
              {rolesLoading ? (
                <div className="text-center py-8 text-gray-400">
                  Loading roles...
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Name</th>
                      <th className="px-4 py-3">Guard</th>
                      <th className="px-4 py-3 text-right rounded-r-lg">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRoles.length > 0 ? (
                      filteredRoles.map((role) => (
                        <tr
                          key={role.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {role.name}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {role.guard_name}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openEditRole(role)}
                                className="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 px-2 py-1 rounded transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => openDeleteRole(role)}
                                className="text-red-600 hover:text-red-800 font-medium text-xs bg-red-50 px-2 py-1 rounded transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-4 py-8 text-center text-gray-400"
                        >
                          {roleSearch
                            ? "No roles match your search."
                            : "No roles found."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* --- Permissions Card (Right) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
            <h2 className="font-semibold text-gray-700 text-lg">Permissions</h2>
            <button
              onClick={() => setIsPermissionModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              + Create Permission
            </button>
          </div>

          <div className="p-5 flex-1">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search permissions..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={permSearch}
                onChange={(e) => setPermSearch(e.target.value)}
              />
            </div>

            {permissionsError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {permissionsError}
              </div>
            )}

            <div className="overflow-x-auto">
              {permissionsLoading ? (
                <div className="text-center py-8 text-gray-400">
                  Loading permissions...
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Name</th>
                      <th className="px-4 py-3">Guard</th>
                      <th className="px-4 py-3 text-right rounded-r-lg">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPermissions.length > 0 ? (
                      filteredPermissions.map((perm) => (
                        <tr
                          key={perm.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {perm.name}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {perm.guard_name}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openEditPermission(perm)}
                                className="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 px-2 py-1 rounded transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => openDeletePermission(perm)}
                                className="text-red-600 hover:text-red-800 font-medium text-xs bg-red-50 px-2 py-1 rounded transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-4 py-8 text-center text-gray-400"
                        >
                          {permSearch
                            ? "No permissions match your search."
                            : "No permissions found."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Modals --- */}
      {/* Role Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">
                Create New Role
              </h3>
            </div>
            <form onSubmit={handleCreateRole} className="p-6">
              {createError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {createError}
                </div>
              )}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={roleName}
                  onChange={(e) => {
                    setRoleName(e.target.value);
                    setCreateError("");
                  }}
                  placeholder="e.g. manager (lowercase, letters, numbers, underscores only)"
                  autoFocus
                  disabled={creatingRole}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use lowercase letters, numbers, and underscores only
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsRoleModalOpen(false);
                    setRoleName("");
                    setCreateError("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                  disabled={creatingRole}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={creatingRole || !roleName.trim()}
                >
                  {creatingRole ? "Saving..." : "Save Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permission Modal */}
      {isPermissionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">
                Create New Permission
              </h3>
            </div>
            <form onSubmit={handleCreatePermission} className="p-6">
              {createError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {createError}
                </div>
              )}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permission Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={permissionName}
                  onChange={(e) => {
                    setPermissionName(e.target.value);
                    setCreateError("");
                  }}
                  placeholder="e.g. edit_posts"
                  autoFocus
                  disabled={creatingPermission}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsPermissionModalOpen(false);
                    setPermissionName("");
                    setCreateError("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                  disabled={creatingPermission}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={creatingPermission || !permissionName.trim()}
                >
                  {creatingPermission ? "Saving..." : "Save Permission"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Role Modal */}
      {isEditRoleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Edit Role</h3>
            </div>
            <form onSubmit={handleUpdateRole} className="p-6">
              {createError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {createError}
                </div>
              )}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={roleName}
                  onChange={(e) => {
                    setRoleName(e.target.value);
                    setCreateError("");
                  }}
                  autoFocus
                  disabled={updating}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditRoleModalOpen(false);
                    setRoleName("");
                    setCreateError("");
                    setEditingRoleData(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm transition-colors disabled:opacity-50"
                  disabled={updating || !roleName.trim()}
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Role Confirmation */}
      {isDeleteRoleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Delete Role?
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete the role{" "}
              <span className="font-semibold">{deletingRoleData?.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteRoleModalOpen(false);
                  setDeletingRoleData(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRole}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium shadow-sm"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Role"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Permission Modal */}
      {isEditPermissionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">
                Edit Permission
              </h3>
            </div>
            <form onSubmit={handleUpdatePermission} className="p-6">
              {createError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {createError}
                </div>
              )}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permission Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={permissionName}
                  onChange={(e) => {
                    setPermissionName(e.target.value);
                    setCreateError("");
                  }}
                  autoFocus
                  disabled={updating}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditPermissionModalOpen(false);
                    setPermissionName("");
                    setCreateError("");
                    setEditingPermissionData(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium shadow-sm transition-colors disabled:opacity-50"
                  disabled={updating || !permissionName.trim()}
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Permission Confirmation */}
      {isDeletePermissionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Delete Permission?
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete the permission{" "}
              <span className="font-semibold">
                {deletingPermissionData?.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeletePermissionModalOpen(false);
                  setDeletingPermissionData(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePermission}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium shadow-sm"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Permission"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
