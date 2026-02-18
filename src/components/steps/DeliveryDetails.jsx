import React from 'react';
import InputField from '../common/Input/InputField';
import SelectField from '../common/Input/SelectField';
import DeliveryDelay from '../common/model/DeliveryDelayModal';

const DeliveryDetails = ({
  formData,
  updateField,
  errors = {},
  isDelayModalOpen,
  setDelayModalOpen,
  handleDelaySave,
  isCompleted,
  selectedOrder
}) => {
  const deliveryTypeOptions = [
    { value: 'Bus', label: 'Bus' },
    { value: 'Train', label: 'Train' },
    { value: 'Courier', label: 'Courier' },
    { value: 'Own Vehicle', label: 'Own Vehicle' }
  ];

  // If completed, show read-only card view
  if (isCompleted) {
    return (
      <div className='space-y-6'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Delivery Information
            </h3>
            {selectedOrder?.is_delayed === 1 && (
              <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800'>
                Delayed
              </span>
            )}
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
            <div>
              <div className='text-sm text-gray-500 font-semibold mb-1'>
                Delivery Type
              </div>
              <div className='text-md text-gray-600 font-bold'>
                {formData.deliveryType || (
                  <span className='text-gray-400'>N/A</span>
                )}
              </div>
            </div>

            {formData.deliveryType === 'Bus' && (
              <div>
                <div className='text-sm text-gray-500 font-semibold mb-1'>
                  Bus Number
                </div>
                <div className='text-md text-gray-600 font-bold'>
                  {formData.busNo || <span className='text-gray-400'>N/A</span>}
                </div>
              </div>
            )}

            {formData.deliveryType === 'Train' && (
              <div>
                <div className='text-sm text-gray-500 font-semibold mb-1'>
                  Way Bill Number
                </div>
                <div className='text-md text-gray-600 font-bold'>
                  {formData.wayBillNo || (
                    <span className='text-gray-400'>N/A</span>
                  )}
                </div>
              </div>
            )}

            {formData.deliveryType === 'Courier' && (
              <>
                <div>
                  <div className='text-sm text-gray-500 font-semibold mb-1'>
                    Tracking Number
                  </div>
                  <div className='text-md text-gray-600 font-bold'>
                    {formData.trackingNo || (
                      <span className='text-gray-400'>N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className='text-sm text-gray-500 font-semibold mb-1'>
                    Courier Name
                  </div>
                  <div className='text-md text-gray-600 font-bold'>
                    {formData.courierName || (
                      <span className='text-gray-400'>N/A</span>
                    )}
                  </div>
                </div>
              </>
            )}

            {formData.deliveryType === 'Own Vehicle' && (
              <>
                <div>
                  <div className='text-sm text-gray-500 font-semibold mb-1'>
                    Vehicle Number
                  </div>
                  <div className='text-md text-gray-600 font-bold'>
                    {formData.vehicleNo || (
                      <span className='text-gray-400'>N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className='text-sm text-gray-500 font-semibold mb-1'>
                    Driver Name
                  </div>
                  <div className='text-md text-gray-600 font-bold'>
                    {formData.driverName || (
                      <span className='text-gray-400'>N/A</span>
                    )}
                  </div>
                </div>
              </>
            )}

            <div>
              <div className='text-sm text-gray-500 font-semibold mb-1'>
                No. of Boxes
              </div>
              <div className='text-md text-gray-600 font-bold'>
                {formData.noOfBoxes || (
                  <span className='text-gray-400'>N/A</span>
                )}
              </div>
            </div>
          </div>

          {selectedOrder?.is_delayed === 1 && (
            <div className='mt-6 pt-6 border-t border-gray-200'>
              <div className='text-sm text-gray-500 font-semibold mb-1'>
                Delay Reason
              </div>
              <div className='text-md text-red-600 font-bold'>
                {formData.delayReason || (
                  <span className='text-gray-400'>N/A</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Editable form view
  return (
    <>
      <div className='space-y-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <div>
            <SelectField
              label='Delivery Type'
              value={formData.deliveryType || ''}
              onChange={(e) => updateField('deliveryType', e.target.value)}
              options={deliveryTypeOptions}
              placeholder='Select a delivery type'
              required
              error={errors.deliveryType || errors.delivery_type}
              disabled={isCompleted}
            />
          </div>

          {formData.deliveryType === 'Bus' && (
            <div>
              <InputField
                label='Bus Number'
                value={formData.busNo}
                onChange={(e) => updateField('busNo', e.target.value)}
                placeholder='Enter bus number'
                disabled={isCompleted}
              />
            </div>
          )}

          {formData.deliveryType === 'Train' && (
            <div>
              <InputField
                label='Way Bill Number'
                value={formData.wayBillNo}
                onChange={(e) => updateField('wayBillNo', e.target.value)}
                placeholder='Enter way bill number'
                disabled={isCompleted}
              />
            </div>
          )}

          {formData.deliveryType === 'Courier' && (
            <>
              <div>
                <InputField
                  label='Tracking Number'
                  value={formData.trackingNo}
                  onChange={(e) => updateField('trackingNo', e.target.value)}
                  placeholder='Enter tracking number'
                  disabled={isCompleted}
                />
              </div>
              <div>
                <InputField
                  label='Courier Name'
                  value={formData.courierName}
                  onChange={(e) => updateField('courierName', e.target.value)}
                  placeholder='Enter courier name'
                  disabled={isCompleted}
                />
              </div>
            </>
          )}

          {formData.deliveryType === 'Own Vehicle' && (
            <>
              <div>
                <InputField
                  label='Vehicle Number'
                  value={formData.vehicleNo}
                  onChange={(e) => updateField('vehicleNo', e.target.value)}
                  placeholder='Enter vehicle number'
                  disabled={isCompleted}
                />
              </div>
              <div>
                <InputField
                  label='Driver Name'
                  value={formData.driverName}
                  onChange={(e) => updateField('driverName', e.target.value)}
                  placeholder="Enter driver's full name"
                  disabled={isCompleted}
                />
              </div>
            </>
          )}

          {formData.deliveryType && (
            <>
              <InputField
                label='No. of Boxes'
                type='number'
                value={formData.noOfBoxes}
                onChange={(e) => updateField('noOfBoxes', e.target.value)}
                placeholder='Enter number of boxes'
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
