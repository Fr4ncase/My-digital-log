// Custom modules
import { baseUrl } from '@/api';

// Types
import type { ActionFunctionArgs } from 'react-router';
import type {
  ActionResponse,
  AuthResponse,
  ErrorResponse,
  ValidationError,
} from '@/types';

const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.json();

  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = (await response.json()) as
        | ValidationError
        | ErrorResponse;
      return {
        ok: false,
        err: errorData,
      } as ActionResponse;
    }

    const responseData = (await response.json()) as AuthResponse;

    localStorage.setItem('accessToken', responseData.accessToken);
    localStorage.setItem('user', JSON.stringify(responseData.user));

    return {
      ok: true,
      data: responseData,
    } as ActionResponse<AuthResponse>;
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
    } as ActionResponse;
  }
};

export default loginAction;
