from django.contrib import admin
from .models import ErrorDefinition, Submission, PracticePuzzle

@admin.register(ErrorDefinition)
class ErrorDefinitionAdmin(admin.ModelAdmin):
    list_display = ('error_id', 'name', 'severity', 'category')
    search_fields = ('name', 'error_id', 'description')
    list_filter = ('severity', 'category')

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'filename', 'score', 'status', 'date')
    search_fields = ('filename', 'status', 'user__username')
    list_filter = ('status', 'date')

@admin.register(PracticePuzzle)
class PracticePuzzleAdmin(admin.ModelAdmin):
    list_display = ('key', 'error_name')
    search_fields = ('key', 'error_name')
