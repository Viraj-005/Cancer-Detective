import '../styles/HowItWorks.css';
import { FaSignInAlt, FaUpload, FaBrain, FaFileAlt } from 'react-icons/fa'; // Import icons
import FAQPage from './FAQPage';

function HowItWorks() {
  const detectionSteps = [
    {
      title: "Login to the Web App",
      description: "Start by logging in with your credentials to access the cancer detection platform and its features.",
      icon: <FaSignInAlt size={40} color="#2563eb" />
    },
    {
      title: "Upload Medical Image",
      description: "Select and upload a high-quality medical image for analysis (Histopathological images, microscopic slides, or skin lesion photograph).",
      icon: <FaUpload size={40} color="#2563eb" />
    },
    {
      title: "AI Image Processing",
      description: "Our advanced system employs three machine learning models, each designed for specific cancer types, achieving up to 90% accuracy in identifying potential cancer-related markers and anomalies.",
      icon: <FaBrain size={40} color="#2563eb" />
    },
    {
      title: "Result & Report",
      description: "Receive a result indicating whether the image is cancerous or non-cancerous. Additionally, get a detailed detection report and tailored medical advice based on the analysis results.",
      icon: <FaFileAlt size={40} color="#2563eb" />
    }
  ];

  return (
    <div className="how-it-works-container">
      <div className="how-it-works-headersubcontainer">
        <div className="header-section">
          <h1>How Cancer Detection Works</h1>
          <p>A Step-by-Step Guide to Our AI-Powered Cancer Detection Process</p>
        </div>

        <div className="detection-process">
          {detectionSteps.map((step, index) => (
            <div key={index} className="detection-step">
              <div className="step-icon-container">
                {step.icon}
              </div>
              <div className="step-content">
                <div className="step-number">Step {index + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FAQPage />
    </div>
  );
}

export default HowItWorks;
