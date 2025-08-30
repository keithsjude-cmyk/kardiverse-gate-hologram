from django.db import models
from django.utils import timezone

class ScanEvent(models.Model):
    TRIGGER_CHOICES = [
        ('qr', 'QR Code'),
        ('nfc', 'NFC'),
        ('manual', 'Manual Trigger'),
    ]
    
    DEVICE_CHOICES = [
        ('mobile', 'Mobile'),
        ('tablet', 'Tablet'),
        ('desktop', 'Desktop'),
        ('beamer', 'Beamer/Projector'),
        ('unknown', 'Unknown'),
    ]
    
    trigger_type = models.CharField(max_length=10, choices=TRIGGER_CHOICES)
    device_type = models.CharField(max_length=10, choices=DEVICE_CHOICES, default='unknown')
    user_agent = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)
    session_id = models.CharField(max_length=100, blank=True)
    demo_completed = models.BooleanField(default=False)
    demo_duration = models.DurationField(null=True, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
        
    def __str__(self):
        return f"{self.trigger_type} scan on {self.timestamp} ({self.device_type})"

class SponsorConfiguration(models.Model):
    name = models.CharField(max_length=100)
    logo_url = models.URLField(blank=True)
    primary_color = models.CharField(max_length=7, default='#0066ff')  # Hex color
    secondary_color = models.CharField(max_length=7, default='#00ccff')
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
        
    def save(self, *args, **kwargs):
        if self.is_active:
            # Ensure only one sponsor configuration is active at a time
            SponsorConfiguration.objects.filter(is_active=True).update(is_active=False)
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.name} ({'Active' if self.is_active else 'Inactive'})"

class Analytics(models.Model):
    date = models.DateField()
    total_scans = models.IntegerField(default=0)
    unique_sessions = models.IntegerField(default=0)
    mobile_scans = models.IntegerField(default=0)
    desktop_scans = models.IntegerField(default=0)
    qr_scans = models.IntegerField(default=0)
    nfc_scans = models.IntegerField(default=0)
    completed_demos = models.IntegerField(default=0)
    avg_demo_duration = models.DurationField(null=True, blank=True)
    
    class Meta:
        unique_together = ['date']
        ordering = ['-date']
        
    def __str__(self):
        return f"Analytics for {self.date} - {self.total_scans} scans"