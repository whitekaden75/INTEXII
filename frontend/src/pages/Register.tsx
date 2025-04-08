
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import AuthorizeView from '@/components/auth/AuthorizeView';

const Register = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/movies');
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthorizeView>
      <Layout>
        <div className="container py-16 md:py-24">
          <div className="max-w-md mx-auto">
            <RegisterForm />
          </div>
        </div>
      </Layout>    
    </AuthorizeView>

  );
};

export default Register;
