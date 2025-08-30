'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import dayjs from 'dayjs';

import useAuth from '@/hooks/useAuth';
import useToken from '@/hooks/useToken';
import useChat from '@/hooks/useChat';

import { User } from '@/models/user';
import { Message } from '@/models/chat';

import Modal from '@/components/modal/PortalModal';

function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { user } = useAuth();
  const { getToken } = useToken();
  const { room } = useChat(parseInt(id));
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);
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
    socket.current = io('http://localhost:3000/chat', {
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

    // 사용자 입장
    socket.current.on('userJoined', (user: User) => {
      setJoinUsers((prev) => [...prev, user]);
    });

    // 방 참여자 목록
    socket.current.on('roomUsers', (users: User[]) => {
      setJoinUsers(users);
    });

    // 새 메시지
    socket.current.on('newMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // 메시지 히스토리
    socket.current.on('messageHistory', (history: Message[]) => {
      setMessages(history);
    });

    // 사용자 퇴장
    socket.current.on('userLeft', (user: User) => {
      setJoinUsers((prev) => prev.filter((u) => u.id !== user.id));
    });

    socket.current.on('error', (error: any) => {
      console.error('Socket error:', error);
      setModalContent(
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg font-bold">{error.message}</p>
        </div>
      );
      setModalFooter(
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => {
            setIsOpen(false);
            router.back();
          }}
        >
          확인
        </button>
      );
      setIsOpen(true);
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

  // 방 나가기 확인 모달
  const confirmLeaveRoom = () => {
    setModalContent(
      <div className="flex flex-col items-center justify-center">
        <p className="text-lg font-bold">정말 나가시겠습니까?</p>
      </div>
    );
    setModalFooter(
      <div className="flex justify-end space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleLeaveRoom}
        >
          확인
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
          onClick={() => setIsOpen(false)}
        >
          취소
        </button>
      </div>
    );
    setIsOpen(true);
  };

  const handleLeaveRoom = () => {
    socket.current.emit('leaveRoom', { roomId: parseInt(id) });
    router.push('/');
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        content={modalContent}
        footer={modalFooter}
      />
      <div className="h-screen flex flex-col bg-gray-50">
        {/* 상단 헤더 */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={confirmLeaveRoom}
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
                  {joinUsers.length}명 참여 중 • {room?.description}
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

        {/* 메인 컨텐츠 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 왼쪽: 참여자 목록 */}
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
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
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
                    message.user.id === user?.id
                      ? 'justify-end'
                      : 'justify-start'
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
    </>
  );
}

export default ChatPage;
