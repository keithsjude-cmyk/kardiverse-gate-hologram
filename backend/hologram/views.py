from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Count, Avg
from datetime import timedelta
from .models import ScanEvent, SponsorConfiguration, Analytics
from .serializers import ScanEventSerializer, SponsorConfigurationSerializer, AnalyticsSerializer

class ScanEventViewSet(viewsets.ModelViewSet):
    queryset = ScanEvent.objects.all()
    serializer_class = ScanEventSerializer
    
    def create(self, request, *args, **kwargs):
        # Auto-populate IP address and process user agent
        data = request.data.copy()
        data['ip_address'] = self.get_client_ip(request)
        data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')
        
        # Determine device type from user agent
        user_agent = data['user_agent'].lower()
        if 'mobile' in user_agent or 'android' in user_agent or 'iphone' in user_agent:
            data['device_type'] = 'mobile'
        elif 'tablet' in user_agent or 'ipad' in user_agent:
            data['device_type'] = 'tablet'
        else:
            data['device_type'] = 'desktop'
            
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Update daily analytics
        self.update_analytics()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def update_analytics(self):
        today = timezone.now().date()
        analytics, created = Analytics.objects.get_or_create(date=today)
        
        # Calculate today's stats
        today_scans = ScanEvent.objects.filter(timestamp__date=today)
        
        analytics.total_scans = today_scans.count()
        analytics.unique_sessions = today_scans.values('session_id').distinct().count()
        analytics.mobile_scans = today_scans.filter(device_type='mobile').count()
        analytics.desktop_scans = today_scans.filter(device_type='desktop').count()
        analytics.qr_scans = today_scans.filter(trigger_type='qr').count()
        analytics.nfc_scans = today_scans.filter(trigger_type='nfc').count()
        analytics.completed_demos = today_scans.filter(demo_completed=True).count()
        
        # Calculate average demo duration
        completed_scans = today_scans.filter(demo_completed=True, demo_duration__isnull=False)
        if completed_scans.exists():
            analytics.avg_demo_duration = completed_scans.aggregate(Avg('demo_duration'))['demo_duration__avg']
        
        analytics.save()
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get scan statistics"""
        period = request.query_params.get('period', '7')  # days
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=int(period))
        
        scans = ScanEvent.objects.filter(timestamp__date__range=[start_date, end_date])
        
        stats = {
            'total_scans': scans.count(),
            'unique_sessions': scans.values('session_id').distinct().count(),
            'by_trigger': dict(scans.values('trigger_type').annotate(count=Count('id')).values_list('trigger_type', 'count')),
            'by_device': dict(scans.values('device_type').annotate(count=Count('id')).values_list('device_type', 'count')),
            'completion_rate': scans.filter(demo_completed=True).count() / max(scans.count(), 1) * 100,
        }
        
        return Response(stats)

class SponsorConfigurationViewSet(viewsets.ModelViewSet):
    queryset = SponsorConfiguration.objects.all()
    serializer_class = SponsorConfigurationSerializer
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get the currently active sponsor configuration"""
        try:
            active_sponsor = SponsorConfiguration.objects.get(is_active=True)
            serializer = self.get_serializer(active_sponsor)
            return Response(serializer.data)
        except SponsorConfiguration.DoesNotExist:
            return Response({'message': 'No active sponsor configuration'}, 
                          status=status.HTTP_404_NOT_FOUND)

class AnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Analytics.objects.all()
    serializer_class = AnalyticsSerializer
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get analytics summary"""
        period = request.query_params.get('period', '30')  # days
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=int(period))
        
        analytics = Analytics.objects.filter(date__range=[start_date, end_date])
        
        summary = {
            'total_scans': sum(a.total_scans for a in analytics),
            'total_unique_sessions': sum(a.unique_sessions for a in analytics),
            'total_completed_demos': sum(a.completed_demos for a in analytics),
            'avg_daily_scans': analytics.aggregate(Avg('total_scans'))['total_scans__avg'] or 0,
            'mobile_percentage': sum(a.mobile_scans for a in analytics) / max(sum(a.total_scans for a in analytics), 1) * 100,
        }
        
        return Response(summary)