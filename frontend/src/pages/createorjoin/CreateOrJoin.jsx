import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useNavigate } from 'react-router-dom';

const CreateOrJoin = () => {
  const navBarHeight = 80;
  const footerHeight = 60;
  const createOrJoinHeight = `calc(100vh - ${navBarHeight}px - ${footerHeight}px)`;

  const session_id = localStorage.getItem('session_id');
  const [user, setUser] = useState([]);

  const navigate = useNavigate();

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

  const cardAnimationProps = useSpring({
    opacity: 1,
    transform: 'scale(1)',
    from: { opacity: 0, transform: 'scale(0.5)' },
    config: { duration: 350 },
  });

    const createRoom = () => {
        axios.put(`http://localhost:5000/api/room`, {
            name: document.getElementById('roomName').value,
            owner: user.id,
            user: user.id,
        })
            .then((res) => {
                console.log(res.data);
                const room = res.data;
                navigate(`/room/${room.code}`);
            })
            .catch((err) => {
                console.log(err);
            });
    }

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100" style={{ height: createOrJoinHeight }}>
      <animated.div className="mb-8 text-center md:container" style={cardAnimationProps}>
        <p className="text-lg font-semibold w-[75%] mx-auto">Explore Let's Chat MK for seamless connections. Create or join rooms, engage in vibrant discussions, and share meaningful moments. Let it be your canvas for joyous dialogues and connections.</p>
      </animated.div>
      <div className="flex md:flex-row xs:flex-col xs:space-y-8 md:space-y-0 md:space-x-8 mt-8">
        {/* Left Section */}
        <animated.div className="flex flex-col h-full border rounded p-4" style={cardAnimationProps}>
          <label htmlFor="roomName" className="mb-2">Room Name</label>
          <input type="text" id="roomName" className="border rounded p-2 mb-4" />
          <animated.button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition" style={cardAnimationProps} onClick={createRoom}>
            Create Now</animated.button>
        </animated.div>
        {/* Right Section */}
        <animated.div className="flex flex-col h-full border rounded p-4" style={cardAnimationProps}>
          <label htmlFor="roomCode" className="mb-2">Room Code</label>
          <input type="text" id="roomCode" className="border rounded p-2 mb-4" />
          <animated.button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition" style={cardAnimationProps}>Join Now</animated.button>
        </animated.div>
      </div>
    </div>
  );
};

export default CreateOrJoin;
