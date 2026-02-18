import React from 'react';
import InputField from '../common/Input/InputField';

const AddInvoice = ({
  formData,
  updateField,
  isCollection,
  savedSteps,
  selectedOrder
}) => {
  const formatThousand = (value) => {
    if (!value) return '';
    const num = value.toString().replace(/,/g, '');
    if (!num || isNaN(num)) return '';
    return Number(num).toLocaleString();
  };

  const parseThousand = (value) => {
    return value.replace(/,/g, '');
  };

  const fieldConfig = isCollection
    ? {
        numLabel: 'Receipt Number',
        numField: 'receiptNo',
        numPlace: 'Enter receipt number',
        amtLabel: 'Receipt Amount',
        amtField: 'receiptAmount',
        amtPlace: 'Enter receipt amount'
      }
    : {
        numLabel: 'Invoice Number',
        numField: 'invoiceNumber',
        numPlace: 'Enter invoice number',
        amtLabel: 'Invoice Amount',
        amtField: 'invoiceAmount',
        amtPlace: 'Enter final invoice amount'
      };

  const isOrderCompleted = savedSteps?.has(9);
  const showDeliveryData = isOrderCompleted && !isCollection;

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <InputField
          label={fieldConfig.numLabel}
          value={formData[fieldConfig.numField]}
          onChange={(e) => updateField(fieldConfig.numField, e.target.value)}
          placeholder={fieldConfig.numPlace}
          required
        />
        <InputField
          label={fieldConfig.amtLabel}
          type='text'
          value={formatThousand(formData[fieldConfig.amtField])}
          onChange={(e) => {
            const rawValue = parseThousand(e.target.value);
            updateField(fieldConfig.amtField, rawValue);
          }}
          inputMode='decimal'
          placeholder={fieldConfig.amtPlace}
          required
        />
      </div>

      {showDeliveryData && (
        <div className='mt-8 border-t border-gray-200 pt-6'>
          <div className='mb-4'>
            <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
              <span>🚛</span>
              <span>Delivery Information</span>
              {selectedOrder?.is_delayed === 1 && (
                <span className='text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded'>
                  Delayed
                </span>
              )}
            </h3>
          </div>

          <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {formData.deliveryType && (
                <div className='bg-white rounded-lg p-3 border border-gray-200'>
                  <p className='text-xs font-medium text-gray-500'>
                    Delivery Type
                  </p>
                  <p className='text-sm font-semibold text-gray-900 mt-0.5'>
                    {formData.deliveryType}
                  </p>
                </div>
              )}

              {formData.deliveryType === 'Bus' && formData.busNo && (
                <div className='bg-white rounded-lg p-3 border border-gray-200'>
                  <p className='text-xs font-medium text-gray-500'>Bus No</p>
                  <p className='text-sm font-semibold text-gray-900 mt-0.5'>
                    {formData.busNo}
                  </p>
                </div>
              )}

              {formData.deliveryType === 'Train' && formData.wayBillNo && (
                <div className='bg-white rounded-lg p-3 border border-gray-200'>
                  <p className='text-xs font-medium text-gray-500'>
                    Way Bill No
                  </p>
                  <p className='text-sm font-semibold text-gray-900 mt-0.5'>
                    {formData.wayBillNo}
                  </p>
                </div>
              )}

              {formData.deliveryType === 'Courier' && (
                <>
                  {formData.trackingNo && (
                    <div className='bg-white rounded-lg p-3 border border-gray-200'>
                      <p className='text-xs font-medium text-gray-500'>
                        Tracking No
                      </p>
                      <p className='text-sm font-semibold text-gray-900 mt-0.5'>
                        {formData.trackingNo}
                      </p>
                    </div>
                  )}
                  {formData.courierName && (
                    <div className='bg-white rounded-lg p-3 border border-gray-200'>
                      <p className='text-xs font-medium text-gray-500'>
                        Courier Name
                      </p>
                      <p className='text-sm font-semibold text-gray-900 mt-0.5'>
                        {formData.courierName}
                      </p>
                    </div>
                  )}
                </>
              )}

              {formData.deliveryType === 'Own Vehicle' && (
                <>
                  {formData.vehicleNo && (
                    <div className='bg-white rounded-lg p-3 border border-gray-200'>
                      <p className='text-xs font-medium text-gray-500'>
                        Vehicle No
                      </p>
                      <p className='text-sm font-semibold text-gray-900 mt-0.5'>
                        {formData.vehicleNo}
                      </p>
                    </div>
                  )}
                  {formData.driverName && (
                    <div className='bg-white rounded-lg p-3 border border-gray-200'>
                      <p className='text-xs font-medium text-gray-500'>
                        Driver Name
                      </p>
                      <p className='text-sm font-semibold text-gray-900 mt-0.5'>
                        {formData.driverName}
                      </p>
                    </div>
                  )}
                </>
              )}

              {formData.noOfBoxes && (
                <div className='bg-white rounded-lg p-3 border border-gray-200'>
                  <p className='text-xs font-medium text-gray-500'>
                    No Of Boxes
                  </p>
                  <p className='text-sm font-semibold text-gray-900 mt-0.5'>
                    {formData.noOfBoxes}
                  </p>
                </div>
              )}

              {selectedOrder?.is_delayed === 1 && formData.delayReason && (
                <div className='bg-red-50 rounded-lg p-3 border border-red-300 md:col-span-2 lg:col-span-3'>
                  <p className='text-xs font-medium text-red-600'>
                    Delay Reason
                  </p>
                  <p className='text-sm font-semibold text-red-700 mt-0.5'>
                    {formData.delayReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddInvoice;
