# 채팅 백엔드 API 가이드

## 인증

모든 API 요청과 WebSocket 연결에는 JWT 토큰이 필요합니다.

### HTTP 요청 시 인증

```http
Authorization: Bearer <JWT_TOKEN>
```

### WebSocket 연결 시 인증

```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your_jwt_token_here',
  },
});
```

## REST API 엔드포인트

### 채팅방 관리

#### 1. 채팅방 목록 조회

```http
GET /chat/rooms
Authorization: Bearer <JWT_TOKEN>
```

#### 2. 채팅방 생성

```http
POST /chat/rooms
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "테스트 방",
  "description": "테스트용 채팅방입니다",
  "maxUsers": 10,
  "isPrivate": false
}
```

#### 3. 채팅방 메시지 조회

```http
GET /chat/room/{roomId}/messages
Authorization: Bearer <JWT_TOKEN>
```

#### 4. 채팅방 최근 메시지 조회

```http
GET /chat/room/{roomId}/recent?limit=20
Authorization: Bearer <JWT_TOKEN>
```

## WebSocket 이벤트

### 클라이언트 → 서버 이벤트

#### 1. 방 생성

```javascript
socket.emit('createRoom', {
  name: '새로운 방',
  description: '방 설명',
  maxUsers: 10,
  isPrivate: false,
});
```

#### 2. 방 입장

```javascript
socket.emit('joinRoom', {
  roomId: 123,
});
```

#### 3. 방 나가기

```javascript
socket.emit('leaveRoom', {
  roomId: 123,
});
```

#### 4. 메시지 전송

```javascript
socket.emit('sendMessage', {
  roomId: 123,
  message: '안녕하세요!',
});
```

#### 5. 타이핑 상태 전송

```javascript
socket.emit('typing', {
  roomId: 123,
  isTyping: true,
});
```

#### 6. 메시지 히스토리 요청

```javascript
socket.emit('getMessageHistory', {
  roomId: 123,
  limit: 50,
});
```

### 서버 → 클라이언트 이벤트

#### 1. 방 생성 성공

```javascript
socket.on('roomCreated', (data) => {
  console.log('방 생성됨:', data);
  // data: { room: Room, message: string }
});
```

#### 2. 새 메시지 수신

```javascript
socket.on('newMessage', (data) => {
  console.log('새 메시지:', data);
  // data: { id, userId, username, message, timestamp }
});
```

#### 3. 사용자 입장 알림

```javascript
socket.on('userJoined', (data) => {
  console.log('사용자 입장:', data);
  // data: { userId, username, timestamp }
});
```

#### 4. 사용자 퇴장 알림

```javascript
socket.on('userLeft', (data) => {
  console.log('사용자 퇴장:', data);
  // data: { userId, username, timestamp }
});
```

#### 5. 타이핑 상태 수신

```javascript
socket.on('userTyping', (data) => {
  console.log('타이핑 상태:', data);
  // data: { userId, username, isTyping }
});
```

#### 6. 메시지 히스토리 수신

```javascript
socket.on('messageHistory', (messages) => {
  console.log('메시지 히스토리:', messages);
  // messages: Array<Chat>
});
```

#### 7. 에러 메시지

```javascript
socket.on('error', (data) => {
  console.error('에러:', data);
  // data: { message: string }
});

socket.on('messageError', (data) => {
  console.error('메시지 에러:', data);
  // data: { error: string, details: string }
});
```

## 프론트엔드 연결 예시

### Socket.IO 클라이언트 설정

```javascript
import { io } from 'socket.io-client';

// JWT 토큰을 가져오는 함수 (예시)
const getToken = () => {
  return localStorage.getItem('access_token');
};

const socket = io('http://localhost:3000', {
  auth: {
    token: getToken(),
  },
});

// 연결 성공
socket.on('connect', () => {
  console.log('서버에 연결되었습니다');
});

// 연결 해제
socket.on('disconnect', () => {
  console.log('서버와 연결이 끊어졌습니다');
});

// 인증 에러
socket.on('connect_error', (error) => {
  console.error('연결 에러:', error);
  if (error.message === 'Invalid token') {
    // 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
    window.location.href = '/login';
  }
});
```

### 방 생성 및 입장 예시

```javascript
// 방 생성
socket.emit('createRoom', {
  name: '테스트 방',
  description: '테스트용 채팅방',
  maxUsers: 10,
  isPrivate: false,
});

socket.on('roomCreated', (data) => {
  console.log('방이 생성되었습니다:', data.room);
  // 생성된 방에 자동으로 입장됨
});

// 다른 방 입장
socket.emit('joinRoom', { roomId: 123 });

// 메시지 전송
socket.emit('sendMessage', {
  roomId: 123,
  message: '안녕하세요!',
});

// 메시지 수신
socket.on('newMessage', (message) => {
  console.log('새 메시지:', message);
  // UI에 메시지 표시
});
```

## 개발 서버 실행

```bash
cd backend
npm run dev
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 주요 변경사항

1. **인증 시스템 추가**: 모든 API와 WebSocket 연결에 JWT 토큰 필요
2. **방 생성 기능**: Socket.IO를 통한 실시간 방 생성
3. **사용자 정보 자동 처리**: 토큰에서 사용자 정보 추출
4. **에러 처리 개선**: 인증 실패 시 적절한 에러 메시지
