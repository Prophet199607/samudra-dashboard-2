import React, { useEffect, useState, useRef } from "react";
import SelectField from "../common/Input/SelectField";
import externalApi from "../../services/externalApi";

const AssignBranch = ({ formData, updateField, errors = {} }) => {
  const [salesBranches, setSalesBranches] = useState([]);
  const [rawBranches, setRawBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const hasFetched = useRef(false);

  const fetchSalesBranches = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await externalApi.get("/Master/GetLocations");
      let branchesData = [];

      if (response.data && Array.isArray(response.data.locations)) {
        branchesData = response.data.locations;
        setRawBranches(branchesData);
      } else {
        console.warn("Unexpected API response structure:", response.data);
      }

      const branchOptions = branchesData
        .map((branch) => ({
          value: branch.Description,
          label: branch.Description || "Unknown Branch",
        }))
        .filter((option) => option.value);

      setSalesBranches(branchOptions);
    } catch (err) {
      console.error("Error fetching sales branches:", err);
      setError(err.response?.data?.error || "Failed to load sales branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchSalesBranches();
    }
  }, []);

  const handleBranchChange = (value) => {
    updateField("salesBranch", value);
    const selectedBranch = rawBranches.find((b) => b.Description === value);
    if (selectedBranch) {
      updateField("salesBranchCode", selectedBranch.Code);
    } else {
      updateField("salesBranchCode", "");
    }
  };

  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <SelectField
          label="Select Sales Branch"
          value={formData.salesBranch || ""}
          onChange={(e) => handleBranchChange(e.target.value)}
          options={salesBranches}
          placeholder={
            loading ? "Loading branches..." : "Choose the sales branch"
          }
          required
          disabled={loading}
          error={errors.salesBranch || errors.sales_branch}
        />
        {loading && (
          <div className="text-blue-600 text-sm mt-1">
            Loading sales branches...
          </div>
        )}
        {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
      </div>
    </div>
  );
};

export default AssignBranch;
