import { useState, useEffect } from 'react';

const CookieConsent = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Check if the consent has been already given
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
        setVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookieConsent', 'false');
        setVisible(false);
    };

    if (!visible) {
        return null;
    }

    return (
        <div style={styles.banner}>
        <div style={styles.message}>
            We use cookies to improve your experience. By using our site, you agree
            to our{' '}
            <a href="/privacy-policy" style={styles.link}>
            Privacy Policy
            </a>
            .
        </div>
        <button onClick={handleAccept} style={styles.buttonAccept}>
            Accept
        </button>
        <button onClick={handleDecline} style={styles.buttonDecline}>
            Decline
        </button>
        </div>
    );
    };

    const styles: { [key: string]: React.CSSProperties } = {
    banner: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#323232',
        color: '#fff',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
        fontSize: '14px',
    },
    message: {
        flex: 1,
    },
    link: {
        color: '#fff',
        textDecoration: 'underline',
    },
    button: {
        marginLeft: '20px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '6px 12px',
        cursor: 'pointer',
    },
};

export default CookieConsent;