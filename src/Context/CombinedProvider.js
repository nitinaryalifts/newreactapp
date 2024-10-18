// src/context/CombinedProvider.js
import React from 'react';
import { AboutProvider } from './AboutContext';
import { ResumeProvider } from './ResumeContext';
import { PortfolioProvider } from './PortfolioContext';
import { LogoProvider } from './LogoContext'

const CombinedProvider = ({ children }) => {
    return (
        <LogoProvider>
            <AboutProvider>
                <ResumeProvider>
                    <PortfolioProvider>
                        {children}
                    </PortfolioProvider>
                </ResumeProvider>
            </AboutProvider>
        </LogoProvider>
    );
};

export default CombinedProvider;
