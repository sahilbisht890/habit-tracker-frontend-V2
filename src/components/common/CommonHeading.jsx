import React from 'react';
import PropTypes from 'prop-types';

const Heading = ({ title , weight = 300, className = '' }) => {
  
  return (
    <h1
      className={`text-[28px] md:text-[38px] lg:text-[30px] xl:text-[36px] 2xl:text-[44px] font-tobias-trial leading-[120%] whitespace-pre-line  ${weight  = 300 ? 'font-[300]':'font-[200]'}  ${className}`}
    >
      {title}
    </h1>
  );
};

Heading.propTypes = {
  title: PropTypes.node.isRequired,
  weight: PropTypes.number,
  className: PropTypes.string,
};

export default Heading;
