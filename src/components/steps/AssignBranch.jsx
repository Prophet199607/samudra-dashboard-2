import React from "react";
import SelectField from "../common/Input/SelectField";
import { DROPDOWN_OPTIONS } from "../../constants/dropdownOptions";

const AssignBranch = ({ formData, updateField }) => (
  <div className="space-y-6">
    <div className="max-w-md">
      <SelectField
        label="Select Sales Branch"
        value={formData.salesBranch}
        onChange={(e) => updateField("salesBranch", e.target.value)}
        options={DROPDOWN_OPTIONS.salesBranches}
        placeholder="Choose the sales branch"
        required
      />
    </div>
  </div>
);

export default AssignBranch;
