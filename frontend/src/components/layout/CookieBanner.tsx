import React, { useState, useEffect } from 'react';
import { useCookieConsent } from '../../contexts/CookieContext';

const CookieBanner: React.FC = () => {
    const [visible, setVisible] = useState<boolean>(false);
    const { setCookieConsent } = useCookieConsent();

    useEffect(() => {
        // Check if the user has already made a choice
        const choice = localStorage.getItem('cookieConsent');
        if (!choice) {
            setVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setCookieConsent('accepted');
        setVisible(false);
    };

    const handleDeny = () => {
        localStorage.setItem('cookieConsent', 'denied');
        setCookieConsent('denied');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div style={styles.banner}>
            <p style={styles.message}>
                This website uses cookies to ensure you get the best experience.{' '}
                <a href="/privacy" style={styles.link}>Learn more</a>
            </p>
            <div style={styles.buttonContainer}>
                <button onClick={handleAccept} style={{ ...styles.button, ...styles.acceptButton }}>
                    Accept
                </button>
                <button onClick={handleDeny} style={{ ...styles.button, ...styles.denyButton }}>
                    Deny
                </button>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    banner: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#333',
        color: '#fff',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1000,
    },
    message: {
        margin: 0,
        textAlign: 'center',
        maxWidth: '500px',
        lineHeight: '1.5rem',
    },
    link: {
        color: '#fff',
        textDecoration: 'underline',
    },
    buttonContainer: {
        marginTop: '0.5rem',
        display: 'flex',
        gap: '1rem',
    },
    button: {
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '4px',
        color: '#fff',
        fontSize: '1rem',
        cursor: 'pointer',
    },
    acceptButton: {
        backgroundColor: '#0080ff',
    },
    denyButton: {
        backgroundColor: '#e60000',
    },
};

export default CookieBanner;