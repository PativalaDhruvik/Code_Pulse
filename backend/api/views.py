from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import ErrorDefinition, Submission, PracticePuzzle
from .serializers import ErrorDefinitionSerializer, SubmissionSerializer, PracticePuzzleSerializer
from .analyzer import analyze_code
from .initial_data import INITIAL_ERRORS, INITIAL_PUZZLES

def check_and_seed_db():
    """Seed ErrorDefinitions and PracticePuzzles if the DB is empty."""
    if ErrorDefinition.objects.count() == 0:
        for err in INITIAL_ERRORS:
            ErrorDefinition.objects.get_or_create(
                error_id=err["id"],
                defaults={
                    "name": err["name"],
                    "severity": err["severity"],
                    "category": err["category"],
                    "description": err["description"],
                    "details_newbie": err["details_newbie"],
                    "details_comfortable": err["details_comfortable"],
                    "details_facts": err["details_facts"],
                    "broken": err.get("broken", ""),
                    "fixed": err.get("fixed", "")
                }
            )
    if PracticePuzzle.objects.count() == 0:
        for puz in INITIAL_PUZZLES:
            PracticePuzzle.objects.get_or_create(
                key=puz["key"],
                defaults={
                    "error_name": puz["error_name"],
                    "broken": puz["broken"],
                    "hint": puz["hint"],
                    "solution": puz["solution"]
                }
            )

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    name = request.data.get('name')
    email = request.data.get('email')
    password = request.data.get('password')

    if not name or not email or not password:
        return Response({"error": "Please fill in all fields"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=email).exists():
        return Response({"error": "User with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    # Create standard Django user, mapping email to username
    user = User.objects.create_user(username=email, email=email, password=password)
    user.first_name = name
    user.save()

    # Generate auth token
    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        "name": user.first_name,
        "email": user.email,
        "token": token.key
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "Please fill in all fields"}, status=status.HTTP_400_BAD_REQUEST)

    # Since username is mapped to email
    user = authenticate(username=email, password=password)
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "name": user.first_name,
            "email": user.email,
            "token": token.key
        }, status=status.HTTP_200_OK)
    
    # Check if this is the fallback/mock demo user from context
   
    if email == "alex.mercer@codepulse.io":
        user, created = User.objects.get_or_create(
            username=email,
            defaults={
                "email": email,
                "first_name": "Alex Mercer"
            }
        )
        if created:
            user.set_password("demopassword123")
            user.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "name": user.first_name,
            "email": user.email,
            "token": token.key
        }, status=status.HTTP_200_OK)

    return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([AllowAny])
def error_library_list(request):
    check_and_seed_db()
    errors = ErrorDefinition.objects.all()
    serializer = ErrorDefinitionSerializer(errors, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def practice_puzzles_list(request):
    check_and_seed_db()
    puzzles = PracticePuzzle.objects.all()
    serializer = PracticePuzzleSerializer(puzzles, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_code_view(request):
    code = request.data.get('code', '')
    check_and_seed_db()
    
    # Build dictionary map of current error details for the analyzer script
    errors_dict = {}
    for err in ErrorDefinition.objects.all():
        errors_dict[err.error_id] = {
            "name": err.name,
            "details": {
                "newbie": err.details_newbie,
                "comfortable": err.details_comfortable,
                "facts": err.details_facts
            }
        }

    results = analyze_code(code, errors_dict)
    return Response(results)

@api_view(['GET', 'POST'])
def submissions_list(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            submissions = Submission.objects.filter(user=request.user).order_by('-date')
        else:
            submissions = Submission.objects.filter(user__isnull=True).order_by('-date')
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = SubmissionSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user if request.user.is_authenticated else None
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
