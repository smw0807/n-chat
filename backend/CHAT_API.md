# 채팅 백엔드 API 가이드

## REST API 엔드포인트

### 채팅방 관리

#### 1. 채팅방 목록 조회

```http
GET /rooms
```

#### 2. 채팅방 생성

```http
POST /rooms
Content-Type: application/json

{
  "name": "테스트 방",
  "description": "테스트용 채팅방입니다",
  "maxUsers": 10,
  "isPrivate": false,
  "createdBy": "user123"
}
```

#### 3. 채팅방 참여

```http
POST /rooms/{roomId}/join
Content-Type: application/json

{
  "userId": "user456",
  "username": "새사용자"
}
```

#### 4. 채팅방 나가기

```http
POST /rooms/{roomId}/leave
Content-Type: application/json

{
  "userId": "user456",
  "username": "새사용자"
}
```

#### 5. 채팅방 삭제

```http
DELETE /rooms/{roomId}
```

## WebSocket 이벤트

### 클라이언트 → 서버 이벤트

#### 1. 방 입장

```javascript
socket.emit('joinRoom', {
  roomId: 'room123',
  userId: 'user123',
  username: '사용자명',
});
```

#### 2. 방 나가기

```javascript
socket.emit('leaveRoom', {
  roomId: 'room123',
  userId: 'user123',
  username: '사용자명',
});
```

#### 3. 메시지 전송

```javascript
socket.emit('sendMessage', {
  roomId: 'room123',
  userId: 'user123',
  message: '안녕하세요!',
  timestamp: new Date(),
});
```

#### 4. 타이핑 상태 전송

```javascript
socket.emit('typing', {
  roomId: 'room123',
  userId: 'user123',
  username: '사용자명',
  isTyping: true,
});
```

### 서버 → 클라이언트 이벤트

#### 1. 새 메시지 수신

```javascript
socket.on('newMessage', (data) => {
  console.log('새 메시지:', data);
  // data: { userId, message, timestamp }
});
```

#### 2. 사용자 입장 알림

```javascript
socket.on('userJoined', (data) => {
  console.log('사용자 입장:', data);
  // data: { userId, username, timestamp }
});
```

#### 3. 사용자 퇴장 알림

```javascript
socket.on('userLeft', (data) => {
  console.log('사용자 퇴장:', data);
  // data: { userId, username, timestamp }
});
```

#### 4. 타이핑 상태 수신

```javascript
socket.on('userTyping', (data) => {
  console.log('타이핑 상태:', data);
  // data: { userId, username, isTyping }
});
```

## 프론트엔드 연결 예시

### Socket.IO 클라이언트 설정

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

// 연결 성공
socket.on('connect', () => {
  console.log('서버에 연결되었습니다');
});

// 연결 해제
socket.on('disconnect', () => {
  console.log('서버와 연결이 끊어졌습니다');
});
```

## 개발 서버 실행

```bash
cd backend
npm run dev
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.
