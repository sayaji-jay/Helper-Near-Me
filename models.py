"""User Models and Schemas"""
from typing import List, Optional
from datetime import datetime


class UserModel:
    """User data model"""

    @staticmethod
    def validate_user_data(data: dict) -> tuple[bool, str]:
        """Validate user data"""
        required_fields = ['name', 'email', 'phone', 'location', 'skills', 'description', 'experience']

        for field in required_fields:
            if field not in data or not data[field]:
                return False, f"Missing required field: {field}"

        # Validate email format
        if '@' not in data['email']:
            return False, "Invalid email format"

        # Validate skills is a list
        if not isinstance(data['skills'], list) or len(data['skills']) == 0:
            return False, "Skills must be a non-empty list"

        return True, "Valid"

    @staticmethod
    def prepare_user_data(data: dict) -> dict:
        """Prepare user data for MongoDB insertion"""
        user_data = {
            'name': data.get('name', '').strip(),
            'email': data.get('email', '').strip().lower(),
            'phone': data.get('phone', '').strip(),
            'location': data.get('location', '').strip(),
            'skills': data.get('skills', []),
            'description': data.get('description', '').strip(),
            'experience': data.get('experience', '').strip(),
            'avatar': str(data.get('avatar', '')).strip(),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }

        # Generate avatar if not provided or is NaN
        if not user_data['avatar'] or user_data['avatar'].lower() == 'nan':
            name = user_data['name'].replace(' ', '+')
            user_data['avatar'] = f"https://ui-avatars.com/api/?name={name}&background=667eea&color=fff&size=200"

        return user_data

    @staticmethod
    def prepare_user_update(data: dict) -> dict:
        """Prepare user data for update"""
        update_data = {}

        if 'name' in data:
            update_data['name'] = data['name'].strip()
        if 'email' in data:
            update_data['email'] = data['email'].strip().lower()
        if 'phone' in data:
            update_data['phone'] = data['phone'].strip()
        if 'location' in data:
            update_data['location'] = data['location'].strip()
        if 'skills' in data:
            update_data['skills'] = data['skills']
        if 'description' in data:
            update_data['description'] = data['description'].strip()
        if 'experience' in data:
            update_data['experience'] = data['experience'].strip()
        if 'avatar' in data:
            update_data['avatar'] = data['avatar']

        update_data['updated_at'] = datetime.utcnow()

        return update_data

    @staticmethod
    def serialize_user(user: dict) -> dict:
        """Convert MongoDB user document to JSON-serializable format"""
        if user is None:
            return None

        # Get avatar, if empty generate default
        avatar = user.get('avatar', '')
        if not avatar or avatar == 'NaN' or str(avatar).lower() == 'nan':
            name = user.get('name', 'User').replace(' ', '+')
            avatar = f"https://ui-avatars.com/api/?name={name}&background=667eea&color=fff&size=200"

        serialized = {
            'id': str(user['_id']),
            'name': user.get('name', ''),
            'email': user.get('email', ''),
            'phone': user.get('phone', ''),
            'location': user.get('location', ''),
            'skills': user.get('skills', []),
            'description': user.get('description', ''),
            'experience': user.get('experience', ''),
            'avatar': avatar,
            'created_at': user.get('created_at', ''),
            'updated_at': user.get('updated_at', '')
        }

        return serialized

    @staticmethod
    def serialize_users(users: list) -> list:
        """Convert list of MongoDB user documents to JSON-serializable format"""
        return [UserModel.serialize_user(user) for user in users]
