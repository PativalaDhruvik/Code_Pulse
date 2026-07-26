from django.db import models
from django.contrib.auth.models import User

class ErrorDefinition(models.Model):
    error_id = models.CharField(max_length=100, unique=True, primary_key=True)
    name = models.CharField(max_length=200)
    severity = models.CharField(max_length=50) # e.g. Warning, Error
    category = models.CharField(max_length=100) # e.g. Style, Syntax, Logic
    description = models.TextField()
    details_newbie = models.TextField()
    details_comfortable = models.TextField()
    details_facts = models.TextField()
    broken = models.TextField(blank=True, null=True)
    fixed = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.severity}: {self.name} ({self.error_id})"

class Submission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions', null=True, blank=True)
    filename = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)
    errors = models.IntegerField(default=0)
    warnings = models.IntegerField(default=0)
    score = models.IntegerField(default=100)
    status = models.CharField(max_length=100)
    code = models.TextField()
    issues = models.JSONField(default=list) # List of dicts containing issues information

    def __str__(self):
        user_str = self.user.username if self.user else "Anonymous"
        return f"Submission by {user_str} - {self.filename} ({self.score}%)"

class PracticePuzzle(models.Model):
    key = models.CharField(max_length=100, unique=True, primary_key=True)
    error_name = models.CharField(max_length=200)
    broken = models.TextField()
    hint = models.TextField()
    solution = models.TextField()

    def __str__(self):
        return f"Puzzle: {self.error_name} ({self.key})"
