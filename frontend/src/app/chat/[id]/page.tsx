'use client';

import { useState, useEffect, useRef } from 'react';
import useAuth from '@/hooks/useAuth';
import Image from 'next/image';

// 임시 데이터 (나중에 API로 교체)
const mockRoom = {
  id: '1',
  name: '개발자 채팅방',
  description: '개발 관련 이야기를 나누는 방입니다.',
  isPrivate: false,
  maxUsers: 10,
  currentUsers: 5,
};

const mockParticipants = [
  { id: '1', name: '김개발', profileImage: null },
  { id: '2', name: '이디자인', profileImage: null },
  { id: '3', name: '박기획', profileImage: null },
  { id: '4', name: '최프론트', profileImage: null },
  { id: '5', name: '정백엔드', profileImage: null },
];

interface Message {
  id: string;
  userId: number;
  userName: string;
  message: string;
  timestamp: Date;
}

const mockMessages: Message[] = [
  {
    id: '1',
    userId: 1,
    userName: '김개발',
    message: '안녕하세요! 오늘 날씨가 좋네요.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    userId: 2,
    userName: '이디자인',
    message: '네, 정말 좋은 날씨입니다!',
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: '3',
    userId: 3,
    userName: '박기획',
    message: '오늘 회의 시간에 대해 논의해볼까요?',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
  {
    id: '4',
    userId: 1,
    userName: '김개발',
    message: '좋은 아이디어네요! 오후 2시는 어떠신가요?',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: '5',
    userId: 4,
    userName: '최프론트',
    message: '저도 2시에 가능합니다!',
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
  },
];

function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      message: newMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
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
                {mockRoom.name}
              </h1>
              <p className="text-sm text-gray-500">
                {mockRoom.currentUsers}명 참여 중 • {mockRoom.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 왼쪽: 참여자 목록 */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              참여자 ({mockParticipants.length})
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockParticipants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    {participant.profileImage ? (
                      <Image
                        src={participant.profileImage}
                        alt={participant.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-medium">
                        {participant.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {participant.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: 채팅 메시지 */}
        <div className="flex-1 flex flex-col bg-white">
          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.userId === user?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.userId === user?.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.userId !== user?.id && (
                    <p className="text-xs font-medium mb-1 opacity-75">
                      {message.userName}
                    </p>
                  )}
                  <p className="text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.userId === user?.id
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 메시지 입력 */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                전송
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
