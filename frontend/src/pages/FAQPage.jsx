import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaMinus } from 'react-icons/fa';
import '../styles/FAQPage.css';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What should I do if an error message is displayed?",
      answer: (
        <>
          If you see the following errors, please take the following steps:
          <ul>
            <li>
              <strong>Read timeout, please refresh the page!</strong>
              <br />
              This may occur due to temporary network issues or server load. Simply refresh the page or
              try again after a few moments.
            </li>
            <li>
              <strong>An error occurred while connecting to the server. Please refresh the page.</strong>
              <br />
              If this persists, check your internet connection or
              <Link to="/contact" className="error-link"> contact our support team </Link> for assistance.
            </li>
          </ul>
          Additional troubleshooting:
          <ul>
            <li>Ensure you have a stable internet connection</li>
            <li>Clear your browser cache and cookies</li>
            <li>Try using a different browser or device</li>
            {/* <li>
              <a 
                href="https://cancerdetective.com/support" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="error-link"
              >
                Visit our support portal for more help
              </a>
            </li> */}
          </ul>
        </>
      )
    },
    {
      question: "Is this a 100% free app?",
      answer: "Yes! Cancer Detective is completely free to use. You just need to log in to the web app, and you can experience the detection of leukemia, lung, and skin cancers at no cost."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. Cancer Detective adheres to the highest standards of data protection, including HIPAA and GDPR compliance, to ensure your personal and medical information is kept confidential and secure."
    },
    {
      question: "How accurate is the detection system?",
      answer: "Our system achieves a precision rate of up to 90%, ensuring reliable and actionable results in detecting potential cancer indicators."
    },
    {
      question: "What are the benefits of early cancer detection?",
      answer: "Early detection significantly improves treatment outcomes. By using advanced AI technologies, Cancer Detective helps identify potential cancer indicators in their earliest stages, enabling timely intervention and a higher chance of successful treatment."
    },
    {
      question: "What should I do after receiving the risk assessment?",
      answer: "We recommend consulting with a medical professional to discuss the next steps. The detailed reports provided by Cancer Detective will guide your healthcare provider in making the right decisions for your treatment."
    },
    {
      question: "What technology is used in Cancer Detective?",
      answer: "Cancer Detective employs state-of-the-art machine learning models, specifically Convolutional Neural Networks (CNNs), trained on extensive medical datasets. These models are designed to identify subtle patterns in medical images, such as X-rays, CT scans, and skin lesion photos, with remarkable accuracy."
    }
    
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h1>Frequently Asked Questions (FAQ)</h1>
        <p>Answers to common questions about Cancer Detective and its functionality.</p>
      </div>

      <div className="faq-section">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <h3>{faq.question}</h3>
              <div className="faq-icon">
                {activeIndex === index ? <FaMinus /> : <FaPlus />}
              </div>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">
                {typeof faq.answer === 'string' ? <p>{faq.answer}</p> : faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;