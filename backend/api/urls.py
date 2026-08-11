from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/', views.register_user, name='register_user'),
    path('auth/login/', views.login_user, name='login_user'),
    path('error-library/', views.error_library_list, name='error_library_list'),
    path('puzzles/', views.practice_puzzles_list, name='practice_puzzles_list'),
    path('analyze/', views.analyze_code_view, name='analyze_code'),
    path('submissions/', views.submissions_list, name='submissions_list'),
]
