from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Project, ProjectGroup, ProjectGroupMember, Requirement, Design, Code, Change
from .serializers import (
    UserSerializer, UserCreateSerializer,
    ProjectSerializer, ProjectGroupSerializer, ProjectGroupMemberSerializer,
    RequirementSerializer, DesignSerializer, CodeSerializer, ChangeSerializer
)
import json

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['name'] = user.username
        return token

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]

class RegisterView(viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    serializer_class = UserCreateSerializer
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        project = serializer.save(created_by=self.request.user)
        self.log_change('project', project.id, 'create', None, json.dumps(serializer.data))
    
    def perform_update(self, serializer):
        old_data = json.dumps(ProjectSerializer(self.get_object()).data)
        project = serializer.save()
        new_data = json.dumps(ProjectSerializer(project).data)
        self.log_change('project', project.id, 'update', old_data, new_data)
    
    def perform_destroy(self, instance):
        old_data = json.dumps(ProjectSerializer(instance).data)
        self.log_change('project', instance.id, 'delete', old_data, None)
        instance.delete()
    
    def log_change(self, resource_type, resource_id, action, old_value, new_value):
        Change.objects.create(
            resource_type=resource_type,
            resource_id=resource_id,
            action=action,
            old_value=old_value,
            new_value=new_value,
            user=self.request.user
        )

class ProjectGroupViewSet(viewsets.ModelViewSet):
    queryset = ProjectGroup.objects.all()
    serializer_class = ProjectGroupSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        group = serializer.save(created_by=self.request.user)
        self.log_change('project_group', group.id, 'create', None, json.dumps(serializer.data))
    
    def perform_update(self, serializer):
        old_data = json.dumps(ProjectGroupSerializer(self.get_object()).data)
        group = serializer.save()
        new_data = json.dumps(ProjectGroupSerializer(group).data)
        self.log_change('project_group', group.id, 'update', old_data, new_data)
    
    def perform_destroy(self, instance):
        old_data = json.dumps(ProjectGroupSerializer(instance).data)
        self.log_change('project_group', instance.id, 'delete', old_data, None)
        instance.delete()
    
    def log_change(self, resource_type, resource_id, action, old_value, new_value):
        Change.objects.create(
            resource_type=resource_type,
            resource_id=resource_id,
            action=action,
            old_value=old_value,
            new_value=new_value,
            user=self.request.user
        )

class ProjectGroupMemberViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    
    def add_member(self, request, group_pk=None):
        group = ProjectGroup.objects.get(pk=group_pk)
        user_id = request.data.get('user_id')
        user = User.objects.get(pk=user_id)
        member, created = ProjectGroupMember.objects.get_or_create(group=group, user=user)
        return Response(ProjectGroupMemberSerializer(member).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    
    def remove_member(self, request, group_pk=None, user_pk=None):
        group = ProjectGroup.objects.get(pk=group_pk)
        member = ProjectGroupMember.objects.get(group=group, user_id=user_pk)
        member.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class RequirementViewSet(viewsets.ModelViewSet):
    queryset = Requirement.objects.all()
    serializer_class = RequirementSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        requirement = serializer.save(created_by=self.request.user)
        self.log_change('requirement', requirement.id, 'create', None, json.dumps(serializer.data))
    
    def perform_update(self, serializer):
        old_data = json.dumps(RequirementSerializer(self.get_object()).data)
        requirement = serializer.save()
        new_data = json.dumps(RequirementSerializer(requirement).data)
        self.log_change('requirement', requirement.id, 'update', old_data, new_data)
    
    def perform_destroy(self, instance):
        old_data = json.dumps(RequirementSerializer(instance).data)
        self.log_change('requirement', instance.id, 'delete', old_data, None)
        instance.delete()
    
    def log_change(self, resource_type, resource_id, action, old_value, new_value):
        Change.objects.create(
            resource_type=resource_type,
            resource_id=resource_id,
            action=action,
            old_value=old_value,
            new_value=new_value,
            user=self.request.user
        )

class DesignViewSet(viewsets.ModelViewSet):
    queryset = Design.objects.all()
    serializer_class = DesignSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        design = serializer.save(created_by=self.request.user)
        self.log_change('design', design.id, 'create', None, json.dumps(serializer.data))
    
    def perform_update(self, serializer):
        old_data = json.dumps(DesignSerializer(self.get_object()).data)
        design = serializer.save()
        new_data = json.dumps(DesignSerializer(design).data)
        self.log_change('design', design.id, 'update', old_data, new_data)
    
    def perform_destroy(self, instance):
        old_data = json.dumps(DesignSerializer(instance).data)
        self.log_change('design', instance.id, 'delete', old_data, None)
        instance.delete()
    
    def log_change(self, resource_type, resource_id, action, old_value, new_value):
        Change.objects.create(
            resource_type=resource_type,
            resource_id=resource_id,
            action=action,
            old_value=old_value,
            new_value=new_value,
            user=self.request.user
        )

class CodeViewSet(viewsets.ModelViewSet):
    queryset = Code.objects.all()
    serializer_class = CodeSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        code = serializer.save(created_by=self.request.user)
        self.log_change('code', code.id, 'create', None, json.dumps(serializer.data))
    
    def perform_update(self, serializer):
        old_data = json.dumps(CodeSerializer(self.get_object()).data)
        code = serializer.save()
        new_data = json.dumps(CodeSerializer(code).data)
        self.log_change('code', code.id, 'update', old_data, new_data)
    
    def perform_destroy(self, instance):
        old_data = json.dumps(CodeSerializer(instance).data)
        self.log_change('code', instance.id, 'delete', old_data, None)
        instance.delete()
    
    def log_change(self, resource_type, resource_id, action, old_value, new_value):
        Change.objects.create(
            resource_type=resource_type,
            resource_id=resource_id,
            action=action,
            old_value=old_value,
            new_value=new_value,
            user=self.request.user
        )

class ChangeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Change.objects.all().order_by('-created_at')
    serializer_class = ChangeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        resource_type = self.request.query_params.get('resource_type')
        resource_id = self.request.query_params.get('resource_id')
        queryset = self.queryset
        if resource_type:
            queryset = queryset.filter(resource_type=resource_type)
        if resource_id:
            queryset = queryset.filter(resource_id=resource_id)
        return queryset
