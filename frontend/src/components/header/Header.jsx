import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Header.css';

const Header = () => {
  const navBarHeight = 80;
  const footerHeight = 60;
  const headerHeight = `calc(100vh - ${navBarHeight}px - ${footerHeight}px)`;

  const [isAnimated, setAnimated] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Animation for "Let's Chat MK" and "Message Kingdom"
  const headingSpring = useSpring({
    opacity: isAnimated ? 1 : 0,
    marginTop: isAnimated ? 0 : 20,
    from: { opacity: 0, marginTop: 20 },
    config: { duration: 750 },
  });

  // Animation for "info-text" (fade-in from the middle)
  const infoTextSpring = useSpring({
    opacity: isAnimated ? 1 : 0,
    transform: isAnimated ? 'translateX(0)' : 'translateX(-50%)',
    from: { opacity: 0, transform: 'translateX(-50%)' },
    config: { duration: 750 },
  });

  // Trigger the animation when the component mounts
  React.useEffect(() => {
    setAnimated(true);
  }, []);

  // Function to handle button click and redirect to /home
  const handleButtonClick = () => {
    navigate('/home');
  };

  return (
    <header className="relative bg-cover bg-center font-pacifico" style={{ backgroundImage: "url('/header-background.jpg')", height: headerHeight }}>
      <div className="absolute inset-0 bg-yellow-900 opacity-70"></div>
      <div className="flex md:flex-row xs:flex-col xs:text-center md:text-left xs:gap-40 items-center justify-between h-full text-white relative z-10 p-8">
        <div className="xs:mb-[-45px]">
          <animated.h1 style={headingSpring} className="md:text-[60px] xs:text-[40px] xs:pb-0 xs:mb-[10px] font-bold tracking-widest">
            LETS CHAT MK
          </animated.h1>
          <animated.p style={headingSpring} className="mt-4 md:text-4xl xs:text-2xl subtitle text-center">
            Message Kingdom
          </animated.p>
        </div>
        <div className="md:ml-8 md:w-1/2 xs:w-full md:mb-0 xs:mb-[50%]">
          <animated.p style={infoTextSpring} className="md:text-4xl xs:text-[18px] tracking-wide info-text">
            Welcome to Let's Chat MK - your friendly and easy-to-use chatting app! Connect with friends, Meet like-minded people, join group chats, and dive into lively conversations. Whether you're catching up or making new connections, Let's Chat MK is the perfect place for a vibrant chat experience!
          </animated.p>
        </div>
        <div className="absolute bottom-14 left-[50%] -translate-x-1/2">
          <button onClick={handleButtonClick} className="bn13">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
