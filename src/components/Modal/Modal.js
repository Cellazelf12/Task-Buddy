import React from 'react';

import '../../App.css';

import Button from '../Button/Button';

const Modal = ({ show, onClose, children }) => {
    if (!show) return null;
    return (
        <div className="w-full max-w-md mx-auto p-4 rounded-lg shadow-lg bg-white dark:bg-gray-600 dark:text-white">
            <Button label="X" callback={onClose}/>
            <div>{children}</div>
        </div>
    );
};

export default Modal;
