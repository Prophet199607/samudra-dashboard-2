import React, { useState } from "react";
import ImageModal from "../common/model/ImageModal";
import FileUpload from "../common/Input/FileUpload";
import { showErrorToast } from "../../components/alert/ToastAlert";

const CashPayment = ({ formData, updateField }) => {
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);

  const openImageModal = (url) => {
    setModalImageUrl(url);
    setShowImageModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!validTypes.includes(file.type)) {
        showErrorToast("Please upload only PDF, JPG, JPEG or PNG files");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        showErrorToast("File size should not exceed 2MB");
        return;
      }

      updateField("paymentAttachment", file);
    }
  };

  const getFilePreview = () => {
    const file = formData.paymentAttachment;

    if (!file) return null;

    // Case 1: If it's exsisting file
    if (typeof file === "string") {
      const cleanPath = file.replace(/\\/g, "/");
      const fileName = cleanPath.split("/").pop();
      const isImage = /\.(jpg|jpeg|png)$/i.test(fileName);

      const baseApiUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");
      const fileUrl = `${baseApiUrl}/storage/${cleanPath}`;

      return (
        <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Current file:
          </p>
          {isImage ? (
            <div className="space-y-3">
              <img
                src={fileUrl}
                alt="Deposit slip"
                className="w-full h-48 object-cover rounded-lg border shadow-sm"
                onError={(e) => {
                  console.error("Image load error:", e);
                  showErrorToast("Error loading image preview");
                  e.target.style.display = "none";
                }}
              />
              <div className="text-center">
                <p className="text-sm text-gray-600 font-medium">{fileName}</p>
                <button
                  type="button"
                  onClick={() => openImageModal(fileUrl)}
                  className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors"
                >
                  View Full Size
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="w-full h-48 bg-blue-100 flex items-center justify-center rounded-lg border">
                <div className="text-center">
                  <span className="text-blue-600 font-bold text-2xl block">
                    PDF
                  </span>
                  <span className="text-blue-500 text-sm">{fileName}</span>
                </div>
              </div>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors"
              >
                Open PDF
              </a>
            </div>
          )}
        </div>
      );
    }

    // Case 2: If it's a New File
    if (file instanceof File) {
      const isImage = file.type.startsWith("image/");
      const previewUrl = URL.createObjectURL(file);

      return (
        <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Selected file:
          </p>
          {isImage ? (
            <div className="space-y-3">
              <img
                src={previewUrl}
                alt="Deposit slip preview"
                className="w-full h-48 object-cover rounded-lg border shadow-sm"
              />
              <div className="text-center">
                <p className="text-sm text-gray-600 font-medium">{file.name}</p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="w-full h-48 bg-blue-100 flex items-center justify-center rounded-lg border">
                <div className="text-center">
                  <span className="text-blue-600 font-bold text-2xl block">
                    PDF
                  </span>
                  <span className="text-blue-500 text-sm">{file.name}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload Section */}
        <div>
          <FileUpload
            label="Deposit Slip Attachment"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            value={
              formData.paymentAttachment
                ? typeof formData.paymentAttachment === "string"
                  ? formData.paymentAttachment.split("/").pop()
                  : formData.paymentAttachment.name
                : ""
            }
            required={true}
          />
          <p className="text-sm text-gray-600 mt-2">
            Accepted formats: PDF, JPG, JPEG, PNG (Max size: 2MB)
          </p>
        </div>

        {/* File Preview Section */}
        <div>
          {formData.paymentAttachment ? (
            getFilePreview()
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg
                  className="w-12 h-12 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm">File preview will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {showImageModal && (
        <ImageModal
          imageUrl={modalImageUrl}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </div>
  );
};

export default CashPayment;
