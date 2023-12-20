import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import RoomCard from '../../components/roomcard/RoomCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllRooms = () => {
  const navBarHeight = 80;
  const footerHeight = 60;
  const allRoomsHeight = `calc(100vh - ${navBarHeight}px - ${footerHeight}px)`;

  const [isLoaded, setIsLoaded] = useState(false);
  const [sortedRooms, setSortedRooms] = useState([]);
  const [ascending, setAscending] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false);
  const session_id = localStorage.getItem('session_id');

  const navigate = useNavigate();

  const [user, setUser] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/users/${session_id}`)
      .then((res) => {
        
        setUser(res.data);
      })
      .catch((err) => {
        navigate('/home');
      });
  }, []);

  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/rooms`)
      .then((res) => {
        const roomData = res.data;
        
        setRooms(roomData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setSortedRooms([...rooms]);
  }, [rooms]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSort = () => {
    setButtonClicked(true);
    const sorted = [...rooms].sort((a, b) => {
      if (ascending) {
        return a.users - b.users;
      } else {
        return b.users - a.users;
      }
    });

    setTimeout(() => {
      setButtonClicked(false);
    }, 100);

    setSortedRooms(sorted);
    setAscending(!ascending);
  };

  const fadeButton = useSpring({
    opacity: buttonClicked ? 0 : 1,
    config: { duration: 100 },
  });

  return (
    <div className="pb-10 pt-2 overflow-y-auto" style={{ height: allRoomsHeight }}>
      <div className="container mx-auto ">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold my-8">All Rooms</h1>
          <animated.button style={fadeButton} onClick={handleSort}>
            Sort: {ascending ? '1 → 9' : '9 → 1'}
          </animated.button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedRooms.map((room, index) => (
            <AnimatedRoomCard key={room.id} room={room} index={index} isLoaded={isLoaded} />
          ))}
        </div>
      </div>
    </div>
  );
};

const AnimatedRoomCard = ({ room, index, isLoaded }) => {
  const fadeInScale = useSpring({
    opacity: isLoaded ? 1 : 0,
    transform: `scale(${isLoaded ? 1 : 0.5})`,
    from: { opacity: 0, transform: 'scale(0.5)' },
    config: { duration: 500 },
    delay: isLoaded ? index * 100 : 0,
  });

  return <animated.div style={fadeInScale}><RoomCard
    name={room.name}
    owner={room.owner.name}
    users={room.users.length}
    createdAt={room.created_at}
    roomCode={room.code}
  /></animated.div>;
};

export default AllRooms;
