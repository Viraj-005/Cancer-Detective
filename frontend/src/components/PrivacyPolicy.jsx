import { useState, useCallback } from 'react';
import LanguageSelector from './LanguageSelector';
import { ContentSection, useStructuredContent } from './StructuredContent';

const PrivacyPolicy = () => {
  const [language, setLanguage] = useState('en');

  const getOriginalPrivacy = useCallback(() => ({
    sections: [
      {
        title: "Last Updated: December 24, 2024",
        content: null
      },
      {
        title: "1. Information We Collect",
        content: "We collect information that you provide directly to us when using the Cancer Detective application:",
        subsections: [
          "Account information (email)",
          "Usage data and analytics"
        ]
      },
      {
        title: "2. How We Use Your Information",
        content: "Your information is used to:",
        subsections: [
          "Provide and improve our services",
          "Process and analyze medical images",
          "Communicate with you about our services",
          "Ensure security and prevent fraud"
        ]
      },
      {
        title: "3. Data Storage and Security",
        content: "We implement appropriate technical and organizational measures to protect your data.",
        subsections: [
          "All medical data is encrypted",
          "Regular security audits",
          "Limited access to personal information"
        ]
      },
      {
        title: "4. Information Sharing",
        content: "We do not sell your personal information. We may share your information:",
        subsections: [
          "With your consent",
          "To comply with legal obligations",
          "With service providers who assist in our operations"
        ]
      },
      {
        title: "5. Your Rights",
        content: "You have the right to:",
        subsections: [
          "Access your personal data",
          "Request corrections to your data",
          "Request deletion of your data",
          "Withdraw consent for data processing"
        ]
      },
      {
        title: "6. Data Retention",
        content: "We retain your information for as long as necessary to:",
        subsections: [
          "Provide our services",
          "Comply with legal obligations",
          "Resolve disputes"
        ]
      },
      {
        title: "7. Children's Privacy",
        content: "Our service is not directed to children under 13. We do not knowingly collect information from children."
      },
      {
        title: "8. Changes to Privacy Policy",
        content: "We may update this policy periodically. We will notify you of any material changes."
      },
      {
        title: "9. Contact Us",
        content: "For privacy-related questions, please visit our contact page."
      }
    ]
  }), []);

  const { translatedContent } = useStructuredContent(getOriginalPrivacy(), language);

  return (
    <div className="legal-container">
      <div className="header">
        <LanguageSelector 
          onLanguageChange={setLanguage}
          currentLanguage={language}
        />
      </div>
      <div className="content">
        <h1>Privacy Policy</h1>
        <ContentSection content={translatedContent} />
      </div>
    </div>
  );
};

export default PrivacyPolicy;