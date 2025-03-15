import axios from 'axios';

// Use environment variables for sensitive data
const GOOGLE_TRANSLATE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY; // Replace with your API key
const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

export const translateText = async (text, targetLanguage) => {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.error('Translation API key missing');
    return text;
  }

  try {
    const response = await axios.post(
      `${GOOGLE_TRANSLATE_API_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        q: text,
        target: targetLanguage,
        source: 'en'
      }
    );
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error.response?.data || error.message);
    return text;
  }
};