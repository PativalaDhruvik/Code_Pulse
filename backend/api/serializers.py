from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ErrorDefinition, Submission, PracticePuzzle

class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='first_name')
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name']

class ErrorDefinitionSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='error_id')
    details = serializers.SerializerMethodField()

    class Meta:
        model = ErrorDefinition
        fields = ['id', 'name', 'severity', 'category', 'description', 'details', 'broken', 'fixed']

    # Translate flat DB details fields into nested structure expected by frontend
    def get_details(self, obj):
        return {
            "newbie": obj.details_newbie,
            "comfortable": obj.details_comfortable,
            "facts": obj.details_facts
        }
        
    # Override representation to map 'error_id' database field to 'id' in JSON
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['id'] = instance.error_id
        return ret

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['id', 'filename', 'date', 'errors', 'warnings', 'score', 'status', 'code', 'issues']
        read_only_fields = ['id', 'date']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Format date as 'YYYY-MM-DD HH:MM' to match the frontend expectations
        if instance.date:
            ret['date'] = instance.date.strftime('%Y-%m-%d %H:%M')
        return ret

class PracticePuzzleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PracticePuzzle
        fields = ['key', 'error_name', 'broken', 'hint', 'solution']
