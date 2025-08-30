'use client';

import { Room } from '@/models/room';

interface ChatHeaderProps {
  room: Room;
  joinUsers: number;
  isConnected: boolean;
  onCLickLeave: () => void;
}

function ChatHeader({
  room,
  joinUsers,
  isConnected,
  onCLickLeave,
}: ChatHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onCLickLeave}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {room?.name}
            </h1>
            <p className="text-sm text-gray-500">
              {joinUsers}명 참여 중 • {room?.description}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* 연결 상태 표시 */}
          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              isConnected
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            ></div>
            <span>{isConnected ? '연결됨' : '연결 안됨'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ChatHeader;
