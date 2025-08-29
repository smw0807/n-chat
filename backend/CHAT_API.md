# N-Chat API 가이드

## 📋 개요

N-Chat은 Next.js 프론트엔드와 NestJS 백엔드로 구성된 실시간 채팅 애플리케이션입니다. WebSocket을 통한 실시간 통신과 소셜 로그인(Google, Kakao)을 지원합니다.

## 🔐 인증

모든 API 요청과 WebSocket 연결에는 JWT 토큰이 필요합니다.

### HTTP 요청 시 인증

```http
Authorization: Bearer <JWT_TOKEN>
```

### WebSocket 연결 시 인증

```javascript
const socket = io('http://localhost:3000/chat', {
  auth: {
    token: 'your_jwt_token_here',
    user: {
      id: 'user_id',
      name: 'user_name',
      email: 'user_email',
    },
  },
});
```

## 🌐 REST API 엔드포인트

### 인증 (Auth)

#### 1. 이메일 로그인

```http
POST /api/auth/login
Content-Type: application/json
Authorization: Basic <base64_encoded_email:password>

Response:
{
  "success": true,
  "message": "이메일 로그인 성공",
  "token": {
    "access_token": "jwt_access_token",
    "refresh_token": "jwt_refresh_token"
  }
}
```

#### 2. 토큰 검증

```http
POST /api/auth/verify/token
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "success": true,
  "message": "토큰 검증 성공",
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

#### 3. 토큰 재발급

```http
POST /api/auth/refresh/token
Authorization: Bearer <JWT_REFRESH_TOKEN>

Response:
{
  "access_token": "new_jwt_access_token",
  "refresh_token": "new_jwt_refresh_token"
}
```

### 소셜 로그인

#### 1. Google 로그인

```http
GET /api/auth/google/signin

Response:
{
  "success": true,
  "message": "구글 로그인 페이지 이동",
  "url": "https://accounts.google.com/oauth/authorize?..."
}
```

```http
GET /api/auth/google/callback?code=<AUTHORIZATION_CODE>

Response:
{
  "access_token": "jwt_access_token",
  "refresh_token": "jwt_refresh_token",
  "google_tokens": {
    "access_token": "google_access_token",
    "refresh_token": "google_refresh_token",
    "token_type": "Bearer",
    "expiry_date": 1234567890
  }
}
```

#### 2. Kakao 로그인

```http
GET /api/auth/kakao/signin

Response:
{
  "success": true,
  "message": "카카오 로그인 페이지 이동",
  "url": "https://kauth.kakao.com/oauth/authorize?..."
}
```

```http
GET /api/auth/kakao/callback?code=<AUTHORIZATION_CODE>

Response:
{
  "access_token": "jwt_access_token",
  "refresh_token": "jwt_refresh_token",
  "kakao_tokens": {
    "access_token": "kakao_access_token",
    "token_type": "bearer"
  }
}
```

### 사용자 관리 (Users)

#### 1. 회원가입

```http
POST /api/users/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}

Response:
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### 2. 이메일 중복 확인

```http
GET /api/users/check-email?email=user@example.com

Response: true (중복) 또는 false (사용 가능)
```

#### 3. 사용자 정보 조회

```http
GET /api/users/:email
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "profileImage": "https://...",
  "lastLoginAt": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### 4. 전체 사용자 목록 조회

```http
GET /api/users
Authorization: Bearer <JWT_TOKEN>

