from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('VIEWER', 'Viewer'),
    )
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='VIEWER')
    phone = models.CharField(max_length=15, blank=True)
    department = models.CharField(max_length=50, blank=True)

    # Resolve related_name clashes for groups and user_permissions
    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_groups",  # Use a unique related_name
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions",  # Use a unique related_name
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    def __str__(self):
        return self.email
