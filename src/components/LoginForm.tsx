// Node modules
import { Link, useFetcher, useNavigate } from 'react-router';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';

// Custom modules
import { cn } from '@/lib/utils';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { InputPassword } from '@/components/InputPassword';

// Assets
import { loginBanner } from '@/assets';
import { LoaderCircleIcon } from 'lucide-react';

// Types
import type { ActionResponse, AuthResponse, ValidationError } from '@/types';
type LoginFieldName = 'email' | 'password';

// Constants
const LOGIN_FORM = {
  title: 'Bienvenido de nuevo', // Welcome back
  description: 'Inicie sesión en su cuenta de DigitalLog', // Login to your DigitalLog account
  footerText: 'No tienes una cuenta?', // Don't have an account
} as const;

// Login form schema
const formSchema = z.object({
  email: z
    .string()
    .nonempty({ error: 'Email requerido' }) // Email is required
    .max(50, { error: 'El email debe tener menos de 50 caracteres' }) // Email must be less than 50 characters
    .email({ error: 'Email invalido' }), //Invalid email address
  password: z
    .string()
    .nonempty({ error: 'Contraseña requerida' }) // Password is required
    .min(8, { error: 'La contraseña debe tener al menos 8 caracteres' }) // Password must be at least 8 characters long
    .max(100, { error: 'La contraseña debe tener menos de 100 caracteres' }), // Password must be less than 100 characters
});

export const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const loginResponse = fetcher.data as ActionResponse<AuthResponse>;

  const isLoading = fetcher.state !== 'idle';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  }, []);

  return (
    <div
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <Form {...form}>
            <form
              className='p-6 md:p-8'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col items-center text-center'>
                  <h1 className='text-2xl font-semibold'>{LOGIN_FORM.title}</h1>
                  <p className='text-muted-foreground text-balance'>
                    {LOGIN_FORM.description}
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem className='grid gap-3'>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='john@example.com'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem className='grid gap-3'>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <InputPassword
                          placeholder='Ingresa tu contraseña'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type='submit'
                  className='w-full'
                  disabled={isLoading}
                >
                  {isLoading && <LoaderCircleIcon className='animate-spin' />}
                  <span>Inicia sesión</span>
                </Button>
              </div>

              <div className='mt-4 text-center text-sm'>
                {LOGIN_FORM.footerText}{' '}
                <Link
                  to={'/signup'}
                  className='underline underline-offset-4 hover:text-primary'
                  viewTransition
                >
                  Regístrate
                </Link>
              </div>
            </form>
          </Form>

          <figure className='bg-muted relative hidden md:block'>
            <img
              src={loginBanner}
              width={400}
              height={400}
              alt='Login banner'
              className='absolute inset-0 w-full h-full object-cover'
            />
          </figure>
        </CardContent>
      </Card>

      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:underline-offset-4'>
        Al hacer click en continuar, acepta nuestros{' '}
        <a href='#'>Términos de servicio</a> y{' '}
        <a href='#'>política de privacidad</a>.
      </div>
    </div>
  );
};
