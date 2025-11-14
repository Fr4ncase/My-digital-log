// Node modules
import { useNavigate, useLocation } from 'react-router';

// Custom modules
import { baseUrl } from '@/api';

export const useLogout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return async () => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      if (accessToken) {
        const response = await fetch(`${baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({}),
          credentials: 'include',
        });

        if (!response.ok) {
          console.warn('Logout falló en el servidor');
        }
      }

      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      if (location.pathname === '/') {
        window.location.reload();
        return;
      }

      navigate('/', { viewTransition: true });
    } catch (err) {
      console.error('Error en logout:', err);
    }
  };
};
