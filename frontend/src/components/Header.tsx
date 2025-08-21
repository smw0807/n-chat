'use client';

function Header() {
  return (
    <>
      {/* 헤더 */}
      <header className="flex justify-between items-center p-4 bg-gray-300">
        <h1 className="text-2xl font-bold">N-Chat</h1>
        <div className="flex items-center gap-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Login
          </button>
        </div>
      </header>
    </>
  );
}

export default Header;
