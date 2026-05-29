from rest_framework import serializers
from .models import User, Project, ProjectGroup, ProjectGroupMember, Requirement, Design, Code, Change

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'role', 'date_joined']
        read_only_fields = ['id', 'created_at']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'role']
        read_only_fields = ['id']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data.get('role', 'developer')
        )
        return user

class ProjectSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'status', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class ProjectGroupSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    member_count = serializers.IntegerField(source='members.count', read_only=True)
    
    class Meta:
        model = ProjectGroup
        fields = ['id', 'name', 'description', 'project', 'created_by', 'member_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class ProjectGroupMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ProjectGroupMember
        fields = ['id', 'user', 'joined_at']
        read_only_fields = ['id', 'joined_at']

class RequirementSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    
    class Meta:
        model = Requirement
        fields = ['id', 'title', 'description', 'priority', 'status', 'project', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class DesignSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    
    class Meta:
        model = Design
        fields = ['id', 'title', 'content', 'file_url', 'project', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class CodeSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    
    class Meta:
        model = Code
        fields = ['id', 'title', 'content', 'branch', 'commit_hash', 'project', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class ChangeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Change
        fields = ['id', 'resource_type', 'resource_id', 'action', 'old_value', 'new_value', 'user', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
