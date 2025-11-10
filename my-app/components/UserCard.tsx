import { User } from '@/types';

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="flex items-center mb-4">
        <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full mr-4" />
        <div>
          <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            {user.village}, {user.city}
          </p>
        </div>
      </div>

      {user.description && <p className="text-gray-600 text-sm mb-4 flex-grow">{user.description}</p>}

      {user.companyName && (
        <p className="text-xs text-gray-500 mb-3">
          <span className="font-semibold">Company:</span> {user.companyName}
        </p>
      )}

      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">WORK TYPE</p>
        <div className="flex flex-wrap gap-1">
          {user.work.map((workType, index) => (
            <span key={index} className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
              {workType}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t pt-4 mt-auto">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            {user.experience}
          </span>
        </div>
        <div className="flex space-x-2">
          <a
            href={`tel:${user.phone}`}
            className="flex-1 bg-gray-900 text-white text-center py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Contact
          </a>
          <a
            href={`mailto:${user.email}`}
            className="flex-1 border border-gray-300 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Email
          </a>
        </div>
      </div>
    </div>
  );
}
