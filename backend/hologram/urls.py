from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ScanEventViewSet, SponsorConfigurationViewSet, AnalyticsViewSet

router = DefaultRouter()
router.register(r'scans', ScanEventViewSet)
router.register(r'sponsors', SponsorConfigurationViewSet)
router.register(r'analytics', AnalyticsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]