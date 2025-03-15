from django.urls import path
from .views import CancerDetectionView

urlpatterns = [
    path('cancer/<str:cancer_type>/', CancerDetectionView.as_view(), name='cancer-detection'),
]
