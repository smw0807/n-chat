import { Room } from '@/models/room';

interface RoomCardProps {
  room: Room;
}
function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200">
      {/* 방 이미지 또는 아이콘 */}
      <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg flex items-center justify-center">
        <div className="text-white text-4xl font-bold">
          {room.name.charAt(0)}
        </div>
      </div>

      {/* 방 정보 */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800 truncate">{room.name}</h3>
          {room.isPrivate && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
              비공개
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {room.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>최대 {room.maxUsers}명</span>
          <span>방장: {room.user.name}</span>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;
