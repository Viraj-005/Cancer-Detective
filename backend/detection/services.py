import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class CancerDetectionService:
    @staticmethod
    def detect_cancer(image_file, cancer_type):
        try:
            if cancer_type not in settings.CANCER_DETECTION_APIS:
                raise ValueError(f"Invalid cancer type: {cancer_type}")
            
            api_url = settings.CANCER_DETECTION_APIS[cancer_type]
            files = {'file': (image_file.name, image_file, image_file.content_type)}
            
            response = requests.post(
                api_url, 
                files=files,
                timeout=300  # 300 seconds timeout
            )
            
            response.raise_for_status()
            
            result = response.json()
            return {
                'prediction': result.get('prediction', 'Unable to determine'),
                'probability': result.get('probability', 0.0)
            }
        
        except requests.RequestException as e:
            logger.error(f"API Request Error for {cancer_type}: {str(e)}", exc_info=True)
            return {
                'prediction': 'Error in detection',
                'probability': 0.0,
                'error': str(e)
            }
        except Exception as e:
            logger.error(f"Unexpected error in cancer detection: {str(e)}", exc_info=True)
            return {
                'prediction': 'System Error',
                'probability': 0.0,
                'error': 'Internal system error'
            }