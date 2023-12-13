// AllRooms.js
import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import RoomCard from '../../components/roomcard/RoomCard';

const AllRooms = () => {
  const navBarHeight = 80;
  const footerHeight = 60;
  const allRoomsHeight = `calc(100vh - ${navBarHeight}px - ${footerHeight}px)`;

  const [isLoaded, setIsLoaded] = useState(false);
  const [sortedRooms, setSortedRooms] = useState([]);
  const [ascending, setAscending] = useState(true); // Added state for sorting order
  const [buttonClicked, setButtonClicked] = useState(false); // Added state for button click

  // Dummy room data (replace this with actual data from your database)
  const initialRooms = [
    { id: 1, name: 'League of legends', owner: 'User 1', users: 5, createdAt: '2023-01-01', roomCode: 'asd1' },
    { id: 2, name: 'Apex Legends', owner: 'User 2', users: 3, createdAt: '2023-01-05', roomCode: 'fdf1' },
    { id: 3, name: 'Discord Friends', owner: 'User 1', users: 52, createdAt: '2023-01-01', roomCode: 'asd3t' },
    { id: 4, name: 'Just Chatting', owner: 'User 2', users: 1, createdAt: '2023-01-05', roomCode: 'fg423' },
    { id: 5, name: 'Programming', owner: 'User 1', users: 41, createdAt: '2023-01-01', roomCode: '1234' },
    { id: 6, name: 'Room 2', owner: 'User 2', users: 311, createdAt: '2023-01-05', roomCode: '123dhh4' },
    { id: 7, name: 'Room 1', owner: 'User 1', users: 6, createdAt: '2023-01-01', roomCode: 'dsr64'},
    { id: 8, name: 'Room 2', owner: 'User 2', users: 3, createdAt: '2023-01-05', roomCode: 'llhgfg' },

  ];

  const [rooms, setRooms] = useState(initialRooms);

  useEffect(() => {
    setSortedRooms([...rooms]); // Initialize sortedRooms with the initial state of rooms
  }, [rooms]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSort = () => {
    setButtonClicked(true); // Set buttonClicked to true when the button is clicked

    const sorted = [...rooms].sort((a, b) => {
      if (ascending) {
        return a.users - b.users; // Ascending order
      } else {
        return b.users - a.users; // Descending order
      }
    });

    // Use setTimeout to reset buttonClicked after the fade-out animation
    setTimeout(() => {
      setButtonClicked(false);
    }, 100);

    setSortedRooms(sorted);
    setAscending(!ascending); // Toggle the sorting order
  };

  // Use spring for fade-in and fade-out animation of the button
  const fadeButton = useSpring({
    opacity: buttonClicked ? 0 : 1,
    config: { duration: 100 },
  });

  return (
    <div className='pb-10 pt-2 overflow-y-auto' style={{ height: allRoomsHeight }}>
      <div className="container mx-auto ">
        <div className='flex justify-between items-center'>
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

  return <animated.div style={fadeInScale}><RoomCard {...room} /></animated.div>;
};

export default AllRooms;
