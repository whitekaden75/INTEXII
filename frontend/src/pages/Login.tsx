
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LoginForm from '@/components/auth/LoginForm';
import CookieBanner from '@/components/layout/CookieBanner';

const Login = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
        <CookieBanner />
      </div>
    </Layout>
  );
};

export default Login;
