import React, { useState, useRef, useEffect } from 'react';

const AutoComplete = ({ options, setSelectedOption }) => {
    const [inputValue, setInputValue] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);;
    const dropdownRef = useRef(null); // Reference for the dropdown

    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setFilteredOptions(options.filter(option => option.label.toLowerCase().includes(value.toLowerCase())));
    };

    const handleSelect = (option) => {
        setSelectedOption(option.label); // Use label for selected option
        setInputValue(option.label);
        setFilteredOptions([]);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setFilteredOptions([]); // Close dropdown
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <input 
                type="text" 
                value={inputValue} 
                onChange={handleChange} 
                placeholder="United States" 
                className="border border-gray-300 rounded p-2 w-full"
            />
            {filteredOptions.length > 0 && (
                <ul className="relative bg-white border border-gray-300 rounded mt-1 w-full z-10  max-h-40 overflow-y-auto"> 
                    {filteredOptions.map((option, index) => (
                        <li 
                            key={index} 
                            onClick={() => handleSelect(option)} 
                            className="p-2 hover:bg-gray-200 cursor-pointer z-50"
                        >
                            {option.label} 
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutoComplete;