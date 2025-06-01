const languages = {
  en: {
    // Common
    save: "Save Changes",
    cancel: "Cancel",
    loading: "Loading...",
    success: "Success",
    error: "Error",
    required: "Required",
    reset: "Reset All",
    logout: "Logout",
    changePassword: "Change Password",
    delete: "Delete",
    login: "Login",
    register: "Register",
    preferences: {
      title: "User Preferences"
    },
    
    // Login
    login: {
      title: "Login",
      username: "Username",
      password: "Password",
      rememberMe: "Remember Me",
      forgotPassword: "Forgot Password?",
      noAccount: "Don't have an account?",
      signUp: "Sign Up",
      tooltips: {
        username: "Enter your username or email",
        password: "Enter your password"
      }
    },

    // Register
    register: {
      title: "Register",
      username: "Username",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      agreeTerms: "I agree to the Terms and Conditions",
      haveAccount: "Already have an account?",
      signIn: "Sign In",
      tooltips: {
        username: "Choose a unique username (3-20 characters)",
        email: "Enter a valid email address",
        password: "Password must be at least 8 characters",
        confirmPassword: "Re-enter your password"
      }
    },
    
    // Account Settings
    account: {
      title: "Account Settings",
      firstName: "First Name",
      lastName: "Last Name",
      username: "Username",
      email: "Email Address",
      phone: "Phone Number",
      passwordSection: "Password Settings",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      updatePassword: "Update Password",
      passwordRequired: "All password fields are required",
      passwordMismatch: "New password and confirm password do not match",
      passwordUpdated: "Password updated successfully",
      deleteAccount: "Delete Account",
      tooltips: {
        firstName: "Enter your legal first name",
        lastName: "Enter your legal last name",
        username: "Choose a unique username (3-20 characters, alphanumeric only)",
        email: "Enter a valid email address for account notifications",
        phone: "Enter your phone number (optional) for account recovery",
        currentPassword: "Enter your current password to verify your identity",
        newPassword: "Enter a new password (min. 8 characters with uppercase, lowercase, and numbers)",
        confirmPassword: "Re-enter your new password to confirm"
      }
    },

    // Notification Settings
    notifications: {
      title: "Notification Settings",
      emailNotifications: "Email Notifications",
      pushNotifications: "Push Notifications",
      smsNotifications: "SMS Notifications",
      frequency: "Notification Frequency",
      marketingAndSecurity: "Marketing and Security",
      types: {
        marketing: "Marketing Emails",
        security: "Security Alerts"
      },
      frequencies: {
        immediate: "Immediate",
        hourly: "Hourly",
        daily: "Daily Digest",
        weekly: "Weekly Summary",
        never: "Never"
      },
      tooltips: {
        emailNotifications: "Receive notifications via email",
        pushNotifications: "Receive notifications in your browser",
        smsNotifications: "Receive notifications via SMS",
        frequency: "How often you want to receive notifications",
        marketing: "Receive promotional offers and newsletters",
        security: "Get alerts about security-related activities"
      },
      success: "Notification settings saved successfully"
    },

    // Theme Settings
    theme: {
      title: "Theme Settings",
      colorScheme: "Color Scheme",
      fontSize: "Font Size",
      layout: "Layout",
      animations: "Animations",
      compactMode: "Compact Mode",
      schemes: {
        light: "Light",
        dark: "Dark",
        auto: "Auto (System)"
      },
      sizes: {
        small: "Small",
        medium: "Medium",
        large: "Large",
        extraLarge: "Extra Large"
      },
      layouts: {
        standard: "Standard",
        compact: "Compact",
        spacious: "Spacious"
      },
      tooltips: {
        colorScheme: "Choose your preferred color theme",
        fontSize: "Adjust the text size throughout the application",
        layout: "Select your preferred layout density",
        animations: "Enable or disable interface animations",
        compactMode: "Enable compact mode for a more condensed layout"
      },
      success: "Theme settings saved successfully"
    },

    // Privacy Settings
    privacy: {
      title: "Privacy Settings",
      profileVisibility: "Profile Visibility",
      dataSharing: "Data Sharing",
      analyticsTracking: "Analytics Tracking",
      locationSharing: "Location Sharing",
      activityStatus: "Activity Status",
      searchableProfile: "Searchable Profile",
      dataManagement: "Data Management",
      exportData: "Export Data",
      clearData: "Clear Data",
      visibility: {
        public: "Public",
        friends: "Friends Only",
        private: "Private"
      },
      tooltips: {
        profileVisibility: "Control who can see your profile information",
        dataSharing: "Manage how your data is shared with third parties",
        analyticsTracking: "Allow tracking of your usage patterns",
        locationSharing: "Share your location with the application",
        activityStatus: "Show when you are active on the platform",
        searchableProfile: "Allow others to find your profile in search"
      },
      clearDataWarning: "This will clear all your stored data. This action cannot be undone.",
      clear: "Clear",
      exportInitiated: "Data export initiated. You will receive an email when ready.",
      dataCleared: "Data cleared successfully",
      success: "Privacy settings saved successfully"
    }
  },
  es: {
    // Common
    save: "Guardar Cambios",
    cancel: "Cancelar",
    loading: "Cargando...",
    success: "Éxito",
    error: "Error",
    required: "Requerido",
    reset: "Restablecer Todo",
    logout: "Cerrar Sesión",
    changePassword: "Cambiar Contraseña",
    delete: "Eliminar",
    login: "Iniciar Sesión",
    register: "Registrarse",
    
    // Login
    login: {
      title: "Iniciar Sesión",
      username: "Nombre de Usuario",
      password: "Contraseña",
      rememberMe: "Recordarme",
      forgotPassword: "¿Olvidó su contraseña?",
      noAccount: "¿No tienes una cuenta?",
      signUp: "Registrarse",
      tooltips: {
        username: "Ingrese su nombre de usuario o correo electrónico",
        password: "Ingrese su contraseña"
      }
    },

    // Register
    register: {
      title: "Registrarse",
      username: "Nombre de Usuario",
      email: "Correo Electrónico",
      password: "Contraseña",
      confirmPassword: "Confirmar Contraseña",
      agreeTerms: "Acepto los Términos y Condiciones",
      haveAccount: "¿Ya tienes una cuenta?",
      signIn: "Iniciar Sesión",
      tooltips: {
        username: "Elija un nombre de usuario único (3-20 caracteres)",
        email: "Ingrese una dirección de correo electrónico válida",
        password: "La contraseña debe tener al menos 8 caracteres",
        confirmPassword: "Vuelva a ingresar su contraseña"
      }
    },

    // Account Settings
    account: {
      title: "Configuración de Cuenta",
      firstName: "Nombre",
      lastName: "Apellido",
      username: "Nombre de Usuario",
      email: "Correo Electrónico",
      phone: "Número de Teléfono",
      passwordSection: "Configuración de Contraseña",
      currentPassword: "Contraseña Actual",
      newPassword: "Nueva Contraseña",
      confirmPassword: "Confirmar Nueva Contraseña",
      updatePassword: "Actualizar Contraseña",
      passwordRequired: "Todos los campos de contraseña son obligatorios",
      passwordMismatch: "La nueva contraseña y la confirmación no coinciden",
      passwordUpdated: "Contraseña actualizada exitosamente",
      deleteAccount: "Eliminar Cuenta",
      tooltips: {
        firstName: "Ingrese su nombre legal",
        lastName: "Ingrese su apellido legal",
        username: "Elija un nombre de usuario único (3-20 caracteres, solo alfanuméricos)",
        email: "Ingrese un correo electrónico válido para notificaciones",
        phone: "Ingrese su número de teléfono (opcional) para recuperación de cuenta",
        currentPassword: "Ingrese su contraseña actual para verificar su identidad",
        newPassword: "Ingrese una nueva contraseña (mín. 8 caracteres con mayúsculas, minúsculas y números)",
        confirmPassword: "Vuelva a ingresar su nueva contraseña para confirmar"
      }
    },

    // Notification Settings
    notifications: {
      title: "Configuración de Notificaciones",
      emailNotifications: "Notificaciones por Correo",
      pushNotifications: "Notificaciones Push",
      smsNotifications: "Notificaciones SMS",
      frequency: "Frecuencia de Notificaciones",
      marketingAndSecurity: "Marketing y Seguridad",
      types: {
        marketing: "Correos de Marketing",
        security: "Alertas de Seguridad"
      },
      frequencies: {
        immediate: "Inmediato",
        hourly: "Cada Hora",
        daily: "Resumen Diario",
        weekly: "Resumen Semanal",
        never: "Nunca"
      },
      tooltips: {
        emailNotifications: "Recibir notificaciones por correo electrónico",
        pushNotifications: "Recibir notificaciones en su navegador",
        smsNotifications: "Recibir notificaciones por SMS",
        frequency: "Con qué frecuencia desea recibir notificaciones",
        marketing: "Reciba ofertas promocionales y boletines",
        security: "Reciba alertas sobre actividades relacionadas con la seguridad"
      },
      success: "Configuración de notificaciones guardada exitosamente"
    },

    // Theme Settings
    theme: {
      title: "Configuración de Tema",
      colorScheme: "Esquema de Color",
      fontSize: "Tamaño de Fuente",
      layout: "Diseño",
      animations: "Animaciones",
      compactMode: "Modo Compacto",
      schemes: {
        light: "Claro",
        dark: "Oscuro",
        auto: "Automático (Sistema)"
      },
      sizes: {
        small: "Pequeño",
        medium: "Mediano",
        large: "Grande",
        extraLarge: "Extra Grande"
      },
      layouts: {
        standard: "Estándar",
        compact: "Compacto",
        spacious: "Espacioso"
      },
      tooltips: {
        colorScheme: "Elija su tema de color preferido",
        fontSize: "Ajuste el tamaño del texto en toda la aplicación",
        layout: "Seleccione su densidad de diseño preferida",
        animations: "Habilitar o deshabilitar animaciones de la interfaz",
        compactMode: "Habilitar modo compacto para un diseño más condensado"
      },
      success: "Configuración de tema guardada exitosamente"
    },

    // Privacy Settings
    privacy: {
      title: "Configuración de Privacidad",
      profileVisibility: "Visibilidad del Perfil",
      dataSharing: "Compartir Datos",
      analyticsTracking: "Seguimiento Analítico",
      locationSharing: "Compartir Ubicación",
      activityStatus: "Estado de Actividad",
      searchableProfile: "Perfil Buscable",
      dataManagement: "Gestión de Datos",
      exportData: "Exportar Datos",
      clearData: "Borrar Datos",
      visibility: {
        public: "Público",
        friends: "Solo Amigos",
        private: "Privado"
      },
      tooltips: {
        profileVisibility: "Controle quién puede ver la información de su perfil",
        dataSharing: "Administre cómo se comparten sus datos con terceros",
        analyticsTracking: "Permitir el seguimiento de sus patrones de uso",
        locationSharing: "Compartir su ubicación con la aplicación",
        activityStatus: "Mostrar cuando está activo en la plataforma",
        searchableProfile: "Permitir que otros encuentren su perfil en búsquedas"
      },
      clearDataWarning: "Esto borrará todos sus datos almacenados. Esta acción no se puede deshacer.",
      clear: "Borrar",
      exportInitiated: "Exportación de datos iniciada. Recibirá un correo cuando esté listo.",
      dataCleared: "Datos borrados exitosamente",
      success: "Configuración de privacidad guardada exitosamente"
    }
  }
};

export default languages; 