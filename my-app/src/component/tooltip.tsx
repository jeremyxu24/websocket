import React from 'react';
import '../styles/style.css'

const Tooltip = ({ message, visible, className = '' }) => {
    return (
        <div className={`tooltip ${visible ? 'visible' : 'hidden'} ${className}`}>
            {message}
        </div>
    );
};

export default Tooltip;
