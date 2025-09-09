import React from "react";
import OrderSummary from "../common/OrderSummary";
import InputField from "../common/Input/InputField";

const DeliveryDetails = ({ formData, updateField }) => (
  <div className="space-y-6">
    {/* Order Summary */}
    <OrderSummary formData={formData} />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <InputField
          label="Vehicle Number"
          value={formData.vehicleNo}
          onChange={(e) => updateField("vehicleNo", e.target.value)}
          placeholder="Enter vehicle registration number"
          required
        />
        <InputField
          label="Number of Boxes"
          type="number"
          value={formData.noOfBoxes}
          onChange={(e) => updateField("noOfBoxes", e.target.value)}
          placeholder="Enter total number of boxes/packages"
        />
      </div>

      <div className="space-y-4">
        <InputField
          label="Driver Name"
          value={formData.driver}
          onChange={(e) => updateField("driver", e.target.value)}
          placeholder="Enter driver's full name"
          required
        />
      </div>
    </div>
  </div>
);

export default DeliveryDetails;
