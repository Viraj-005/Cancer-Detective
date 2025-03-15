import React, { useState, useEffect } from 'react';
import { translateText } from '../utils/translationService';

const ContentSection = ({ content }) => {
  if (!content || !content.sections) {
    return null;
  }

  return (
    <div className="structured-content">
      {content.sections.map((section, index) => (
        <div key={index} className="content-section">
          {section.title && (
            <h2>{section.title}</h2>
          )}
          {section.content && (
            <p>{section.content}</p>
          )}
          {section.subsections && section.subsections.length > 0 && (
            <ul>
              {section.subsections.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

const useStructuredContent = (originalContent, language) => {
  const [translatedContent, setTranslatedContent] = useState(originalContent);

  const translateSection = async (section) => {
    try {
      const translatedSection = { ...section };
      
      if (section.title) {
        translatedSection.title = await translateText(section.title, language);
      }
      
      if (section.content) {
        translatedSection.content = await translateText(section.content, language);
      }

      if (section.subsections && section.subsections.length > 0) {
        translatedSection.subsections = await Promise.all(
          section.subsections.map(item => translateText(item, language))
        );
      }
      
      return translatedSection;
    } catch (error) {
      console.error('Error translating section:', error);
      return section;
    }
  };

  useEffect(() => {
    let mounted = true;

    const translateContent = async () => {
      if (language === 'en') {
        setTranslatedContent(originalContent);
        return;
      }

      try {
        const translatedSections = await Promise.all(
          originalContent.sections.map(translateSection)
        );

        if (mounted) {
          setTranslatedContent({
            ...originalContent,
            sections: translatedSections
          });
        }
      } catch (error) {
        console.error('Translation failed:', error);
        if (mounted) {
          setTranslatedContent(originalContent);
        }
      }
    };

    translateContent();

    return () => {
      mounted = false;
    };
  }, [language, originalContent]);

  return { translatedContent };
};

export { ContentSection, useStructuredContent };