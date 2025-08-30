from django.contrib import admin
from .models import ScanEvent, SponsorConfiguration, Analytics

@admin.register(ScanEvent)
class ScanEventAdmin(admin.ModelAdmin):
    list_display = ['timestamp', 'trigger_type', 'device_type', 'demo_completed', 'session_id']
    list_filter = ['trigger_type', 'device_type', 'demo_completed', 'timestamp']
    search_fields = ['session_id', 'ip_address']
    readonly_fields = ['timestamp']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related()

@admin.register(SponsorConfiguration)
class SponsorConfigurationAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'primary_color', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Analytics)
class AnalyticsAdmin(admin.ModelAdmin):
    list_display = ['date', 'total_scans', 'unique_sessions', 'completed_demos', 'mobile_scans']
    list_filter = ['date']
    readonly_fields = ['date']
    
    def has_add_permission(self, request):
        return False  # Analytics are auto-generated