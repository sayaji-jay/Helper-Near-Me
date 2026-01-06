from flask import Flask, render_template, jsonify, request, send_file
import json
import os
from bson import ObjectId
from datetime import datetime
import pandas as pd
import io

from database import mongodb, get_users_collection
from models import UserModel

app = Flask(__name__, template_folder='templates', static_folder='static')

# Initialize MongoDB connection on startup
@app.before_request
def before_request():
    if mongodb.db is None:
        mongodb.connect()

# Sample data for testimonials
TESTIMONIALS = [
    {
        "name": "Rajesh Kumar",
        "title": "Business Owner",
        "company": "Kumar Enterprises",
        "quote": "Found the perfect electrician for my shop renovation. Quick, professional, and affordable service!",
        "avatar": "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=6366F1&color=fff"
    },
    {
        "name": "Priya Sharma",
        "title": "Homemaker",
        "company": "Mumbai",
        "quote": "Needed a plumber urgently and found one nearby within minutes. Very satisfied with the service quality.",
        "avatar": "https://ui-avatars.com/api/?name=Priya+Sharma&background=EC4899&color=fff"
    },
    {
        "name": "Amit Patel",
        "title": "IT Professional",
        "company": "Tech Solutions",
        "quote": "Great platform to find skilled workers. Hired a carpenter who did an excellent job at a fair price.",
        "avatar": "https://ui-avatars.com/api/?name=Amit+Patel&background=10B981&color=fff"
    },
    {
        "name": "Sunita Desai",
        "title": "Teacher",
        "company": "Delhi Public School",
        "quote": "Very easy to use platform. Found a reliable painter for my house. Highly recommend!",
        "avatar": "https://ui-avatars.com/api/?name=Sunita+Desai&background=F59E0B&color=fff"
    },
    {
        "name": "Vikram Singh",
        "title": "Restaurant Owner",
        "company": "Singh's Kitchen",
        "quote": "Excellent service! Found multiple workers for my restaurant setup. Very professional and timely.",
        "avatar": "https://ui-avatars.com/api/?name=Vikram+Singh&background=3B82F6&color=fff"
    },
    {
        "name": "Anjali Reddy",
        "title": "Architect",
        "company": "Design Studio",
        "quote": "This platform made it so easy to connect with skilled workers for my projects. Absolutely love it!",
        "avatar": "https://ui-avatars.com/api/?name=Anjali+Reddy&background=8B5CF6&color=fff"
    }
]

# Sample data for FAQs
FAQS = [
    {
        "question": "How do I find workers near me?",
        "answer": "Simply enter your location and the type of service you need. Our platform will show you a list of available workers in your area with their ratings and contact details."
    },
    {
        "question": "Is the service free to use?",
        "answer": "Yes! Browsing and contacting workers is completely free for customers. Workers pay a small fee to list their services on our platform."
    },
    {
        "question": "How do I know if a worker is reliable?",
        "answer": "Each worker has a profile with ratings, reviews from previous customers, and verification badges. You can read reviews and check their work history before hiring."
    },
    {
        "question": "What types of services are available?",
        "answer": "We offer a wide range of services including plumbers, electricians, carpenters, painters, cleaners, mechanics, and many more skilled workers."
    },
    {
        "question": "How do I contact a worker?",
        "answer": "Once you find a suitable worker, you can contact them directly through the phone number or WhatsApp button provided on their profile."
    },
    {
        "question": "What if I'm not satisfied with the service?",
        "answer": "You can leave a review and rating for the worker. If there's a serious issue, you can contact our support team and we'll help resolve the matter."
    },
    {
        "question": "Can I hire workers for emergency services?",
        "answer": "Yes! Many workers offer emergency services. Look for workers who have marked their availability for urgent requests."
    },
    {
        "question": "How are workers verified?",
        "answer": "Workers submit their identification documents, skills certificates, and work samples. Our team verifies these before approving their profiles."
    }
]