Response:
[
  {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "profileImage": "https://...",
    "lastLoginAt": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### 5. 사용자 삭제

```http
DELETE /api/users/:email
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "message": "User deleted successfully"
}
```

### 채팅방 관리 (Chat)

#### 1. 채팅방 목록 조회

```http
GET /api/chat/rooms

Response:
[
  {
    "id": 1,
    "name": "일반 채팅방",
    "description": "일반적인 대화를 나누는 방입니다",
    "maxUsers": 10,
    "isPrivate": false,
    "currentUsers": 3,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### 2. 채팅방 정보 조회

```http
GET /api/chat/rooms/:roomId

Response:
{
  "id": 1,
  "name": "일반 채팅방",
  "description": "일반적인 대화를 나누는 방입니다",
  "maxUsers": 10,
  "isPrivate": false,
  "currentUsers": 3,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### 3. 채팅방 생성

```http
POST /api/chat/rooms
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "새로운 채팅방",
  "description": "새로 만든 채팅방입니다",
  "maxUsers": 10,
  "isPrivate": false,
  "password": "optional_password"
}

Response:
{
  "id": 2,
  "name": "새로운 채팅방",
  "description": "새로 만든 채팅방입니다",
  "maxUsers": 10,
  "isPrivate": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### 4. 비밀번호 확인 (비공개 방)

```http
POST /api/chat/rooms/check-password
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "roomId": 1,
  "password": "room_password"
}

Response:
{
  "success": true,
  "message": "비밀번호가 일치합니다"
}
```

#### 5. 채팅방 삭제

```http
DELETE /api/chat/rooms/:roomId
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "message": "Room deleted successfully"
}
```

#### 6. 채팅방 메시지 조회

```http
GET /api/chat/room/:roomId/messages

Response:
[
  {
    "id": 1,
    "message": "안녕하세요!",
    "userId": "user_id",
    "roomId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "profileImage": "https://..."
    }
  }
]
```

#### 7. 최근 메시지 조회

```http
GET /api/chat/room/:roomId/recent?limit=20

Response:
[
  {
    "id": 1,
    "message": "안녕하세요!",
    "userId": "user_id",
    "roomId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "profileImage": "https://..."
    }
  }
]
```

## 🔌 WebSocket 이벤트

### 연결 설정

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/chat', {
  auth: {
    token: 'your_jwt_token_here',
    user: {
      id: 'user_id',
      name: 'user_name',
      email: 'user_email',
    },
  },
});
```

### 클라이언트 → 서버 이벤트

#### 1. 방 입장

```javascript
socket.emit('joinRoom', {
  id: 1,
  name: '채팅방 이름',
  description: '채팅방 설명',
  maxUsers: 10,
  isPrivate: false,
});
```

#### 2. 방 나가기

```javascript
socket.emit('leaveRoom', {
  roomId: 1,
});
```

#### 3. 메시지 전송

```javascript
socket.emit('sendMessage', {
  roomId: 1,
  message: '안녕하세요!',
});
```

#### 4. 타이핑 상태 전송

```javascript
socket.emit('typing', {
  roomId: 1,
  isTyping: true,
});
```

#### 5. 메시지 히스토리 요청

```javascript
socket.emit('getMessageHistory', {
  roomId: 1,
  limit: 50,
});
```

### 서버 → 클라이언트 이벤트

#### 1. 사용자 입장 알림

```javascript
socket.on('userJoined', (user) => {
  console.log('사용자 입장:', user);
  // user: { id, name, email, roomId }
});
```

#### 2. 사용자 퇴장 알림

```javascript
socket.on('userLeft', (user) => {
  console.log('사용자 퇴장:', user);
  // user: { id, name, email }
});
```

#### 3. 새 메시지 수신

```javascript
socket.on('newMessage', (messageData) => {
  console.log('새 메시지:', messageData);
  // messageData: { id, message, timestamp, user }
});
```

#### 4. 타이핑 상태 수신

```javascript
socket.on('userTyping', (typingData) => {
  console.log('타이핑 상태:', typingData);
  // typingData: { userId, username, isTyping }
});
```

#### 5. 메시지 히스토리 수신

```javascript
socket.on('messageHistory', (messages) => {
  console.log('메시지 히스토리:', messages);
  // messages: Array<{ id, message, timestamp, user }>
});
```

#### 6. 방 사용자 목록 수신

```javascript
socket.on('roomUsers', (users) => {
  console.log('방 사용자 목록:', users);
  // users: Array<{ id, name, email, roomId }>
});
```

