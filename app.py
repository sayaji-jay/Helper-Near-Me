from flask import Flask, render_template, jsonify
import json
import os

app = Flask(__name__, template_folder='templates', static_folder='static')

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


@app.route('/api/users')
def get_users():
    """API endpoint to get users data from JSON file"""
    try:
        # Get the path to the users.json file
        data_file = os.path.join(os.path.dirname(__file__), 'data', 'users.json')

        # Read the JSON file
        with open(data_file, 'r', encoding='utf-8') as f:
            users = json.load(f)

        return jsonify({
            'success': True,
            'users': users,
            'total': len(users)
        })
    except FileNotFoundError:
        return jsonify({
            'success': False,
            'error': 'Users data file not found',
            'users': []
        }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'users': []
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
