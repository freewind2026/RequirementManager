from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LoginView, RegisterView, UserViewSet, ProjectViewSet,
    ProjectGroupViewSet, ProjectGroupMemberViewSet,
    RequirementViewSet, DesignViewSet, CodeViewSet, ChangeViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'project-groups', ProjectGroupViewSet)
router.register(r'requirements', RequirementViewSet)
router.register(r'designs', DesignViewSet)
router.register(r'codes', CodeViewSet)
router.register(r'changes', ChangeViewSet)

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='token_obtain_pair'),
    path('auth/register/', RegisterView.as_view({'post': 'create'}), name='register'),
    path('project-groups/<int:group_pk>/members/', ProjectGroupMemberViewSet.as_view({
        'post': 'add_member',
    }), name='add_member'),
    path('project-groups/<int:group_pk>/members/<int:user_pk>/', ProjectGroupMemberViewSet.as_view({
        'delete': 'remove_member',
    }), name='remove_member'),
    path('', include(router.urls)),
]
