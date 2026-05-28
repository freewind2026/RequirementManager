from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', '管理员'),
        ('manager', '项目经理'),
        ('developer', '开发者'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='developer')
    email = models.EmailField(unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class Project(models.Model):
    STATUS_CHOICES = [
        ('active', '进行中'),
        ('inactive', '已暂停'),
        ('completed', '已完成'),
    ]
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ProjectGroup(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='groups')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ProjectGroupMember(models.Model):
    group = models.ForeignKey(ProjectGroup, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('group', 'user')

class Requirement(models.Model):
    PRIORITY_CHOICES = [
        ('low', '低'),
        ('medium', '中'),
        ('high', '高'),
        ('critical', '紧急'),
    ]
    STATUS_CHOICES = [
        ('pending', '待处理'),
        ('in_progress', '进行中'),
        ('review', '审核中'),
        ('completed', '已完成'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='requirements')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Design(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True, null=True)
    file_url = models.CharField(max_length=500, blank=True, null=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='designs')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Code(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True, null=True)
    branch = models.CharField(max_length=100, default='main')
    commit_hash = models.CharField(max_length=40, blank=True, null=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='codes')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Change(models.Model):
    RESOURCE_TYPE_CHOICES = [
        ('requirement', '需求'),
        ('design', '设计'),
        ('code', '代码'),
    ]
    ACTION_CHOICES = [
        ('create', '创建'),
        ('update', '更新'),
        ('delete', '删除'),
    ]
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPE_CHOICES)
    resource_id = models.IntegerField()
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    old_value = models.TextField(blank=True, null=True)
    new_value = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