#### 7. 에러 메시지

```javascript
socket.on('error', (error) => {
  console.error('에러:', error);
  // error: { message: string }
});

socket.on('messageError', (error) => {
  console.error('메시지 에러:', error);
  // error: { error: string, details: string }
});
```

## 📱 프론트엔드 연결 예시

### Socket.IO 클라이언트 설정

```javascript
import { io } from 'socket.io-client';

class ChatService {
  constructor() {
    this.socket = null;
    this.token = localStorage.getItem('access_token');
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  connect() {
    this.socket = io('http://localhost:3000/chat', {
      auth: {
        token: this.token,
        user: this.user,
      },
    });

    this.socket.on('connect', () => {
      console.log('서버에 연결되었습니다');
    });

    this.socket.on('disconnect', () => {
      console.log('서버와 연결이 끊어졌습니다');
    });

    this.socket.on('connect_error', (error) => {
      console.error('연결 에러:', error);
      if (error.message === 'Invalid token') {
        // 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
        window.location.href = '/login';
      }
    });
  }

  joinRoom(room) {
    this.socket.emit('joinRoom', room);
  }

  leaveRoom(roomId) {
    this.socket.emit('leaveRoom', { roomId });
  }

  sendMessage(roomId, message) {
    this.socket.emit('sendMessage', { roomId, message });
  }

  onNewMessage(callback) {
    this.socket.on('newMessage', callback);
  }

  onUserJoined(callback) {
    this.socket.on('userJoined', callback);
  }

  onUserLeft(callback) {
    this.socket.on('userLeft', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default ChatService;
```

### React Hook 예시

```javascript
import { useEffect, useState } from 'react';
import ChatService from './ChatService';

export const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [chatService] = useState(() => new ChatService());

  useEffect(() => {
    chatService.connect();

    chatService.onNewMessage((message) => {
      setMessages((prev) => [...prev, message]);
    });

    chatService.onUserJoined((user) => {
      setUsers((prev) => [...prev, user]);
    });

    chatService.onUserLeft((user) => {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    });

    return () => {
      chatService.disconnect();
    };
  }, [chatService]);

  const sendMessage = (message) => {
    chatService.sendMessage(roomId, message);
  };

  return { messages, users, sendMessage };
};
```

## 🚀 개발 서버 실행

### Backend

```bash
cd backend
yarn install
yarn dev
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

### Frontend

```bash
cd frontend
yarn install
yarn dev
```

프론트엔드는 `http://localhost:3001`에서 실행됩니다.

## 🔧 환경 변수

### Backend (.env)

```env
APP_NAME=n-chat
APP_PORT=3000
LOG_LEVEL=debug

BCRYPT_SALT=10
JWT_SECRET=your_jwt_secret_key

# CORS
CORS_ORIGIN=http://localhost:3001
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE
CORS_ALLOWED_HEADERS=Content-Type, Accept, Authorization

# Postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=n_chat

# Google API
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Kakao API
KAKAO_API_URL=https://kauth.kakao.com
KAKAO_REST_API_KEY=your_kakao_rest_api_key
KAKAO_REDIRECT_URI=http://localhost:3000/api/auth/kakao/callback
```

### Frontend (.env)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_ACCESS_TOKEN=access_token
NEXT_PUBLIC_REFRESH_TOKEN=refresh_token
```

## 📝 주요 변경사항

### v1.0.0

- **실시간 채팅**: WebSocket을 통한 실시간 메시지 전송
- **소셜 로그인**: Google, Kakao OAuth 지원
- **JWT 인증**: 보안된 API 접근
- **채팅방 관리**: 방 생성, 입장, 퇴장, 목록 조회
- **사용자 관리**: 프로필 관리 및 사용자 정보
- **메시지 히스토리**: 과거 메시지 조회 기능
- **타이핑 상태**: 실시간 타이핑 상태 표시
