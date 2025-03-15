import React from 'react';
import PropTypes from 'prop-types';

const LanguageSelector = ({ onLanguageChange, currentLanguage }) => {
  // Main languages to be displayed at the top
  const mainLanguages = [
    { code: 'en', name: 'English (US)' },
    { code: 'si', name: 'සිංහල (Sinhala)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'ja', name: '日本語 (Japanese)' },
    { code: 'ru', name: 'Русский (Russian)' }
  ];

  // Additional languages in alphabetical order
  const additionalLanguages = [
    { code: 'ar', name: 'العربية (Arabic)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'de', name: 'Deutsch (German)' },
    { code: 'es', name: 'Español (Spanish)' },
    { code: 'fr', name: 'Français (French)' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'id', name: 'Bahasa Indonesia (Indonesian)' },
    { code: 'it', name: 'Italiano (Italian)' },
    { code: 'ko', name: '한국어 (Korean)' },
    { code: 'ms', name: 'Bahasa Melayu (Malay)' },
    { code: 'nl', name: 'Nederlands (Dutch)' },
    { code: 'pl', name: 'Polski (Polish)' },
    { code: 'pt', name: 'Português (Portuguese)' },
    { code: 'th', name: 'ไทย (Thai)' },
    { code: 'tr', name: 'Türkçe (Turkish)' },
    { code: 'uk', name: 'Українська (Ukrainian)' },
    { code: 'ur', name: 'اردو (Urdu)' },
    { code: 'vi', name: 'Tiếng Việt (Vietnamese)' },
    { code: 'zh', name: '中文 (Chinese)' }
  ];

  return (
    <div className="language-selector">
      <select 
        value={currentLanguage} 
        onChange={(e) => onLanguageChange(e.target.value)}
        className="language-dropdown"
      >
        {/* Main languages section */}
        {mainLanguages.map(({ code, name }) => (
          <option key={code} value={code}>{name}</option>
        ))}
        
        {/* Divider */}
        <option disabled>──────────</option>
        
        {/* Additional languages section */}
        {additionalLanguages.map(({ code, name }) => (
          <option key={code} value={code}>{name}</option>
        ))}
      </select>
    </div>
  );
};

LanguageSelector.propTypes = {
  onLanguageChange: PropTypes.func.isRequired,
  currentLanguage: PropTypes.string.isRequired
};

export default LanguageSelector;