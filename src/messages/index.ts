export const AUTH_MESSAGES_ES: Record<string, string> = {
  EMAIL_INVALID: 'El correo es inválido',
  EMAIL_REQUIRED: 'El correo es obligatorio',
  EMAIL_MAX_LENGTH: 'El correo debe tener menos de 50 caracteres',
  EMAIL_TAKEN: 'El correo ya está en uso',

  PASSWORD_REQUIRED: 'La contraseña es obligatoria',
  PASSWORD_MIN_LENGTH: 'La contraseña debe tener al menos 8 caracteres',
  PASSWORD_MAX_LENGTH: 'La contraseña debe tener menos de 100 caracteres',

  ROLE_INVALID: 'El rol debe ser admin o user',
  ROLE_FORBIDDEN: 'No puedes registrarte como administrador',

  REFRESH_TOKEN_REQUIRED: 'El token de sesión es obligatorio',
  REFRESH_TOKEN_INVALID: 'Token de sesión inválido',

  CREDENTIALS_INVALID: 'El correo o la contraseña son incorrectos',
};
