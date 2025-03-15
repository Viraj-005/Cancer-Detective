import { useState, useCallback } from 'react';
import LanguageSelector from './LanguageSelector';
import { ContentSection, useStructuredContent } from './StructuredContent';

const TermsOfUse = () => {
  const [language, setLanguage] = useState('en');

  const getOriginalTerms = useCallback(() => ({
    sections: [
      {
        title: "Last Updated: December 24, 2024",
        content: null
      },
      {
        title: "1. Acceptance of Terms",
        content: "By accessing and using the Cancer Detective application, you agree to be bound by these Terms of Use."
      },
      {
        title: "2. User Accounts",
        content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account."
      },
      {
        title: "3. Privacy",
        content: "Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your data."
      },
      {
        title: "4. Use License",
        content: "We grant you a limited, non-exclusive, non-transferable license to use our application for personal, non-commercial purposes."
      },
      {
        title: "5. Prohibited Uses",
        content: "You agree not to:",
        subsections: [
          "Use the service for any unlawful purpose",
          "Attempt to gain unauthorized access to any portion of the service",
          "Interfere with or disrupt the service",
          "Sell, resell, or exploit any portion of the service"
        ]
      },
      {
        title: "6. Disclaimer",
        content: "The Cancer Detective application is provided \"as is\" without any warranties, expressed or implied."
      },
      {
        title: "7. Limitation of Liability",
        content: "We shall not be liable for any indirect, incidental, special, consequential, or punitive damages."
      },
      {
        title: "8. Changes to Terms",
        content: "We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms."
      },
      {
        title: "9. Governing Law",
        content: "These terms shall be governed by and construed in accordance with the laws of Sri Lanka."
      },
      {
        title: "10. Contact Information",
        content: "For any questions about these Terms, please visit our contact page."
      }
    ]
  }), []);

  const { translatedContent } = useStructuredContent(getOriginalTerms(), language);

  return (
    <div className="legal-container">
      <div className="header">
        <LanguageSelector 
          onLanguageChange={setLanguage}
          currentLanguage={language}
        />
      </div>
      <div className="content">
        <h1>Terms of Use</h1>
        <ContentSection content={translatedContent} />
      </div>
    </div>
  );
};

export default TermsOfUse;