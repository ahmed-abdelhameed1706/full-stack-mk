import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';


const Room = ({ match }) => {

  const isMdScreen = useMediaQuery({ query: '(min-width: 768px)' });

  const [roomInfo, setRoomInfo] = useState({
    roomCode: '12345',
    roomName: 'Awesome Room',
    roomOwner: 'John Doe',
    connectedUsers: ['Alice', 'Bob'],
  });

  const navBarHeight = 80;
  const footerHeight = 60;
  const roomHeight = `calc(100vh - ${navBarHeight}px - ${footerHeight}px)`;

  const [userList, setUserList] = useState(roomInfo.connectedUsers);
  const [leftPanelVisible, setLeftPanelVisible] = useState(isMdScreen);
  const [rightPanelVisible, setRightPanelVisible] = useState(isMdScreen);

  const springProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
  });

  const leftPanelSpring = useSpring({
    left: leftPanelVisible ? 0 : -500,
    from: {left: leftPanelVisible ? -500 : 0},

  });

  useEffect(() => {
    // Simulate real-time updates (replace with actual logic)
    const interval = setInterval(() => {
      const updatedUserList = [...roomInfo.connectedUsers, 'New User'];
      setRoomInfo((prev) => ({ ...prev, connectedUsers: updatedUserList }));
      setUserList(updatedUserList);
    }, 2000);

    return () => clearInterval(interval);
  }, [roomInfo.connectedUsers]);

  const toggleLeftPanel = () => {
    setLeftPanelVisible(!leftPanelVisible);
    setRightPanelVisible(false);
  };

  const toggleRightPanel = () => {
    setRightPanelVisible(!rightPanelVisible);
    setLeftPanelVisible(false);
  };

  const closePanels = () => {
    setLeftPanelVisible(false);
    setRightPanelVisible(false);
  };

  return (
    <animated.div style={{ ...springProps, height: roomHeight }} className="relative flex flex-col xs:flex-row bg-gray-100">
      {/* Left Panel Button */}
      <button onClick={toggleLeftPanel} className="xs:block md:hidden fixed bottom-[65px] left-4 z-50">
        Show Left Panel
      </button>

      {/* Left Panel */}
      {leftPanelVisible && (
        <animated.div style={leftPanelSpring} className="xs:w-3/4 md:w-1/4 p-4 bg-white shadow-md xs:fixed md:static top-0 left-0 h-full overflow-y-scroll z-50">
          <h2 className="text-xl font-semibold mb-2">{roomInfo.roomName}</h2>
          <p>Room Code: {roomInfo.roomCode}</p>
          <p>Room Owner: {roomInfo.roomOwner}</p>
          <p>Connected Users: {roomInfo.connectedUsers.length}</p>
          <Link to="/explore-rooms">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">
              Back to Explore Rooms
            </button>
          </Link>
          {roomInfo.roomOwner === 'John Doe' && (
            <button className="bg-red-500 text-white px-4 py-2 rounded-md mt-2">
              Delete Room
            </button>
          )}
          {leftPanelVisible ? (
        <button onClick={closePanels} className="xs:block md:hidden absolute top-4 right-4 z-50">
          &#10005;
        </button>
      ) : null}
        </animated.div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg p-4 shadow-md mb-4">
          {/* Placeholder Chat Messages */}
          <div>
            <div className="bg-blue-500 text-white p-2 rounded-md">
              <p>Hi there!</p>
            </div>
            <div className="bg-gray-300 p-2 rounded-md">
              <p>How can I help you?</p>
            </div>
          </div>

          {/* Chat Input */}
          <div>
            <input
              type="text"
              placeholder="Type your message..."
              className="border border-gray-300 p-2 w-full rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Right Panel Button */}
      <button onClick={toggleRightPanel} className="xs:block md:hidden fixed bottom-[65px] right-4 z-40">
        Show Right Panel
      </button>

      {/* Right Panel */}
      {rightPanelVisible && (
        <div className="xs:w-3/4 md:w-1/4 p-4 bg-white shadow-md xs:fixed md:static top-0 right-0 h-full overflow-y-scroll z-50">
          <h2 className="text-xl font-semibold mb-2">Connected Users</h2>
          <p>Total Users: {userList.length}</p>
          <ul>
            {userList.map((user) => (
              <li key={user}>{user}</li>
            ))}
          </ul>
          {rightPanelVisible ? (
        <button onClick={closePanels} className="xs:block md:hidden absolute top-4 right-4 z-50">
          &#10005;
        </button>
      ) : null}
          
        </div>
      )}

      {/* Close Panels Button (X-shaped) */}
      
    </animated.div>
  );
};

export default Room;
