import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';


const Room = ({ match }) => {
  

  const isMdScreen = useMediaQuery({ query: '(min-width: 768px)' });

  
  const [newMessage, setMessage] = useState('');


  
  const chatMessageRef = useRef(null);






  const { roomCode } = useParams();

  const navigate = useNavigate();

  const [roomInfo, setRoomInfo] = useState({
    roomCode: '',
    roomName: '',
    roomOwner: '',
    connectedUsers: [],
  });

  const session_id = localStorage.getItem('session_id');
  const [user, setUser] = useState([]);
  const [Messages, setMessages] = useState([]);

  

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/${session_id}`)
        .then((res) => {
            console.log(res.data);
            setUser(res.data);
        })
        .catch((err) => {
            navigate('/home')
        });
  }
    , []);

  
    
  
  const navBarHeight = 80;
  const footerHeight = 60;
  const roomHeight = `calc(100vh - ${navBarHeight}px - ${footerHeight}px)`;
  const messageHeight = isMdScreen
    ? `calc(100vh - ${navBarHeight}px - ${footerHeight}px - 100px)`
    : `calc(100vh - ${navBarHeight}px - ${footerHeight}px - 130px)`;

  const [userList, setUserList] = useState(roomInfo.connectedUsers);
  const [leftPanelVisible, setLeftPanelVisible] = useState(isMdScreen);
  const [rightPanelVisible, setRightPanelVisible] = useState(isMdScreen);

  useEffect(() => {
    // Get the room code from URL params
    const fetchRoomCode = roomCode;
  
    // Fetch room information based on room code
    axios.get(`http://localhost:5000/api/rooms/${fetchRoomCode}`)
      .then((res) => {
        const roomData = res.data;
        console.log(roomData);
        setRoomInfo((prevRoomInfo) => ({
          ...prevRoomInfo,
          roomCode: roomData.code,
          roomName: roomData.name,
          roomOwner: roomData.owner.name,
          connectedUsers: roomData.users,
          messages: roomData.messages,
        }));
      })
      .catch((err) => {
        console.error(err);
        // Redirect to explore rooms page if room not found
        navigate('/explore-rooms');
      });
  }, [roomCode, navigate]);
  
  // Update userList whenever roomInfo.connectedUsers changes

  

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

  const deleteRoom = () => {
    axios.delete(`http://localhost:5000/api/rooms/${roomInfo.roomCode}`)
        .then((res) => {
            console.log(res.data);
            navigate('/explore-rooms');
        })
        .catch((err) => {
            console.log(err);
        });
}

useEffect(() => {
  axios.get(`http://localhost:5000/api/rooms/${roomInfo.roomCode}/messages`)
      .then((res) => {
          const messages = res.data;
          for (let i = 0; i < messages.length; i++) {
              setMessages((prevMessages) => [...prevMessages, { user: messages[i].user.name, content: messages[i].content }]);
          }
          console.log('messages are:')
          console.log(Messages);
      }
      )
      .catch((err) => {
          console.log(err);
      }
      );
}, [roomInfo.roomCode]);



const [currentMessage, setCurrentMessage] = useState('');

  // Function to handle sending messages
  const sendMessage = () => {

    const trimmedMessage = currentMessage.trim();
    if (!trimmedMessage) {
      // If the message is empty or contains only whitespace, don't send it
      return;
  }

    const socket = io('http://localhost:5000');
    // Emit the 'send_message' event with the message and user information
    socket.emit('send_message', { room: roomInfo.roomCode, user: user.name, message: currentMessage, userId: user.id });

    // Optionally, you can update the local state or perform any other actions here

    // Clear the input field after sending the message
    setCurrentMessage('');
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (chatMessageRef.current) {
      chatMessageRef.current.scrollTop = chatMessageRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [Messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents the default behavior of the Enter key in a text area
      sendMessage();
    }
  };



useEffect(() => {
  const socket = io('http://localhost:5000');

  socket.on('connect', () => {
    console.log('Connected to socket.io server');
    socket.emit('join_room', { room: roomInfo.roomCode, user: user.name, userId: user.id });
  });

  socket.on('user_connected', (data) => {
    console.log(`${data.user} joined the room`);
    
    const existingUserIndex = userList.findIndex((u) => u.id === data.userId);

  if (existingUserIndex !== -1) {
    // Update existing user's information
    setUserList((prevUserList) => {
      const newUserList = [...prevUserList];
      newUserList[existingUserIndex] = { id: data.userId, name: data.user };
      return newUserList;
    });
  } else {
    // Add the new user to the list
    setUserList((prevUserList) => [...prevUserList, { id: data.userId, name: data.user }]);
  }

  socket.emit('get_existing_users', { room: roomInfo.roomCode });
  });

  socket.on('existing_users', (data) => {
    // Update the userList with the existing users received from the server
    setUserList(data.users);
  });

  socket.on('user_disconnected', (data) => {
    console.log(`User ${data.userId} left the room`);
    // Update the userList by removing the disconnected user
    setUserList((prevUserList) => prevUserList.filter((u) => u.id !== data.userId));
    
  });

  socket.on('receive_message', (data) => {
    console.log(`Received message: ${data.message} from ${data.user}`);
    // Update your Messages state or UI with the received message
    setMessages((prevMessages) => [...prevMessages, { user: data.user, content: data.message }]);
  });

  return () => {
    socket.emit('leave_room', { room: roomInfo.roomCode, userId: user.id });
    socket.off('receive_message');
    socket.disconnect();
  };
}, [roomCode, navigate, roomInfo.roomCode, user.id, user.name]);

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
            <p>Connected Users: {userList.length}</p>
            <div className='flex flex-col'>
            <Link to="/explore-rooms">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">
                Back to Explore Rooms
              </button>
            </Link>
            {roomInfo.roomOwner === user.name && (
              <button className="bg-red-500 text-white px-4 py-2 rounded-md mt-2" onClick={deleteRoom}>Delete Room</button>
            )}
            </div>
            {leftPanelVisible ? (
              <button onClick={closePanels} className="xs:block md:hidden absolute top-4 right-4 z-50">
                &#10005;
              </button>
            ) : null}
          </animated.div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 p-4 mt-auto overflow-hidden" style={{height:roomHeight}}>
        <div ref={chatMessageRef} className="bg-white rounded-lg p-4 shadow-md mb-4 overflow-y-scroll" style={{height:messageHeight}} > 
          {/* Display Chat Messages */}
          {Messages.map((message, index) => (
            <div key={index} className={`p-2 rounded-md mb-2 ${message.user === user.name ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
              <p>{message.user}: {message.content}</p>
            </div>
          ))}

          
        </div>
        {/* Chat Input */}
        <div className="flex md:flex-row xs:flex-col md:justify-center md:items-center">
            <input
              type="text"
              placeholder="Type your message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border border-gray-300 p-2 w-full rounded-md mb-2 md:mb-0 md:mr-2"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white xs:py-2 rounded-md mb-2 md:mb-0 md:ml-2 min-w-[150px]"
            >
              Send Message
            </button>
          </div>
      </div>

        {/* Right Panel */}
        {rightPanelVisible && (
          <animated.div style={rightPanelSpring} className="xs:w-3/4 md:w-1/4 p-4 bg-white shadow-md xs:fixed md:static top-0 right-0 h-full overflow-y-scroll z-50">
            <h2 className="text-xl font-semibold mb-2">Connected Users</h2>
            <p>Total Users: {userList.length}</p>
            <ul>
            {userList.map((user, index) => (
              <li key={index}>{user.name}</li>
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
