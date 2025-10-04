// src/context/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'es' | 'en';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

export const translations: Translations = {
  // Navegación y general
  'app_name': { es: 'Life Reminder', en: 'Life Reminder' },
  'loading': { es: 'Cargando...', en: 'Loading...' },
  'save': { es: 'Guardar', en: 'Save' },
  'cancel': { es: 'Cancelar', en: 'Cancel' },
  'accept': { es: 'Aceptar', en: 'Accept' },
  'close': { es: 'Cerrar', en: 'Close' },
  'delete': { es: 'Eliminar', en: 'Delete' },
  'edit': { es: 'Editar', en: 'Edit' },
  'add': { es: 'Agregar', en: 'Add' },
  'back': { es: 'Volver', en: 'Back' },
  'next': { es: 'Siguiente', en: 'Next' },
  'previous': { es: 'Anterior', en: 'Previous' },
  'confirm': { es: 'Confirmar', en: 'Confirm' },
  'ok': { es: 'OK', en: 'OK' },
  
  // Autenticación
  'login': { es: 'Iniciar Sesión', en: 'Log In' },
  'register': { es: 'Registrarse', en: 'Sign Up' },
  'logout': { es: 'Cerrar Sesión', en: 'Log Out' },
  'email': { es: 'Correo Electrónico', en: 'Email' },
  'password': { es: 'Contraseña', en: 'Password' },
  'name': { es: 'Nombre', en: 'Name' },
  'lastname': { es: 'Apellido', en: 'Last Name' },
  'birthdate': { es: 'Fecha de Nacimiento', en: 'Birth Date' },
  'document': { es: 'Documento', en: 'Document' },
  'phone': { es: 'Teléfono', en: 'Phone' },
  
  // Dashboard y navegación
  'dashboard': { es: 'Panel Principal', en: 'Dashboard' },
  'medications': { es: 'Medicamentos', en: 'Medications' },
  'consultations': { es: 'Consultas', en: 'Consultations' },
  'reminders': { es: 'Recordatorios', en: 'Reminders' },
  'records': { es: 'Registros', en: 'Records' },
  'settings': { es: 'Configuración', en: 'Settings' },
  'profile': { es: 'Perfil', en: 'Profile' },
  
  // Medicamentos
  'medication_name': { es: 'Nombre del Medicamento', en: 'Medication Name' },
  'dosage': { es: 'Dosis', en: 'Dosage' },
  'frequency': { es: 'Frecuencia', en: 'Frequency' },
  'start_date': { es: 'Fecha de Inicio', en: 'Start Date' },
  'end_date': { es: 'Fecha de Fin', en: 'End Date' },
  'add_medication': { es: 'Agregar Medicamento', en: 'Add Medication' },
  'medication_added': { es: 'Medicamento agregado exitosamente', en: 'Medication added successfully' },
  'take_medication': { es: 'Tomar Medicamento', en: 'Take Medication' },
  'medication_reminder': { es: 'Recordatorio de Medicamento', en: 'Medication Reminder' },
  'time_to_take': { es: 'Es hora de tomar tu medicamento', en: 'Time to take your medication' },
  
  // Consultas
  'consultation': { es: 'Consulta', en: 'Consultation' },
  'doctor': { es: 'Doctor', en: 'Doctor' },
  'specialty': { es: 'Especialidad', en: 'Specialty' },
  'date': { es: 'Fecha', en: 'Date' },
  'time': { es: 'Hora', en: 'Time' },
  'notes': { es: 'Notas', en: 'Notes' },
  'diagnosis': { es: 'Diagnóstico', en: 'Diagnosis' },
  'symptoms': { es: 'Síntomas', en: 'Symptoms' },
  
  // Configuraciones
  'general_settings': { es: 'Configuración General', en: 'General Settings' },
  'notifications': { es: 'Notificaciones', en: 'Notifications' },
  'enable_notifications': { es: 'Habilitar Notificaciones', en: 'Enable Notifications' },
  'enable_sound': { es: 'Habilitar Sonido', en: 'Enable Sound' },
  'enable_vibration': { es: 'Habilitar Vibración', en: 'Enable Vibration' },
  'language': { es: 'Idioma', en: 'Language' },
  'theme': { es: 'Tema', en: 'Theme' },
  'light_mode': { es: 'Modo Claro', en: 'Light Mode' },
  'dark_mode': { es: 'Modo Oscuro', en: 'Dark Mode' },
  'privacy': { es: 'Privacidad', en: 'Privacy' },
  'terms_conditions': { es: 'Términos y Condiciones', en: 'Terms & Conditions' },
  'privacy_policy': { es: 'Política de Privacidad', en: 'Privacy Policy' },
  'legal_notices': { es: 'Avisos Legales', en: 'Legal Notices' },
  
  // Recordatorios
  'reminder_set': { es: 'Recordatorio configurado', en: 'Reminder set' },
  'reminder_cancelled': { es: 'Recordatorio cancelado', en: 'Reminder cancelled' },
  'no_reminders': { es: 'No hay recordatorios configurados', en: 'No reminders set' },
  'upcoming_reminders': { es: 'Próximos Recordatorios', en: 'Upcoming Reminders' },
  
  // Errores y mensajes
  'error': { es: 'Error', en: 'Error' },
  'success': { es: 'Éxito', en: 'Success' },
  'warning': { es: 'Advertencia', en: 'Warning' },
  'info': { es: 'Información', en: 'Information' },
  'network_error': { es: 'Error de conexión', en: 'Network error' },
  'try_again': { es: 'Intentar de nuevo', en: 'Try again' },
  'something_went_wrong': { es: 'Algo salió mal', en: 'Something went wrong' },
  'required_field': { es: 'Campo requerido', en: 'Required field' },
  'invalid_email': { es: 'Correo electrónico inválido', en: 'Invalid email' },
  'password_too_short': { es: 'La contraseña es muy corta', en: 'Password is too short' },
  
  // Días de la semana
  'monday': { es: 'Lunes', en: 'Monday' },
  'tuesday': { es: 'Martes', en: 'Tuesday' },
  'wednesday': { es: 'Miércoles', en: 'Wednesday' },
  'thursday': { es: 'Jueves', en: 'Thursday' },
  'friday': { es: 'Viernes', en: 'Friday' },
  'saturday': { es: 'Sábado', en: 'Saturday' },
  'sunday': { es: 'Domingo', en: 'Sunday' },
  
  // Meses
  'january': { es: 'Enero', en: 'January' },
  'february': { es: 'Febrero', en: 'February' },
  'march': { es: 'Marzo', en: 'March' },
  'april': { es: 'Abril', en: 'April' },
  'may': { es: 'Mayo', en: 'May' },
  'june': { es: 'Junio', en: 'June' },
  'july': { es: 'Julio', en: 'July' },
  'august': { es: 'Agosto', en: 'August' },
  'september': { es: 'Septiembre', en: 'September' },
  'october': { es: 'Octubre', en: 'October' },
  'november': { es: 'Noviembre', en: 'November' },
  'december': { es: 'Diciembre', en: 'December' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('app_language');
      if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error cargando idioma:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('app_language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error guardando idioma:', error);
    }
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe ser usado dentro de LanguageProvider');
  }
  return context;
};