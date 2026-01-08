import React from "react";
import InputField from "../common/Input/InputField";
import SelectField from "../common/Input/SelectField";
import DeliveryDelay from "../common/model/DeliveryDelayModal";

const DeliveryDetails = ({
  formData,
  updateField,
  errors = {},
  isDelayModalOpen,
  setDelayModalOpen,
  handleDelaySave,
  isCompleted,
}) => {
  const deliveryTypeOptions = [
    { value: "Bus", label: "Bus" },
    { value: "Train", label: "Train" },
    { value: "Courier", label: "Courier" },
    { value: "Own Vehicle", label: "Own Vehicle" },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <SelectField
              label="Delivery Type"
              value={formData.deliveryType || ""}
              onChange={(e) => updateField("deliveryType", e.target.value)}
              options={deliveryTypeOptions}
              placeholder="Select a delivery type"
              required
              error={errors.deliveryType || errors.delivery_type}
              disabled={isCompleted}
            />
          </div>

          {formData.deliveryType === "Bus" && (
            <div>
              <InputField
                label="Bus Number"
                value={formData.busNo}
                onChange={(e) => updateField("busNo", e.target.value)}
                placeholder="Enter bus number"
                disabled={isCompleted}
              />
            </div>
          )}

          {formData.deliveryType === "Train" && (
            <div>
              <InputField
                label="Way Bill Number"
                value={formData.wayBillNo}
                onChange={(e) => updateField("wayBillNo", e.target.value)}
                placeholder="Enter way bill number"
                disabled={isCompleted}
              />
            </div>
          )}

          {formData.deliveryType === "Courier" && (
            <>
              <div>
                <InputField
                  label="Tracking Number"
                  value={formData.trackingNo}
                  onChange={(e) => updateField("trackingNo", e.target.value)}
                  placeholder="Enter tracking number"
                  disabled={isCompleted}
                />
              </div>
              <div>
                <InputField
                  label="Courier Name"
                  value={formData.courierName}
                  onChange={(e) => updateField("courierName", e.target.value)}
                  placeholder="Enter courier name"
                  disabled={isCompleted}
                />
              </div>
            </>
          )}

          {formData.deliveryType === "Own Vehicle" && (
            <>
              <div>
                <InputField
                  label="Vehicle Number"
                  value={formData.vehicleNo}
                  onChange={(e) => updateField("vehicleNo", e.target.value)}
                  placeholder="Enter vehicle number"
                  disabled={isCompleted}
                />
              </div>
              <div>
                <InputField
                  label="Driver Name"
                  value={formData.driverName}
                  onChange={(e) => updateField("driverName", e.target.value)}
                  placeholder="Enter driver's full name"
                  disabled={isCompleted}
                />
              </div>
            </>
          )}

          {formData.deliveryType && (
            <>
              <InputField
                label="No. of Boxes"
                type="number"
                value={formData.noOfBoxes}
                onChange={(e) => updateField("noOfBoxes", e.target.value)}
                placeholder="Enter number of boxes"
                disabled={isCompleted}
              />
            </>
          )}
        </div>
      </div>
      {isDelayModalOpen && (
        <DeliveryDelay
          onClose={() => {
            setDelayModalOpen(false);
          }}
          onSave={handleDelaySave}
        />
      )}
    </>
  );
};

export default DeliveryDetails;
