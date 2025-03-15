import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";
import { FaImages, FaTimes, FaSpinner, FaDownload, FaLock, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdOutlineWarning } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import { useAuthentication } from "../auth";
import { detectionService } from '../services/detectionService';
import "../styles/Detection.css";
import adviceDoctor from "../assets/advicedoc.png";
import defaultImage from "../assets/default.jpg";

// Cancer type descriptions
const CANCER_INFO = {
  leukemia: {
    shortDesc: "Upload microscopic blood smear images for leukemia detection.",
    fullDesc: `For leukemia detection, please upload:
    • High-quality microscopic blood smear images
    • Images showing clear blood cells
    • Properly stained samples
    • Minimum resolution of 800x600 pixels
    • File formats: JPG, PNG, or BMP
    • Maximum file size: 10MB
    
    Recommended image characteristics:
    • Well-lit, clear focus
    • Minimal background noise
    • Proper white balance
    • Standard microscopic magnification (40x-100x)`,
  },
  lung: {
    shortDesc: "Upload histopathological lung tissue images for cancer detection.",
    fullDesc: `For lung cancer detection, please upload:
    • High-quality histopathological slide images (H&E stained)
    • Microscopic images showing lung tissue architecture
    • Clear visibility of glandular or squamous cell structures
    • Minimum resolution of 1024x1024 pixels
    • Supported formats: JPG, PNG, or BMP
    • Maximum file size: 10MB
    
    Image requirements:
    • Proper H&E staining quality (clear nuclear/cytoplasmic contrast)
    • 20x-40x magnification recommended
    • Focused tissue sections without blurring
    • Complete tissue section visibility
    • Avoid folded tissue or staining artifacts
    
    Our AI model detects:
    1. Lung Adenocarcinoma - Glandular cell patterns
    2. Squamous Cell Carcinoma - Flat squamous cell morphology
    3. Benign Tissue - Normal lung histology`,
  },
  skin: {
    shortDesc: "Upload clear dermatoscopic images of skin lesions.",
    fullDesc: `For skin cancer detection, please upload:
    • High-quality dermatoscopic images
    • Clear, well-focused skin lesion photos
    • Proper lighting conditions
    • Minimum resolution of 800x600 pixels
    • File formats: JPG, PNG, or BMP
    • Maximum file size: 10MB
    
    Image guidelines:
    • Centered lesion in frame
    • Minimal glare or shadows
    • Natural skin color
    • Include surrounding healthy skin
    • Clean lens and proper focus`,
  },
};

const Description = ({ cancer, isExpanded, onToggle }) => {
  return (
    <div className="cancer-description">
      <p>{CANCER_INFO[cancer].shortDesc}</p>
      <button 
        className="expand-button" 
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <>See less <FaChevronUp /></>
        ) : (
          <>See more <FaChevronDown /></>
        )}
      </button>
      {isExpanded && (
        <div className="expanded-content">
          <pre>{CANCER_INFO[cancer].fullDesc}</pre>
        </div>
      )}
    </div>
  );
};

