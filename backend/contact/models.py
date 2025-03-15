from django.db import models

class ContactFeedback(models.Model):
    SUBJECT_CHOICES = [
        ('General Inquiry', 'General Inquiry'),
        ('Feedback', 'Feedback'),
        ('Bug Report', 'Bug Report'),
        ('Feature Request', 'Feature Request'),
    ]

    name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    subject = models.CharField(max_length=50, choices=SUBJECT_CHOICES)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.subject} - {self.email or "Anonymous"}'
