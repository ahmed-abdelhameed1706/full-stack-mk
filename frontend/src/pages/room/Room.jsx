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
    from: { left: leftPanelVisible ? -500 : 0 },
  });

  const rightPanelSpring = useSpring({
    right: rightPanelVisible ? 0 : -500,
    from: { right: rightPanelVisible ? -500 : 0 },
  });

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe || isRightSwipe) {
      console.log('swipe', isLeftSwipe ? 'left' : 'right');
      // Add your conditional logic here for handling left or right swipe
      if (isLeftSwipe) {
        toggleRightPanel();
      } else {
        toggleLeftPanel();
      }
    }
  };

  useEffect(() => {
    // Simulate real-time updates (replace with actual logic)
    const interval = setInterval(() => {
      const updatedUserList = [...roomInfo.connectedUsers, 'New User'];
      setRoomInfo((prev) => ({ ...prev, connectedUsers: updatedUserList }));
      setUserList(updatedUserList);
    }, 30000);

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
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <animated.div
        style={{ ...springProps, height: roomHeight }}
        className="relative flex flex-col xs:flex-row bg-gray-100"
      >
        {/* Left Panel */}
        {leftPanelVisible && (
          <animated.div
            style={leftPanelSpring}
            className="xs:w-3/4 md:w-1/4 p-4 bg-white shadow-md xs:fixed md:static top-0 left-0 h-full overflow-y-scroll z-50"
          >
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
              <button className="bg-red-500 text-white px-4 py-2 rounded-md mt-2">Delete Room</button>
            )}
            {leftPanelVisible ? (
              <button onClick={closePanels} className="xs:block md:hidden absolute top-4 right-4 z-50">
                &#10005;
              </button>
            ) : null}
          </animated.div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 p-4 mt-auto">
          <div className="bg-white rounded-lg p-4 shadow-md mb-4">
            {/* Placeholder Chat Messages */}
            <div>
              <div className="bg-blue-500 text-white p-2 rounded-md mb-2">
                <p>Hi there!</p>
              </div>
              <div className="bg-gray-300 p-2 rounded-md mb-2">
                <p>How can I help you?</p>
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex md:flex-row xs:flex-col md:justify-center md:items-center">
              <input
                type="text"
                placeholder="Type your message..."
                className="border border-gray-300 p-2 w-full rounded-md mb-2 md:mb-0 md:mr-2"
              />
              <button className="bg-blue-500 text-white xs:py-2 rounded-md mb-2 md:mb-0 md:ml-2 min-w-[150px]">
                Send Message
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        {rightPanelVisible && (
          <animated.div style={rightPanelSpring} className="xs:w-3/4 md:w-1/4 p-4 bg-white shadow-md xs:fixed md:static top-0 right-0 h-full overflow-y-scroll z-50">
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
          </animated.div>
        )}
      </animated.div>
    </div>
  );
};

export default Room;
