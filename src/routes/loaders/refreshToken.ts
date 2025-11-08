// Node modules
import { redirect } from 'react-router';

// Custom modules
import { baseUrl } from '@/api';

// Types
import type { LoaderFunctionArgs } from 'react-router';

// Interfaces
interface FetchError extends Error {
  status?: number;
  statusText?: string;
}

const refreshTokenLoader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const redirectUri = url.searchParams.get('redirect') ?? '/';

  try {
    const response = await fetch(`${baseUrl}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const error = new Error(
        errorBody.message || 'Error al refrescar el token',
      ) as FetchError;
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    }

    const responseData = await response.json();

    localStorage.setItem('accessToken', responseData.accessToken);

    return redirect(redirectUri);
  } catch (err) {
    const error = err as FetchError;
    const message = error.message;
    const tokenExpired = message.includes('token expired');

    if (tokenExpired) {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      return redirect('/login');
    }

    throw new Response(
      JSON.stringify({
        message,
        status: error.status || 500,
        statusText: error.statusText || 'Internal Server Error',
      }),
      { status: error.status || 500 },
    );
  }
};

export default refreshTokenLoader;
