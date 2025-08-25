'use client';

import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import dayjs from 'dayjs';
import useAuth from '@/hooks/useAuth';
import useToken from '@/hooks/useToken';
import Image from 'next/image';
import { User } from '@/models/user';
import { Message } from '@/models/chat';

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

function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { user } = useAuth();
  const { getToken } = useToken();
  const [joinUsers, setJoinUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 웹소켓 연결 설정
  const socket = useRef<any>(null);

  useEffect(() => {
    // 토큰 가져오기
    const token = getToken('access');

    if (!token || !user) {
      console.log('No token or user found');
      return;
    }

    // 웹소켓 연결 설정
    socket.current = io('http://localhost:3000', {
      auth: {
        token: token,
        user: user,
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    socket.current.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      socket.current.emit('joinRoom', { id: parseInt(id) });
    });

    socket.current.on('connect_error', (error: any) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    socket.current.on('disconnect', (reason: string) => {
      console.log('Disconnected:', reason);
      setIsConnected(false);
    });

    socket.current.on('userJoined', (message: User) => {
      console.log('join user', message);
      setJoinUsers((prev) => [...prev, message]);
    });

    socket.current.on('newMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.current.on('messageHistory', (history: Message[]) => {
      setMessages(history);
    });

    socket.current.on('error', (error: any) => {
      console.error('Socket error:', error);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [user, id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !isConnected) return;

    // 웹소켓을 통해 메시지 전송
    socket.current.emit('sendMessage', {
      roomId: parseInt(id),
      message: newMessage.trim(),
    });

    setNewMessage('');
  };

  console.log('join users', joinUsers);
  console.log('messages', messages);

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
                  message.user.id === user?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.user.id === user?.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.user.id !== user?.id && (
                    <p className="text-xs font-medium mb-1 opacity-75">
                      {message.user.name}
                    </p>
                  )}
                  <p className="text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.user.id === user?.id
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {dayjs(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}
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
                disabled={!newMessage.trim() || !isConnected}
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
