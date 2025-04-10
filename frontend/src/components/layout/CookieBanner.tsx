import React, { useState, useEffect } from 'react';

const CookieBanner: React.FC = () => {
const [visible, setVisible] = useState<boolean>(false);

useEffect(() => {
    const accepted = localStorage.getItem('cookiesAccepted');
    if (!accepted) {
    setVisible(true);
    }
}, []);

const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setVisible(false);
};

if (!visible) return null;

return (
    <div style={styles.banner}>
    <p style={styles.message}>
        This website uses cookies to ensure you get the best experience.{' '}
        <a href="/privacy" style={styles.link}>Learn more</a>
    </p>
    <button onClick={handleAccept} style={styles.button}>Accept</button>
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
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 1000,
},
message: {
    margin: 0,
    textAlign: 'center',
    maxWidth: '500px',
    lineHeight: '1.5rem'
},
link: {
    color: '#fff',
    textDecoration: 'underline',
},
button: {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#0080ff',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
},
};

export default CookieBanner;
