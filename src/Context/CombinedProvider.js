// src/context/CombinedProvider.js
import React from 'react';
import { AboutProvider } from './AboutContext';
import { ResumeProvider } from './ResumeContext';
import { PortfolioProvider } from './PortfolioContext';
import { PostsProvider } from './PostsContext'
import { LogoProvider } from './LogoContext'

const CombinedProvider = ({ children }) => {
    return (
        <AboutProvider>
            <LogoProvider>
                <ResumeProvider>
                    <PortfolioProvider>
                        <PostsProvider>
                           {children}
                        </PostsProvider>
                    </PortfolioProvider>
                </ResumeProvider>
            </LogoProvider>
        </AboutProvider>
    );
};

export default CombinedProvider;
