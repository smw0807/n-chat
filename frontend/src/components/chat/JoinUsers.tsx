import Image from 'next/image';
import { User } from '@/models/user';

function JoinUsers({ joinUsers }: { joinUsers: User[] }) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          참여자 ({joinUsers.length})
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {joinUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                {user.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt={user.name}
                    width={50}
                    height={50}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-medium">
                    {user.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JoinUsers;
