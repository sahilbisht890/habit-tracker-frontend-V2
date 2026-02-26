import React from 'react';
import PropTypes from 'prop-types';

const Subtext = ({ subtext , className = 'text-[#4B4B4B] md:text-[#373737] text-left' }) => {
  return (
    <div
      className={`font-normal md:leading-[150%] font-manrope  text-[16px] md:text-[18px] ${className} dark:text-white`} 
      dangerouslySetInnerHTML={{ __html: subtext }}      
      >
    </div>
  );
};

Subtext.propTypes = {
    subtext: PropTypes.node.isRequired,
    className: PropTypes.string,
    
};

export default Subtext;
