from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ContactFeedback
from .serializers import ContactFeedbackSerializer
from django.conf import settings

class ContactFeedbackView(APIView):
    permission_classes = []  # No authentication required for this endpoint

    def post(self, request):
        serializer = ContactFeedbackSerializer(data=request.data)
        if serializer.is_valid():
            # Save feedback to the database
            feedback = serializer.save()

            # Prepare email content
            subject = f"New {feedback.subject} Submitted"
            message = (
                f"Subject: {feedback.subject}\n\n"
                f"Name: {feedback.name or 'Anonymous'}\n"
                f"Email: {feedback.email or 'Not Provided'}\n\n"
                f"Message:\n{feedback.message}\n"
            )

            try:
                # Send the email
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.EMAIL_HOST_USER,  # Use email from settings
                    recipient_list=[settings.EMAIL_HOST_USER],  # Use recipient from settings
                    fail_silently=False,
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to send email: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            return Response(
                {"message": f"Your {feedback.subject.lower()} has been sent successfully!"},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
