import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import DataTable from "../../../components/common/DataTable";

export default function Permissions() {
  // Data States
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [permissionGroups, setPermissionGroups] = useState([]);

  // Loading States
  const [rolesLoading, setRolesLoading] = useState(false);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [creatingRole, setCreatingRole] = useState(false);
  const [creatingPermission, setCreatingPermission] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);

  // Error States
  const [rolesError, setRolesError] = useState("");
  const [permissionsError, setPermissionsError] = useState("");
  const [createError, setCreateError] = useState("");

  // Modal States
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // Form States
  const [roleName, setRoleName] = useState("");
  const [permissionName, setPermissionName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [groupName, setGroupName] = useState("");

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

  // Assign Permissions State
  const [selectedRoleForAssign, setSelectedRoleForAssign] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [assignSuccess, setAssignSuccess] = useState("");

  // Action Loading States

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

  const fetchPermissionGroups = async () => {
    try {
      const response = await api.get("/permission-groups");
      if (response.data && response.data.success) {
        setPermissionGroups(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching permission groups:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
    fetchPermissionGroups();
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
    if (!permissionName.trim() || !selectedGroupId) return;

    setCreatingPermission(true);
    setCreateError("");

    try {
      const response = await api.post("/permissions", {
        name: permissionName.trim(),
        permission_group_id: selectedGroupId,
      });

      if (response.data.success) {
        // Refresh permissions list
        await fetchPermissions();
        setPermissionName("");
        setSelectedGroupId("");
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

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    setCreatingGroup(true);
    setCreateError("");

    try {
      const response = await api.post("/permission-groups", {
        name: groupName.trim(),
      });

      if (response.data.success) {
        await fetchPermissionGroups();
        setGroupName("");
        setIsGroupModalOpen(false);
      } else {
        setCreateError(response.data.message || "Failed to create group");
      }
    } catch (error) {
      setCreateError(error.response?.data?.message || "Failed to create group");
    } finally {
      setCreatingGroup(false);
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
    setSelectedGroupId(perm.permission_group_id || "");
    setCreateError("");
    setIsEditPermissionModalOpen(true);
  };

  const handleUpdatePermission = async (e) => {
    e.preventDefault();
    if (!permissionName.trim() || !editingPermissionData || !selectedGroupId)
      return;
    setUpdating(true);
    setCreateError("");

    try {
      const response = await api.put(
        `/permissions/${editingPermissionData.id}`,
        {
          name: permissionName.trim(),
          permission_group_id: selectedGroupId,
        }
      );

      if (response.data.success) {
        await fetchPermissions();
        setIsEditPermissionModalOpen(false);
        setEditingPermissionData(null);
        setPermissionName("");
        setSelectedGroupId("");
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

  // --- Assign Permission Actions ---
  const handleRoleSelectChange = async (e) => {
    const roleId = e.target.value;
    setSelectedRoleForAssign(roleId);
    setSelectedPermissions([]);
    setAssignError("");
    setAssignSuccess("");

    if (!roleId) return;

    setAssignLoading(true);
    try {
      const response = await api.get(`/roles/${roleId}/permissions`);
      if (response.data.success) {
        // Map response to just names for checkbox state
        const rolePerms = response.data.data.map((p) => p.name);
        setSelectedPermissions(rolePerms);
      }
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      setAssignError("Failed to load existing permissions for this role.");
    } finally {
      setAssignLoading(false);
    }
  };

  const handlePermissionToggle = (permName) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permName)) {
        return prev.filter((p) => p !== permName);
      } else {
        return [...prev, permName];
      }
    });
  };

  const handleSaveAssignedPermissions = async () => {
    if (!selectedRoleForAssign) {
      setAssignError("Please select a role first.");
      return;
    }

    setAssignLoading(true);
    setAssignError("");
    setAssignSuccess("");

    try {
      const response = await api.post(
        `/roles/${selectedRoleForAssign}/permissions`,
        {
          permissions: selectedPermissions,
        }
      );

      if (response.data.success) {
        setAssignSuccess("Permissions updated successfully!");
        // Clear success message after 3 seconds
        setTimeout(() => setAssignSuccess(""), 3000);
      } else {
        setAssignError(response.data.message || "Failed to update permissions");
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
      setAssignError(
        error.response?.data?.message || "Failed to update permissions"
      );
    } finally {
      setAssignLoading(false);
    }
  };

  // Columns Configuration
  const roleColumns = [
    { key: "name", label: "Name" },
    {
      key: "actions",
      label: "Actions",
      render: (_, role) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditRole(role);
            }}
            className="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 px-2 py-1 rounded transition-colors"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDeleteRole(role);
            }}
            className="text-red-600 hover:text-red-800 font-medium text-xs bg-red-50 px-2 py-1 rounded transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const permissionColumns = [
    { key: "name", label: "Name" },
    {
      key: "group",
      label: "Group",
      render: (_, perm) =>
        perm.group ? perm.group.name : <span className="text-gray-400">-</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, perm) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditPermission(perm);
            }}
            className="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 px-2 py-1 rounded transition-colors"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openDeletePermission(perm);
            }}
            className="text-red-600 hover:text-red-800 font-medium text-xs bg-red-50 px-2 py-1 rounded transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Roles & Permissions</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* --- Roles Card --- */}
        <div className="flex flex-col h-full space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-700 text-lg">Roles</h2>
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              + Create Role
            </button>
          </div>

          {rolesError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {rolesError}
            </div>
          )}

          {rolesLoading ? (
            <div className="text-center py-8 text-gray-400 bg-white rounded-xl shadow-sm border border-gray-100">
              Loading roles...
            </div>
          ) : (
            <DataTable
              data={roles}
              columns={roleColumns}
              searchable={true}
              pagination={true}
              itemsPerPageOptions={[5, 10, 20]}
              defaultItemsPerPage={5}
            />
          )}
        </div>

        {/* --- Permissions Card --- */}
        <div className="flex flex-col h-full space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-700 text-lg">Permissions</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsGroupModalOpen(true)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                + Group
              </button>
              <button
                onClick={() => {
                  setIsPermissionModalOpen(true);
                  setSelectedGroupId("");
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                + Permission
              </button>
            </div>
          </div>

          {permissionsError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {permissionsError}
            </div>
          )}

          {permissionsLoading ? (
            <div className="text-center py-8 text-gray-400 bg-white rounded-xl shadow-sm border border-gray-100">
              Loading permissions...
            </div>
          ) : (
            <DataTable
              data={permissions}
              columns={permissionColumns}
              searchable={true}
              pagination={true}
              itemsPerPageOptions={[5, 10, 20]}
              defaultItemsPerPage={5}
            />
          )}
        </div>
      </div>

      {/* --- Assign Permissions Card --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <div className="p-5 border-b border-gray-100 bg-gray-50 rounded-t-xl">
          <h2 className="font-semibold text-gray-700 text-lg">
            Assign Permissions to Role
          </h2>
        </div>

        <div className="p-6">
          <div className="mb-6 max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              value={selectedRoleForAssign}
              onChange={handleRoleSelectChange}
            >
              <option value="">-- Choose a Role --</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {selectedRoleForAssign && (
            <>
              <div className="mb-6">
                {permissionsLoading ? (
                  <p className="text-gray-500 text-sm">
                    Loading permissions...
                  </p>
                ) : (
                  <div className="space-y-8">
                    {permissionGroups.map((group) => {
                      const groupPermissions = permissions.filter(
                        (p) => p.permission_group_id === group.id
                      );

                      if (groupPermissions.length === 0) return null;

                      return (
                        <div key={group.id} className="space-y-4">
                          <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            {group.name}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {groupPermissions.map((perm) => (
                              <label
                                key={perm.id}
                                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                  selectedPermissions.includes(perm.name)
                                    ? "bg-blue-50 border-blue-200"
                                    : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                  checked={selectedPermissions.includes(
                                    perm.name
                                  )}
                                  onChange={() =>
                                    handlePermissionToggle(perm.name)
                                  }
                                />
                                <span className="ml-2 text-sm text-gray-700 select-none break-all">
                                  {perm.name}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {/* Handle permissions without a group (fallback) */}
                    {permissions.filter((p) => !p.permission_group_id).length >
                      0 && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2 uppercase tracking-wider">
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          Uncategorized
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {permissions
                            .filter((p) => !p.permission_group_id)
                            .map((perm) => (
                              <label
                                key={perm.id}
                                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                  selectedPermissions.includes(perm.name)
                                    ? "bg-blue-50 border-blue-200"
                                    : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                  checked={selectedPermissions.includes(
                                    perm.name
                                  )}
                                  onChange={() =>
                                    handlePermissionToggle(perm.name)
                                  }
                                />
                                <span className="ml-2 text-sm text-gray-700 select-none break-all">
                                  {perm.name}
                                </span>
                              </label>
                            ))}
                        </div>
                      </div>
                    )}

                    {permissions.length === 0 && (
                      <p className="text-gray-500 text-sm">
                        No permissions available to assign.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {assignError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {assignError}
                </div>
              )}

              {assignSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                  {assignSuccess}
                </div>
              )}

              <div className="flex justify-start">
                <button
                  onClick={handleSaveAssignedPermissions}
                  disabled={assignLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                  {assignLoading ? "Saving..." : "Save Assignments"}
                </button>
              </div>
            </>
          )}

          {!selectedRoleForAssign && (
            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              Please select a role to begin assigning permissions.
            </div>
          )}
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
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permission Group
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  disabled={creatingPermission}
                >
                  <option value="">-- Select Group --</option>
                  {permissionGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsPermissionModalOpen(false);
                    setPermissionName("");
                    setSelectedGroupId("");
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
                  disabled={
                    creatingPermission ||
                    !permissionName.trim() ||
                    !selectedGroupId
                  }
                >
                  {creatingPermission ? "Saving..." : "Save Permission"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">
                Create Permission Group
              </h3>
            </div>
            <form onSubmit={handleCreateGroup} className="p-6">
              {createError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {createError}
                </div>
              )}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  value={groupName}
                  onChange={(e) => {
                    setGroupName(e.target.value);
                    setCreateError("");
                  }}
                  placeholder="e.g. User Management"
                  autoFocus
                  disabled={creatingGroup}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsGroupModalOpen(false);
                    setGroupName("");
                    setCreateError("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                  disabled={creatingGroup}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={creatingGroup || !groupName.trim()}
                >
                  {creatingGroup ? "Saving..." : "Save Group"}
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
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permission Group
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  disabled={updating}
                >
                  <option value="">-- Select Group --</option>
                  {permissionGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
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
                    setSelectedGroupId("");
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
                  disabled={
                    updating || !permissionName.trim() || !selectedGroupId
                  }
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
