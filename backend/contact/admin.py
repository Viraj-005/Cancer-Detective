from django.contrib import admin
from .models import ContactFeedback

class ContactFeedbackAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'subject', 'message', 'created_at')  # Changed from submitted_at
    list_filter = ('subject', 'created_at')  # Changed from submitted_at
    search_fields = ('name', 'email', 'subject', 'message')
    ordering = ('-created_at',)  # Changed from submitted_at

    actions = ['mark_as_read', 'delete_selected_messages']

    def mark_as_read(self, request, queryset):
        queryset.update(status='read')
        self.message_user(request, "Selected feedback marked as read.")

    def delete_selected_messages(self, request, queryset):
        queryset.delete()
        self.message_user(request, "Selected feedback messages have been deleted.")

    mark_as_read.short_description = "Mark selected feedback as read"
    delete_selected_messages.short_description = "Delete selected feedback messages"

admin.site.register(ContactFeedback, ContactFeedbackAdmin)