// Node modules
import { Link, useFetcher, useNavigate } from 'react-router';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

// Custom modules
import { cn } from '@/lib/utils';
import { AUTH_MESSAGES_ES } from '@/messages';

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

// Assets
import { signupBanner } from '@/assets';
import { LoaderCircleIcon } from 'lucide-react';

// Types
import type {
  ActionResponse,
  AuthResponse,
  ErrorResponse,
  ValidationError,
} from '@/types';
type SignupField = 'email' | 'password' | 'role';

// Constants
const SIGNUP_FORM = {
  title: 'Crea una cuenta', // Create an account
  description: 'Introduce tu email abajo para crear una cuenta', // Enter your email below to create an account
  footerText: 'Ya tienes una cuenta?', // Already have an account.
} as const;

// Signup form schema
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
  role: z.enum(['admin', 'user']),
});

export const SignupForm = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const signupResponse = fetcher.data as ActionResponse<AuthResponse>;

  const isLoading = fetcher.state !== 'idle';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'user',
    },
  });

  useEffect(() => {
    if (!signupResponse) return;

    if (signupResponse.ok) {
      navigate('/', { viewTransition: true });
      return;
    }

    if (!signupResponse.err) return;

    if (signupResponse.err.code === 'AuthorizationError') {
      const authorizationError = signupResponse.err as ErrorResponse;
      const translated =
        AUTH_MESSAGES_ES[authorizationError.message] ??
        authorizationError.message;
      toast.error(translated, {
        position: 'top-center',
      });
    }

    if (signupResponse.err.code === 'ValidationError') {
      const validationErrors = signupResponse.err as ValidationError;
      Object.entries(validationErrors.errors).forEach((value) => {
        const [, validationError] = value;
        const signupField = validationError.path as SignupField;
        const translated =
          AUTH_MESSAGES_ES[validationError.msg] ?? validationError.msg;

        form.setError(
          signupField,
          {
            type: 'custom',
            message: translated,
          },
          { shouldFocus: true },
        );
      });
    }
  }, [signupResponse]);

  // Handle form submission ====================>-v
  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    await fetcher.submit(values, {
      action: '/signup',
      method: 'post',
      encType: 'application/json',
    });
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
                  <h1 className='text-2xl font-semibold'>
                    {SIGNUP_FORM.title}
                  </h1>
                  <p className='text-muted-foreground px-6'>
                    {SIGNUP_FORM.description}
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem className='grid gap-3'>
                      <FormLabel>Rol</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='grid grid-cols-2 gap-0 border border-input rounded-md p-0.5'
                        >
                          <Label className='h-[34px] w-full grid place-items-center rounded-s-sm text-muted-foreground hover:text-foreground has-checked:bg-secondary has-checked:text-secondary-foreground'>
                            <RadioGroupItem
                              value='user'
                              className='sr-only'
                            />
                            Usuario
                          </Label>

                          <Label className='h-[34px] w-full grid place-items-center rounded-e-sm text-muted-foreground hover:text-foreground has-checked:bg-secondary has-checked:text-secondary-foreground'>
                            <RadioGroupItem
                              value='admin'
                              className='sr-only'
                            />
                            Admin
                          </Label>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                  <span>Regístrate</span>
                </Button>
              </div>

              <div className='mt-4 text-center text-sm'>
                {SIGNUP_FORM.footerText}{' '}
                <Link
                  to={'/login'}
                  className='underline underline-offset-4 hover:text-primary'
                  viewTransition
                >
                  Inicia sesión
                </Link>
              </div>
            </form>
          </Form>

          <figure className='bg-muted relative hidden md:block'>
            <img
              src={signupBanner}
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