@app.route('/')
def home():
    """Home page with testimonials and FAQs"""
    return render_template(
        'home.html',
        testimonials=TESTIMONIALS,
        faqs=FAQS,
        app_name="Helper Near Me",
        settings={'app_name': 'Helper Near Me'}
    )


@app.route('/add-user')
def add_user():
    """Add User page - Single and Bulk upload"""
    return render_template('add_user.html', app_name="Helper Near Me")


@app.route('/api/users', methods=['GET'])
def get_users():
    """API endpoint to get users data from MongoDB with search and filter"""
    try:
        users_collection = get_users_collection()

        # Get query parameters
        search = request.args.get('search', '').strip()
        skill_filters = request.args.get('skills', '').strip()  # Changed from 'filter' to 'skills'
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 100))

        # Build query
        query = {}

        # Add search filter
        if search:
            query['$or'] = [
                {'name': {'$regex': search, '$options': 'i'}},
                {'location': {'$regex': search, '$options': 'i'}},
                {'description': {'$regex': search, '$options': 'i'}},
                {'skills': {'$regex': search, '$options': 'i'}},
                {'email': {'$regex': search, '$options': 'i'}},
                {'phone': {'$regex': search, '$options': 'i'}}
            ]

        # Add skill filter - support multiple skills
        if skill_filters and skill_filters != 'all':
            # Split by comma for multiple skills
            skills_list = [s.strip() for s in skill_filters.split(',') if s.strip()]

            if len(skills_list) > 0:
                # User must have at least one of the selected skills
                skill_conditions = [{'skills': {'$regex': skill, '$options': 'i'}} for skill in skills_list]

                # Merge with existing query
                if '$or' in query:
                    # If we already have a search query, we need to combine them with $and
                    query = {
                        '$and': [
                            {'$or': query['$or']},  # Search conditions
                            {'$or': skill_conditions}  # Skill conditions
                        ]
                    }
                else:
                    # No search, just add skill filter
                    query['$or'] = skill_conditions

        # Get total count
        total = users_collection.count_documents(query)

        # Get users with pagination
        skip = (page - 1) * limit
        users_cursor = users_collection.find(query).skip(skip).limit(limit).sort('created_at', -1)

        # Convert to list and serialize
        users = list(users_cursor)
        serialized_users = UserModel.serialize_users(users)

        return jsonify({
            'success': True,
            'users': serialized_users,
            'total': total,
            'page': page,
            'limit': limit,
            'pages': (total + limit - 1) // limit
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'users': []
        }), 500


