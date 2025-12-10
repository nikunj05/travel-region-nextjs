/**
 * Translation utility for hotel names and other content
 * Uses browser-based translation capabilities
 */

// Translation cache to avoid repeated translations
const translationCache = new Map<string, string>();

/**
 * Detects if a text string contains Arabic characters
 * @param text - Text to check
 * @returns true if text contains Arabic characters
 */
export const containsArabic = (text: string): boolean => {
  if (!text) return false;
  // Arabic Unicode range: \u0600-\u06FF
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
};

/**
 * Detects if a text string is primarily in English (Latin characters)
 * @param text - Text to check
 * @returns true if text is primarily English/Latin
 */
export const isEnglishText = (text: string): boolean => {
  if (!text) return false;
  
  // Remove common punctuation and numbers
  const cleanedText = text.replace(/[0-9\s\-.,;:!?'"()]/g, '');
  if (cleanedText.length === 0) return false;
  
  // Check if text contains Arabic characters
  if (containsArabic(text)) return false;
  
  // Check if text is primarily Latin characters
  const latinRegex = /^[a-zA-Z\s\-.,;:!?'"()]+$/;
  return latinRegex.test(text);
};

/**
 * Translates English text to Arabic using browser translation
 * Uses Google Translate free endpoint via a simple approach
 * @param text - English text to translate
 * @param locale - Current locale ('ar' or 'en')
 * @returns Promise<string> - Translated text or original if translation fails
 */
export const translateToArabic = async (
  text: string,
  locale: string
): Promise<string> => {
  // Only translate if locale is Arabic and text is in English
  if (locale !== 'ar' || !isEnglishText(text)) {
    return text;
  }

  // Check cache first
  const cacheKey = `ar:${text}`;
  if (translationCache.has(cacheKey)) {
    const cached = translationCache.get(cacheKey)!;
    console.log(`Using cached translation for: "${text}" -> "${cached}"`);
    return cached;
  }

  console.log(`Attempting to translate: "${text}"`);

  try {
    // Try MyMemory Translation API first (better CORS support)
    try {
      const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ar`;
      const fallbackResponse = await fetch(myMemoryUrl, {
        method: 'GET',
        mode: 'cors',
      });

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        console.log('MyMemory Translation response:', fallbackData);
        
        if (fallbackData.responseData && fallbackData.responseData.translatedText) {
          const translatedText = fallbackData.responseData.translatedText.trim();
          
          if (translatedText !== text && translatedText !== '') {
            console.log(`MyMemory Translation success: "${text}" -> "${translatedText}"`);
            translationCache.set(cacheKey, translatedText);
            return translatedText;
          } else {
            console.warn(`MyMemory Translation returned same text for: "${text}"`);
          }
        } else {
          console.warn('MyMemory Translation response format unexpected:', fallbackData);
        }
      } else {
        console.warn(`MyMemory Translation HTTP error: ${fallbackResponse.status}`);
      }
    } catch (memoryError) {
      console.log('MyMemory Translation failed, trying Google Translate...', memoryError);
      
      // Try Google Translate free endpoint as fallback
      try {
        const googleTranslateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(googleTranslateUrl, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Google Translate response:', data);
          
          // Google Translate returns: [[["translated_text", ...], ...], ...]
          if (Array.isArray(data) && data[0] && Array.isArray(data[0]) && data[0][0]) {
            const translatedText = (data[0][0][0] || text).trim();
            
            // Only cache if translation is different from original
            if (translatedText !== text && translatedText !== '') {
              console.log(`Google Translate success: "${text}" -> "${translatedText}"`);
              translationCache.set(cacheKey, translatedText);
              return translatedText;
            } else {
              console.warn(`Google Translate returned same text or empty for: "${text}"`);
            }
          } else {
            console.warn('Google Translate response format unexpected:', data);
          }
        } else {
          console.warn(`Google Translate HTTP error: ${response.status} ${response.statusText}`);
        }
      } catch (googleError) {
        console.error('Google Translate also failed:', googleError);
      }
    }
    
    // If all translation attempts failed, cache original to avoid retries
    console.warn(`All translation attempts failed for: "${text}", using original`);
    translationCache.set(cacheKey, text);
    return text;
  } catch (error) {
    // Handle any unexpected errors
    console.error('Translation error:', error);
    translationCache.set(cacheKey, text);
    return text;
  }
};

/**
 * Translates hotel name if needed based on locale
 * @param hotelName - Hotel name to translate
 * @param locale - Current locale ('ar' or 'en')
 * @returns Promise<string> - Translated or original hotel name
 */
export const translateHotelNameIfNeeded = async (
  hotelName: string,
  locale: string
): Promise<string> => {
  if (!hotelName) return hotelName;
  
  // If locale is Arabic and name is in English, translate it
  if (locale === 'ar' && isEnglishText(hotelName)) {
    return await translateToArabic(hotelName, locale);
  }
  
  return hotelName;
};

/**
 * Synchronous version that returns cached translations immediately
 * Falls back to original text if not cached
 * @param hotelName - Hotel name to translate
 * @param locale - Current locale ('ar' or 'en')
 * @returns string - Translated or original hotel name
 */
export const getCachedTranslation = (
  hotelName: string,
  locale: string
): string => {
  if (!hotelName) return hotelName;
  
  if (locale === 'ar' && isEnglishText(hotelName)) {
    const cacheKey = `ar:${hotelName}`;
    return translationCache.get(cacheKey) || hotelName;
  }
  
  return hotelName;
};

/**
 * Clear translation cache (useful for testing or memory management)
 */
export const clearTranslationCache = (): void => {
  translationCache.clear();
};

