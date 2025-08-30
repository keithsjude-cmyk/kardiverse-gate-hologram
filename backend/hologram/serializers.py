from rest_framework import serializers
from .models import ScanEvent, SponsorConfiguration, Analytics

class ScanEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScanEvent
        fields = ['id', 'trigger_type', 'device_type', 'user_agent', 'ip_address', 
                 'timestamp', 'session_id', 'demo_completed', 'demo_duration']
        read_only_fields = ['id', 'timestamp']

class SponsorConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SponsorConfiguration
        fields = ['id', 'name', 'logo_url', 'primary_color', 'secondary_color', 
                 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class AnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analytics
        fields = ['date', 'total_scans', 'unique_sessions', 'mobile_scans', 
                 'desktop_scans', 'qr_scans', 'nfc_scans', 'completed_demos', 
                 'avg_demo_duration']