// Node modules
import { redirect } from 'react-router';

// Custom modules
import { baseUrl } from '@/api';

// Types
import type { ActionFunctionArgs } from 'react-router';

const settingsAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.json();
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) return redirect('/');

  try {
    const response = await fetch(`${baseUrl}/users/current`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        ok: false,
        err: errorData,
      };
    }

    const responseData = await response.json();

    localStorage.setItem('user', JSON.stringify(responseData.user));

    return {
      ok: true,
      data: responseData,
    };
  } catch (err) {
    let message = 'Internal server error';
    if (err instanceof Error) {
      console.error('Login Action Error:', err.message);
      message = err.message;
    }
    return {
      ok: false,
      err: {
        code: 'ServerError',
        message,
      },
    };
  }
};

export default settingsAction;
