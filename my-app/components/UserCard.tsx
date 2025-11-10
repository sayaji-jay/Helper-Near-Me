import { User } from '@/types';

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Header with Avatar and Name */}
      <div className="flex items-center mb-4">
        <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full mr-4 object-cover" />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
          {user.gender && (
            <p className="text-xs text-gray-500 capitalize">{user.gender}</p>
          )}
        </div>
      </div>

      {/* Description */}
      {user.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{user.description}</p>
      )}

      {/* Contact Information */}
      <div className="space-y-2 mb-4">
        {user.phone && (
          <div className="flex items-center text-sm text-gray-700">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <span>{user.phone}</span>
          </div>
        )}
        {user.email && (
          <div className="flex items-center text-sm text-gray-700">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span className="truncate">{user.email}</span>
          </div>
        )}
      </div>

      {/* Address Information */}
      <div className="mb-4 space-y-1">
        {user.address && (
          <div className="flex items-start text-sm text-gray-700">
            <svg className="w-4 h-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>{user.address}</span>
          </div>
        )}
        {(user.village || user.city || user.state) && (
          <div className="flex items-center text-sm text-gray-600 ml-6">
            <span>
              {[user.village, user.city, user.state].filter(Boolean).join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Company Name */}
      {user.companyName && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-1">Company</p>
          <p className="text-sm text-gray-700">{user.companyName}</p>
        </div>
      )}

      {/* Experience */}
      {user.experience && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-1">Experience</p>
          <p className="text-sm text-gray-700 flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            {user.experience}
          </p>
        </div>
      )}

      {/* Work Types */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">Work Types</p>
        <div className="flex flex-wrap gap-1">
          {user.work && user.work.length > 0 ? (
            user.work.map((workType, index) => (
              <span key={index} className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                {workType}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">No work types specified</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t pt-4 mt-auto">
        <div className="flex space-x-2">
          {user.phone && (
            <a
              href={`tel:${user.phone}`}
              className="flex-1 bg-gray-900 text-white text-center py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Call
            </a>
          )}
          {user.email && (
            <a
              href={`mailto:${user.email}`}
              className="flex-1 border border-gray-300 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
