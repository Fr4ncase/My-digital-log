// Custom modules
import { cn } from '@/lib/utils';

// Components
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

// Assets
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import type React from 'react';

// Constants
const SOCIAL_LINKS = [
  { href: 'https://www.facebook.com/', Icon: Facebook, label: 'Facebook' },
  {
    href: 'https://www.instagram.com/',
    Icon: Instagram,
    label: 'Instagram',
  },
  { href: 'https://www.linkedin.com/', Icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://www.youtube.com/', Icon: Youtube, label: 'YouTube' },
] as const;

export const Footer = ({
  className,
  ...props
}: React.ComponentProps<'footer'>) => {
  return (
    <footer
      className={cn('border-t', className)}
      {...props}
    >
      <div className='container py-8 grid max-md:justify-items-center md:grid-cols-[1fr_3fr_1fr] md:items-center'>
        <Logo />

        <p className='text-muted-foreground order-1 max-md:text-center md:order-0 md:justify-self-center'>
          &copy; {new Date().getFullYear()} My Digital Log. Todos los derechos
          reservados.
        </p>

        <ul className='flex items-center gap-1 max-md:mt-6 max-md:mb-4 md:justify-self-end'>
          {SOCIAL_LINKS.map(({ href, Icon, label }) => (
            <li key={href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    aria-label={label}
                    asChild
                  >
                    <a
                      href={href}
                      target='_blank'
                    >
                      <Icon />
                    </a>
                  </Button>
                </TooltipTrigger>

                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};