@app.route('/api/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get a single user by ID"""
    try:
        users_collection = get_users_collection()
        user = users_collection.find_one({'_id': ObjectId(user_id)})

        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404

        return jsonify({
            'success': True,
            'user': UserModel.serialize_user(user)
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new user"""
    try:
        data = request.get_json()

        # Validate data
        is_valid, message = UserModel.validate_user_data(data)
        if not is_valid:
            return jsonify({
                'success': False,
                'error': message
            }), 400

        users_collection = get_users_collection()

        # Check if email already exists
        existing_user = users_collection.find_one({'email': data['email'].lower()})
        if existing_user:
            return jsonify({
                'success': False,
                'error': 'User with this email already exists'
            }), 400

        # Prepare and insert user
        user_data = UserModel.prepare_user_data(data)
        result = users_collection.insert_one(user_data)

        # Get the inserted user
        new_user = users_collection.find_one({'_id': result.inserted_id})

        return jsonify({
            'success': True,
            'message': 'User created successfully',
            'user': UserModel.serialize_user(new_user)
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    """Update an existing user"""
    try:
        data = request.get_json()
        users_collection = get_users_collection()

        # Check if user exists
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404

        # If email is being updated, check if it's already in use
        if 'email' in data and data['email'].lower() != user['email']:
            existing_user = users_collection.find_one({'email': data['email'].lower()})
            if existing_user:
                return jsonify({
                    'success': False,
                    'error': 'Email already in use'
                }), 400

        # Prepare update data
        update_data = UserModel.prepare_user_update(data)

        # Update user
        users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )

        # Get updated user
        updated_user = users_collection.find_one({'_id': ObjectId(user_id)})

        return jsonify({
            'success': True,
            'message': 'User updated successfully',
            'user': UserModel.serialize_user(updated_user)
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user"""
    try:
        users_collection = get_users_collection()

        # Check if user exists
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404

        # Delete user
        users_collection.delete_one({'_id': ObjectId(user_id)})

        return jsonify({
            'success': True,
            'message': 'User deleted successfully'
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/users/bulk-upload', methods=['POST'])
def bulk_upload_users():
    """Bulk upload users from CSV/Excel file"""
    try:
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file uploaded'
            }), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400

        # Read file based on extension
        filename = file.filename.lower()

        if filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file)
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid file format. Please upload CSV or Excel file'
            }), 400

        # Replace NaN values with empty strings
        df = df.fillna('')

        # Convert DataFrame to list of dictionaries
        users_data = df.to_dict('records')

        users_collection = get_users_collection()
        inserted_count = 0
        error_count = 0
        errors = []

        for idx, user_data in enumerate(users_data, start=2):  # Start at 2 (1 is header)
            try:
                # Clean up data - convert any remaining NaN or None to empty string
                for key in user_data:
                    if pd.isna(user_data[key]) or user_data[key] is None:
                        user_data[key] = ''

                # Convert skills from string to list if needed
                if 'skills' in user_data and isinstance(user_data['skills'], str):
                    user_data['skills'] = [s.strip() for s in user_data['skills'].split(',') if s.strip()]

                # Validate data
                is_valid, message = UserModel.validate_user_data(user_data)
                if not is_valid:
                    errors.append(f"Row {idx}: {message}")
                    error_count += 1
                    continue

                # Check if email already exists
                existing_user = users_collection.find_one({'email': user_data['email'].lower()})
                if existing_user:
                    errors.append(f"Row {idx}: Email {user_data['email']} already exists")
                    error_count += 1
                    continue

                # Prepare and insert user
                prepared_user = UserModel.prepare_user_data(user_data)
                users_collection.insert_one(prepared_user)
                inserted_count += 1

            except Exception as e:
                errors.append(f"Row {idx}: {str(e)}")
                error_count += 1

        return jsonify({
            'success': True,
            'message': f'Bulk upload completed. Inserted: {inserted_count}, Errors: {error_count}',
            'inserted': inserted_count,
            'errors': error_count,
            'error_details': errors
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/users/template/download', methods=['GET'])
def download_template():
    """Download CSV template for bulk upload"""
    try:
        # Create template DataFrame
        template_data = {
            'name': ['John Doe'],
            'email': ['john.doe@example.com'],
            'phone': ['+91 98765 43210'],
            'location': ['Mumbai, Maharashtra'],
            'skills': ['Python, Django, Backend'],
            'description': ['Full Stack Developer with 5+ years experience'],
            'experience': ['5 years'],
            'avatar': ['']
        }

        df = pd.DataFrame(template_data)

        # Create CSV in memory
        output = io.BytesIO()
        df.to_csv(output, index=False)
        output.seek(0)

        return send_file(
            output,
            mimetype='text/csv',
            as_attachment=True,
            download_name='users_template.csv'
        )

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/skills', methods=['GET'])
def get_unique_skills():
    """Get all unique skills from users collection"""
    try:
        users_collection = get_users_collection()

        # Use MongoDB aggregation to get unique skills
        pipeline = [
            {'$unwind': '$skills'},
            {'$group': {'_id': '$skills'}},
            {'$sort': {'_id': 1}}
        ]

        result = users_collection.aggregate(pipeline)
        skills = [doc['_id'] for doc in result if doc['_id']]

        return jsonify({
            'success': True,
            'skills': skills,
            'total': len(skills)
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'skills': []
        }), 500


@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors"""
    return render_template('404.html', app_name="Helper Near Me"), 404


@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    return render_template('500.html', app_name="Helper Near Me"), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
