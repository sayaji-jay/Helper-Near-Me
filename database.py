"""MongoDB Database Configuration and Connection"""
import os
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.errors import ConnectionFailure
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MongoDB:
    """MongoDB Database Manager"""

    def __init__(self):
        # Get MongoDB URI from environment variable or use default
        self.mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
        self.db_name = os.getenv('DB_NAME', 'worker_near_me')
        self.client = None
        self.db = None

    def connect(self):
        """Establish connection to MongoDB"""
        try:
            self.client = MongoClient(self.mongo_uri)
            # Test the connection
            self.client.admin.command('ping')
            self.db = self.client[self.db_name]
            logger.info(f"Successfully connected to MongoDB database: {self.db_name}")

            # Create indexes for better search performance
            self.create_indexes()

            return True
        except ConnectionFailure as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            return False
        except Exception as e:
            logger.error(f"Error connecting to MongoDB: {e}")
            return False

    def create_indexes(self):
        """Create indexes for optimized queries"""
        try:
            users_collection = self.db.users

            # Create text index for search functionality
            users_collection.create_index([
                ('name', 'text'),
                ('location', 'text'),
                ('description', 'text'),
                ('skills', 'text')
            ])

            # Create regular indexes
            users_collection.create_index([('name', ASCENDING)])
            users_collection.create_index([('location', ASCENDING)])
            users_collection.create_index([('skills', ASCENDING)])
            users_collection.create_index([('email', ASCENDING)], unique=True)

            logger.info("Indexes created successfully")
        except Exception as e:
            logger.error(f"Error creating indexes: {e}")

    def get_collection(self, collection_name):
        """Get a collection from the database"""
        if self.db is None:
            self.connect()
        return self.db[collection_name]

    def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")


# Global MongoDB instance
mongodb = MongoDB()


def get_db():
    """Get database instance"""
    if mongodb.db is None:
        mongodb.connect()
    return mongodb.db


def get_users_collection():
    """Get users collection"""
    return mongodb.get_collection('users')