Description.propTypes = {
  cancer: PropTypes.oneOf(['leukemia', 'lung', 'skin']).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

function Detection() {
  const { isAuthorized } = useAuthentication();
  const [isConnectionReady, setIsConnectionReady] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const CANCER_TYPES = useMemo(() => ["leukemia", "lung", "skin"], []);
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return CANCER_TYPES.includes(hash) ? hash : CANCER_TYPES[0];
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState(null);
  const [probability, setProbability] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detectionAttempts, setDetectionAttempts] = useState(0);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounter = useRef(0);

  // initialization useEffect
  useEffect(() => {
    let mounted = true;

    const initializeConnection = async () => {
        try {
            // Try to preload, but don't block the UI
            await detectionService.preloadConnection();
            if (mounted) {
                setIsConnectionReady(true);
            }
        } catch (error) {
            console.warn('Connection initialization warning:', error);
            // Still set connection as ready to allow requests
            if (mounted) {
                setIsConnectionReady(true);
            }
        }
    };

    initializeConnection();

    return () => {
        mounted = false;
    };
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', `#${activeTab}`);
    setUploadedImage(null);
    setImageFile(null);
    setResult(null);
    setProbability(null);
    setDetectionAttempts(0);
  }, [activeTab]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (CANCER_TYPES.includes(hash)) {
        setActiveTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [CANCER_TYPES]);

  useEffect(() => {
    return () => {
      // Cleanup URL object when component unmounts
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  const handleUnauthorizedUpload = useCallback(() => {
    if (isDraggingOver) {
      setIsDraggingOver(false);
      dragCounter.current = 0;
      toast.error('You cannot upload images without logging into the web app!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast error'
      });
    } else {
      toast.error('Please log in to upload and detect images', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast error'
      });
    }
  }, [isDraggingOver]);

  const handleDrop = useCallback((acceptedFiles) => {
    if (!isAuthorized) {
      handleUnauthorizedUpload();
      return;
    }
  
    const file = acceptedFiles[0];
    
    // Check if the file is an image
    if (file && file.type.startsWith('image/')) {
    // Clean up previous image URL if it exists
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    
    const newImageUrl = URL.createObjectURL(file);
    setUploadedImage(newImageUrl);
    setImageFile(file);
    setResult(null);
    setProbability(null);
    setDetectionAttempts(0);
    setIsDraggingOver(false);
    dragCounter.current = 0;
  
    toast.success('Image uploaded successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: 'custom-toast success'
    });
  } else {
    // Display error toast for non-image files
    toast.error('Please upload a valid image file (JPEG, JPG, PNG, BMP)', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: 'custom-toast error'
    });
    }
  }, [isAuthorized, handleUnauthorizedUpload, uploadedImage]);

  const handlePaste = useCallback(async (event) => {
    if (!isAuthorized) {
      handleUnauthorizedUpload();
      return;
    }

    if (isLoading) {
      toast.warning('Please wait for the current detection to complete', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast warning'
      });
      return;
    }

    try {
      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          handleDrop([blob]);
          return;
        }
      }

      const pastedText = event.clipboardData.getData('text');
      if (pastedText && (pastedText.startsWith('http://') || pastedText.startsWith('https://'))) {
        const response = await fetch(pastedText);
        const blob = await response.blob();
        if (blob.type.startsWith('image/')) {
          const file = new File([blob], 'pasted-image', { type: blob.type });
          handleDrop([file]);
        } else {
          toast.error('Invalid image URL', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: 'custom-toast error'
          });
        }
      }
    } catch (error) {
      console.error("Paste Error:", error);
      toast.error(error.message || "An error occurred while pasting image", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast error'
      });
    }
  }, [isAuthorized, handleUnauthorizedUpload, isLoading, handleDrop]);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthorized) {
      handleUnauthorizedUpload();
      return;
    }
    // Only increment counter and show overlay if not loading
    if (!isLoading) {
      dragCounter.current++;
      if (dragCounter.current === 1) {
        setIsDraggingOver(true);
      }
    }
  }, [isAuthorized, handleUnauthorizedUpload, isLoading]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDraggingOver(false);
    }
  }, []);

  useEffect(() => {
    const handleGlobalDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleGlobalDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isLoading) {
        toast.warning('Please wait for the current detection to complete', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: 'custom-toast warning'
        });
      } else if (isAuthorized) {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          const file = files[0];
          if (file.type.startsWith('image/')) {
            handleDrop(Array.from(files));
          }
        }
      }
      setIsDraggingOver(false);
      dragCounter.current = 0;
    };

    const handleGlobalDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current++;
      // Only show global dropzone if not loading
      if (!isLoading) {
        dragCounter.current++;
        if (dragCounter.current === 1) {
          setIsDraggingOver(true);
        }
      }
    };

    const handleGlobalDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current--;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setIsDraggingOver(false);
      }

      // Additional check: if the drag leaves the window
      if (e.clientY <= 0 || e.clientY >= window.innerHeight ||
          e.clientX <= 0 || e.clientX >= window.innerWidth) {
        dragCounter.current = 0;
        setIsDraggingOver(false);
      }
    };

    document.addEventListener('dragover', handleGlobalDragOver);
    document.addEventListener('drop', handleGlobalDrop);
    document.addEventListener('dragenter', handleGlobalDragEnter);
    document.addEventListener('dragleave', handleGlobalDragLeave);

    return () => {
      document.removeEventListener('dragover', handleGlobalDragOver);
      document.removeEventListener('drop', handleGlobalDrop);
      document.removeEventListener('dragenter', handleGlobalDragEnter);
      document.removeEventListener('dragleave', handleGlobalDragLeave);
    };
  }, [handleDrop, isLoading, isAuthorized]);

  const removeImage = useCallback(() => {
    setUploadedImage(null);
    setImageFile(null);
    setResult(null);
    setProbability(null);
    setDetectionAttempts(0);
    toast.info('Image removed successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: 'custom-toast info'
    });
  }, []);

  const handleDetect = useCallback(async () => {
    const newAttempts = detectionAttempts + 1;
    setDetectionAttempts(newAttempts);

    if (!imageFile) {
        toast.error("Please upload an image first!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: 'custom-toast error'
        });
        return;
    }

    if (result) {
        toast.info('You already got the result!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: 'custom-toast info'
        });
        return;
    }

    setIsLoading(true);

    try {
        const data = await detectionService.detectCancer(imageFile, activeTab);
        
        console.log('Raw Detection Data:', data);
        console.log('Prediction Type:', typeof data.prediction);
        console.log('Prediction Value:', data.prediction);
        console.log('Probability:', data.probability);

        let result = "Unknown";
        let isCancerous = false;

        if (activeTab === 'lung') {
            const predictionValue = Number(data.prediction);

            switch(predictionValue) {
                case 0:
                    result = "Lung Adenocarcinoma (Cancerous)";
                    isCancerous = true;
                    break;
                case 1:
                    result = "Lung Benign Tissue (Non-Cancerous)";
                    isCancerous = false;
                    break;
                case 2:
                    result = "Lung Squamous Cell Carcinoma (Cancerous)";
                    isCancerous = true;
                    break;
                default:
                    if (typeof data.prediction === 'string') {
                        result = data.prediction.toLowerCase().includes('cancerous') 
                            ? "Lung Cancer (Cancerous)" 
                            : "Lung Benign Tissue (Non-Cancerous)";
                        isCancerous = result.includes('Cancerous');
                    } else {
                        result = "Unable to Determine";
                        isCancerous = false;
                    }
            }
        } else {
            isCancerous = 
                (typeof data.prediction === 'number' && data.prediction >= 0.5) || 
                (typeof data.prediction === 'string' && data.prediction.toLowerCase() === 'cancerous');
            
            result = isCancerous ? "Cancerous" : "Non-cancerous";
        }

        setResult(result);
        setProbability((data.probability * 100).toFixed(2));
        
        toast.success(`Detection successful! Result: ${result}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: 'custom-toast success'
        });

    } catch (error) {
        console.error("Error:", error);

        // More specific error messages
        const errorMessage = error.message === 'Request timeout'
        ? "Detection timeout, please try again!"
        : error.message === 'Failed to fetch'
        ? "Unable to connect to the server. Please check your connection."
        : "An error occurred during detection. Please try again.";

        toast.error(errorMessage, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: 'custom-toast error'
        });
    } finally {
        setIsLoading(false);
    }
  }, [activeTab, detectionAttempts, imageFile, result]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const downloadReport = useCallback(async () => {
    const doc = new jsPDF();
    const dateTime = new Date().toLocaleString();
    const currentYear = new Date().getFullYear();
  
    doc.setFontSize(18);
    doc.text(
      `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Cancer Detection Report`,
      doc.internal.pageSize.width / 2,
      20,
      { align: "center" }
    );
  
    doc.setFontSize(12);
    doc.text(`Date & Time: ${dateTime}`, 10, 30);
  
    if (uploadedImage) {
      const img = new Image();
      img.src = uploadedImage;
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
  
        const pageWidth = doc.internal.pageSize.width;
        const imageWidth = 100;
        const imageHeight = (img.height / img.width) * imageWidth;
        const xPosition = (pageWidth - imageWidth) / 2;
        const yPosition = 50;
  
        doc.addImage(imgData, "JPEG", xPosition, yPosition, imageWidth, imageHeight);
  
        const textYPosition = yPosition + imageHeight + 20;
        doc.setFontSize(14);
        
        if (result.toLowerCase() === "non-cancerous") {
          doc.setTextColor(0, 128, 0);
        } else {
          doc.setTextColor(255, 0, 0);
        }
        doc.text(`Result: ${result}`, pageWidth / 2, textYPosition, { align: "center" });
  
        doc.setTextColor(0, 0, 0);
        doc.text(`Probability: ${probability}%`, pageWidth / 2, textYPosition + 10, { align: "center" });

        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(10);
        doc.text(`© ${currentYear} Cancer Detective. All rights reserved.`, pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
  
        doc.save(`${activeTab}_cancer_detection_report.pdf`);
      };
    } else {
      const pageWidth = doc.internal.pageSize.width;
  
      doc.setFontSize(14);
      doc.text("No image uploaded.", pageWidth / 2, 50, { align: "center" });
  
      if (result.toLowerCase() === "non-cancerous") {
        doc.setTextColor(0, 128, 0);
      } else {
        doc.setTextColor(255, 0, 0);
      }
      doc.text(`Result: ${result}`, pageWidth / 2, 70, { align: "center" });
  
      doc.setTextColor(0, 0, 0);
      doc.text(`Probability: ${probability}%`, pageWidth / 2, 80, { align: "center" });

      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.text(`© ${currentYear} Cancer Detective. All rights reserved.`, pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
  
      doc.save(`${activeTab}_cancer_detection_report.pdf`);
    }
    toast.success('Report downloaded successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: 'custom-toast success'
    });
  }, [activeTab, result, probability, uploadedImage]);

  const renderDetectionContent = useCallback(() => {
    const renderDetectButton = () => (
      <button
          className={`detect-btn ${!isAuthorized ? 'unauthorized' : ''}`}
          onClick={handleDetect}
          disabled={isLoading || !isAuthorized }
      >
          {isLoading ? (
              <span>
                  <FaSpinner className="spinner-icon" /> Detecting...
              </span>
          ) : !isAuthorized ? (
              "Please Login to Detect"
          ) : !isConnectionReady ? (
              "Initializing..."
          ) : (
              `Detect ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Cancer`
          )}
      </button>
    );

    return (
      <div className="detection-content">
          <h2>
            {activeTab === 'leukemia'
            ? 'Leukemia Detection'
            : activeTab === 'lung'
            ? 'Lung Cancer Detection'
            : activeTab === 'skin'
            ? 'Skin Cancer Detection'
            : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Detection`}
          </h2>
          <Description
          cancer={activeTab}
          isExpanded={expandedDescription}
          onToggle={() => setExpandedDescription(!expandedDescription)}
          />
          <div className="detection-grid">
              <div className="detection-description">
                <Dropzone onDrop={handleDrop} onPaste={handlePaste}/>
                {renderDetectButton()}
              </div>
              <div className="detection-image">
                {uploadedImage ? (
                    <div className="image-preview" onClick={openModal}>
                        <img src={uploadedImage} alt="Uploaded preview" />
                        <button
                            className="close-icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeImage();
                            }}
                        >
                            <FaTimes />
                        </button>
                    </div>
                ) : (
                  <img src={defaultImage} alt="Default preview" className="default-image"/>
                )}
              </div>
          </div>
      </div>
    );
  }, [activeTab, expandedDescription, isAuthorized, isLoading, uploadedImage, handleDrop, handlePaste, openModal, removeImage, isConnectionReady, handleDetect]);

  const Dropzone = useCallback(({ onDrop }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (files) => {
        if (!isAuthorized) {
          handleUnauthorizedUpload();
          return;
        }
        if (isLoading) {
          toast.warning('Please wait for the current detection to complete', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: 'custom-toast warning'
          });
          return;
        }
        onDrop(files);
      },
      accept: {
        'image/jpeg': ['.jpeg', '.jpg'],
        'image/png': ['.png'],
        'image/bmp': ['.bmp']
      },
      disabled: !isAuthorized || isLoading
    });
  
    return (
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""} ${!isAuthorized ? "unauthorized" : ""} ${isLoading ? "loading" : ""}`}
      >
        <input {...getInputProps()} disabled={!isAuthorized || isLoading} />
        <div className="icon">
        {!isAuthorized ? (
          <FaLock size={50} color="#dc2626" />
        ) : isLoading ? (
          <FaSpinner size={50} color="#666" className="spinner-icon" />
        ) : (
          <FaImages size={50} color="#1683ff" />
        )}
        </div>
        {isAuthorized ? (
          isLoading ? (
            <span className="header">
              Detection in progress...
              <br />
              Please wait
            </span>
          ) : (
            <>
              <span className="header">
                Drag & Drop here
                <br />
                or <span className="button">Browse</span>
                <br />
                CTRL + V to paste image or URL
              </span>
              <span className="support">Supports: JPEG, JPG, PNG, BMP</span>
            </>
          )
        ) : (
          <div className="unauthorized-content">
            <span className="header unauthorized-header">
              Please Login First
            </span>
            <span className="unauthorized-message">
              You need to be logged in to upload and detect images
            </span>
          </div>
        )}
      </div>
    );
  }, [isAuthorized, handleUnauthorizedUpload, isLoading]);

  Dropzone.propTypes = {
    onDrop: PropTypes.func.isRequired,
  };

  const renderResult = useCallback(() => {
    if (result && probability !== null) {
      
      const resultColor = result.toLowerCase().includes("non-cancerous") ? "green" : "red";
  
      return (
        <div
          className="result-container"
          style={{ color: resultColor }}
        >
          <h3>Result: {result}</h3>
          <p>Probability: {probability}%</p>
          <button className="download-btn" onClick={downloadReport}>
            <FaDownload /> Download Report
          </button>
        </div>
      );
    }
    return null;
  }, [result, probability, downloadReport]);

  const renderDisclaimer = useCallback(() => (
    <div className="disclaimer">
      <MdOutlineWarning style={{ color: "red", marginRight: "10px", textAlign: "center", fontSize: "20px" }} />
      <span>
        The prediction results and advice provided by this application is for informational purposes only and should not replace professional medical consultation. Always consult a qualified healthcare provider for any medical concerns.
      </span>
    </div>
  ), []);

  const renderAdvice = useCallback(() => {
    if (result) {
      let adviceText = "";
      
      const exactResult = result.trim().toLowerCase();
      
      if (exactResult === "non-cancerous") {
        adviceText = "Our analysis suggests no immediate cancer indicators. However, we recommend maintaining regular health check-ups and consulting your healthcare provider if you notice any changes or have concerns.";
      } 
      else if (exactResult === "cancerous" || exactResult.includes("lung cancer (cancerous)")) {
        adviceText = "Based on our analysis, potential cancer indicators have been detected. We strongly recommend scheduling an immediate appointment with a qualified healthcare professional for a thorough examination and proper diagnosis.";
      }
      else if (result.toLowerCase().includes("lung")) {
        if (result.toLowerCase().includes("benign") || result.toLowerCase().includes("non-cancerous")) {
          adviceText = "Our analysis suggests no immediate cancer indicators. However, we recommend maintaining regular health check-ups and consulting your healthcare provider if you notice any changes or have concerns.";
        } else if (result.toLowerCase().includes("adenocarcinoma") || result.toLowerCase().includes("squamous cell carcinoma") || result.toLowerCase().includes("cancerous")) {
          adviceText = "Based on our analysis, potential cancer indicators have been detected. We strongly recommend scheduling an immediate appointment with a qualified healthcare professional for a thorough examination and proper diagnosis.";
        }
      }
      else {
        adviceText = "The results are inconclusive. We recommend consulting with a healthcare professional for a proper medical evaluation to ensure your well-being.";
      }
      
      return (
        <div className="advice-container">
          <div className="doctor-image">
            <img
              src={adviceDoctor || "https://via.placeholder.com/400"}
              alt="Doctor providing advice"
              className="advice-doctor-image"
            />
          </div>
          <div className="advice-text">
            <h3 className="advice-header">Medical Recommendation</h3>
            <p>{adviceText}</p>
            {renderDisclaimer()}
          </div>
        </div>
      );
    }
    return null;
  }, [result, renderDisclaimer]);

  return (
    <div 
      className={`detection-container ${isDraggingOver && !isLoading ? 'drag-active' : ''}`} 
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      aria-label="Cancer Detection Container"
    >
      <ToastContainer />
      {isDraggingOver && !isLoading &&(
        <div className="global-dropzone-overlay">
          <div className="global-dropzone-content">
            <FaImages size={100} color="#1683ff" />
            <h2>Drop Your Image Anywhere</h2>
            <p>(1 file at a time)</p>
          </div>
        </div>
      )}
      <div className="detection-tabs">
        {CANCER_TYPES.map((type) => (
          <button
            key={type}
            className={activeTab === type ? "active" : ""}
            onClick={() => setActiveTab(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      {renderDetectionContent()}
      {renderResult()}
      {renderAdvice()}

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <img src={uploadedImage} alt="Modal view" />
            <button className="close-modal" onClick={closeModal}>
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(Detection);