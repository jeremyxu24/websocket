import React from 'react';
import '../styles/style.css'

const Tooltip = ({ message, visible }) => {
    return (
        <div className={`tooltip ${visible ? 'visible' : 'hidden'}`}>
            {message}
        </div>
    );
};

export default Tooltip;
