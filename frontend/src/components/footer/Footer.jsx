import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <div className='bg-gray-800 h-[60px] w-full text-white flex md:flex-row xs:flex-col justify-center items-center xs:text-center'>
      All Rights Reserved &copy; Ahmed Abd ElHameed
      <ul className='flex justify-center items-center gap-3 md:ml-3'>
        <li>
          <a
            href="https://www.linkedin.com/in/ahmed-abdelhameed1706/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-300 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faLinkedin} size="x" />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/ahmed-abdelhameed1706"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-300 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faGithub} size="x" />
          </a>
        </li>
        <li>
          <a
            href="https://twitter.com/AJVHz"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-300 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faTwitter} size="x" />
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Footer;