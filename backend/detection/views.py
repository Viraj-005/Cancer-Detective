from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
import logging
import time
from socket import error as socket_error

logger = logging.getLogger(__name__)

from .services import CancerDetectionService


class CancerDetectionView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [AllowAny]

    def post(self, request, cancer_type):
        start_time = time.time()
        logger.info(f"Received detection request for {cancer_type}")
        logger.info(f"Files: {request.FILES}")

        try:
            # Validate file upload
            if 'file' not in request.FILES:
                logger.error('No image file uploaded')
                return Response(
                    {'error': 'No image file uploaded'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            uploaded_file = request.FILES['file']
            logger.info(f"File name: {uploaded_file.name}")
            logger.info(f"File size: {uploaded_file.size}")
            logger.info(f"File type: {uploaded_file.content_type}")

            # Validate file type
            allowed_types = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp']
            if uploaded_file.content_type not in allowed_types:
                logger.error(f'Invalid file type: {uploaded_file.content_type}')
                return Response(
                    {'error': 'Invalid file type. Please upload JPEG or PNG images.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate file size
            if uploaded_file.size > 5 * 1024 * 1024:  # 5MB limit
                logger.error(f'File too large: {uploaded_file.size} bytes')
                return Response(
                    {'error': 'File too large. Maximum size is 5MB.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Perform cancer detection
            detection_result = CancerDetectionService.detect_cancer(
                uploaded_file,
                cancer_type
            )

            logger.info(f'Detection result: {detection_result}')
            logger.info(f"Request processing time: {time.time() - start_time} seconds")

            return Response({
                'prediction': detection_result.get('prediction', 'Error'),
                'probability': detection_result.get('probability', 0.0)
            }, status=status.HTTP_200_OK)

        except socket_error as e:
            logger.error(f"Socket error during detection: {str(e)}")
            return Response(
                {'error': 'Client disconnected during processing.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            logger.error(f'Detection error: {str(e)}', exc_info=True)
            return Response(
                {'error': 'An internal error occurred during detection.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )