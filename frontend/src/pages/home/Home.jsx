import { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import "./Home.css";
import { Link } from 'react-router-dom';

const Home = () => {
  const navBarHeight = 80;
  const footerHeight = 60;
  const homeHeight = `calc(100vh - ${navBarHeight}px - ${footerHeight}px)`;

  // Animation for fade-in effect and scaling for each element
  const fadeInHeading = useSpring({
    opacity: 1,
    transform: 'scale(1)',
    from: { opacity: 0, transform: 'scale(0.5)' },
    config: { duration: 350 },
  });

  const fadeInParagraph = useSpring({
    opacity: 1,
    transform: 'scale(1)',
    from: { opacity: 0, transform: 'scale(0.5)' },
    config: { duration: 350 },
  });

  const fadeInCard1 = useSpring({
    opacity: 1,
    transform: 'scale(1)',
    from: { opacity: 0, transform: 'scale(0.5)' },
    config: { duration: 350 },
  });

  const fadeInCard2 = useSpring({
    opacity: 1,
    transform: 'scale(1)',
    from: { opacity: 0, transform: 'scale(0.5)' },
    config: { duration: 350 },
  });

  // State for modal visibility
  const [isModalOpen, setModalOpen] = useState(false);

  // Function to handle opening the modal
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Animation for modal fade-in and scale effect
  const fadeInModal = useSpring({
    opacity: isModalOpen ? 1 : 0,
    transform: `scale(${isModalOpen ? 1 : 0.5})`,
    config: { duration: 350 },
  });

  return (
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: 'url("/header-background.jpg")', height: homeHeight }}>
      <div className="absolute inset-0 bg-yellow-900 opacity-70"></div>

      {/* <div className={`absolute inset-0 bg-black opacity-70 ${isModalOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} onClick={handleCloseModal}></div> */}

      <div className="container mx-auto flex flex-col items-center justify-center h-full text-white relative z-10 xs:text-center ">
        <animated.h1 style={fadeInHeading} className="md:text-4xl xs:text-xl font-bold mb-4">Welcome to Let's Chat MK</animated.h1>
        <animated.p style={fadeInParagraph} className="xs:text-sm md:text-lg mb-8">Connect with friends, meet new people, and dive into lively conversations on Let's Chat MK - your friendly and easy-to-use chatting app.</animated.p>

        <div className="flex flex-col md:flex-row w-full max-w-screen-xl mx-auto">
          {/* Card 1 */}
          <animated.div style={fadeInCard1} className="w-full md:w-1/2 p-4 md:mb-4">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Explore Chat Rooms</h2>
              <p className='xs:text-sm md:text-lg'>Discover a variety of chat rooms catering to different interests and topics. Join conversations with like-minded individuals and explore the world of Let's Chat MK.</p>
              <Link to='/explore-rooms'>
              <button className="bn13 md:text-lg xs:text-[0.8rem] mt-2 mb-0" onClick={handleOpenModal}>
                Explore &rarr;
              </button>
              </Link>
            </div>
          </animated.div>

          {/* Card 2 */}
          <animated.div style={fadeInCard2} className="w-full md:w-1/2 p-4">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Private Messaging</h2>
              <p className='xs:text-sm md:text-lg'>Enjoy private conversations with friends or make new connections through one-on-one messaging. Let's Chat MK provides a secure and personalized chatting experience.</p>
              <button className="bn13 md:text-lg xs:text-[0.8rem] mt-2 mb-0" onClick={handleOpenModal}>
                Start now!
              </button>
            </div>
          </animated.div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="absolute inset-0 bg-black opacity-70" onClick={handleCloseModal}></div>
          <animated.div style={fadeInModal} className="bg-gray-800 p-6 rounded-lg relative">
            <div className="absolute top-0 right-0 m-4 cursor-pointer" onClick={handleCloseModal}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-4">Join a Chat Room</h2>
            <div className="mb-4">
              <label className="block text-white">Nickname</label>
              <input type="text" className="bn13 w-full p-2 text-black" />
            </div>
            <div className="flex justify-between">
              <button className="bn13" onClick={handleCloseModal}>
                Continue
              </button>
              <button className="bn13" onClick={() => alert("My Rooms button clicked")}>
                My Rooms
              </button>
            </div>
          </animated.div>
        </div>
      )}
    </div>
  );
};

export default Home;
