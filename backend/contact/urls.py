from django.urls import path
from .views import ContactFeedbackView

urlpatterns = [
    path('contact-feedback/', ContactFeedbackView.as_view(), name='contact-feedback'),
]
