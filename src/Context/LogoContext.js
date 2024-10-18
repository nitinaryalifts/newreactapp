import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const LogoContext = createContext();

export const useLogo = () => {
    return useContext(LogoContext);
};

export const LogoProvider = ({ children }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get('https://mancuso.ai/mancusov2/wp-json/v1/past-employers');
                setClients(response.data.clients);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching clients:', error);
                setError("Failed to fetch clients.");
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    return (
        <LogoContext.Provider value={{ clients, loading, error }}>
            {children}
        </LogoContext.Provider>
    );
};
