import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LoginForm from '@/components/auth/LoginForm';
import CookieBanner from '@/components/layout/CookieBanner';
import { CookieConsentProvider } from '../contexts/CookieContext';

const Login = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <CookieConsentProvider>
        <div className="container py-16 md:py-24">
          <div className="max-w-md mx-auto">
            <LoginForm />
          </div>
          <CookieBanner />
        </div>
      </CookieConsentProvider>
    </Layout>
  );
};

export default Login;