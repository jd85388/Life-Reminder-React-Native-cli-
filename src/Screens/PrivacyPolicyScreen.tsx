// src/Screens/PrivacyPolicyScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface PrivacyPolicyScreenProps {
  navigation: any;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();

  React.useEffect(() => {
    navigation.setOptions({
      title: t('privacy_policy'),
      headerStyle: {
        backgroundColor: theme.colors.surface,
      },
      headerTintColor: theme.colors.text,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [theme, navigation, t]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        backgroundColor={theme.colors.surface}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Política de Privacidad
          </Text>
          
          <Text style={[styles.lastUpdated, { color: theme.colors.textSecondary }]}>
            Última actualización: 2 de octubre de 2025
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              1. Información que Recopilamos
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              Life Reminder recopila la siguiente información para brindarle nuestros servicios:
              {'\n\n'}• Información de registro: nombre, apellido, email, fecha de nacimiento
              {'\n'}• Información médica: medicamentos, dosis, horarios, consultas médicas
              {'\n'}• Datos de uso: interacciones con la aplicación, preferencias
              {'\n'}• Información del dispositivo: tipo de dispositivo, sistema operativo
              {'\n'}• Datos de notificaciones: historial de recordatorios y respuestas
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              2. Cómo Utilizamos su Información
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              Utilizamos su información personal para:
              {'\n\n'}• Proporcionar servicios de recordatorios de medicamentos
              {'\n'}• Personalizar su experiencia en la aplicación
              {'\n'}• Enviar notificaciones y alertas médicas
              {'\n'}• Mejorar la funcionalidad de la aplicación
              {'\n'}• Proporcionar soporte técnico
              {'\n'}• Cumplir con obligaciones legales
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              3. Protección de Datos Médicos
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              Entendemos la naturaleza sensible de la información médica y aplicamos medidas especiales de protección:
              {'\n\n'}• Cifrado end-to-end de todos los datos médicos
              {'\n'}• Almacenamiento seguro en servidores certificados
              {'\n'}• Acceso restringido solo a personal autorizado
              {'\n'}• Auditorías regulares de seguridad
              {'\n'}• Cumplimiento con regulaciones de protección de datos médicos
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              4. Compartir Información
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              NO vendemos, alquilamos ni compartimos su información personal con terceros para fines comerciales. Solo compartimos información en las siguientes circunstancias:
              {'\n\n'}• Con su consentimiento explícito
              {'\n'}• Para cumplir con obligaciones legales
              {'\n'}• En casos de emergencia médica (con autorización)
              {'\n'}• Con proveedores de servicios que ayudan a operar la aplicación (bajo estrictos acuerdos de confidencialidad)
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              5. Almacenamiento de Datos
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              Sus datos se almacenan de la siguiente manera:
              {'\n\n'}• Localmente en su dispositivo (datos de configuración y cache)
              {'\n'}• En servidores seguros en la nube (datos de respaldo)
              {'\n'}• Cifrados tanto en tránsito como en reposo
              {'\n'}• Con copias de seguridad regulares y seguras
              {'\n'}• Conservados mientras mantenga su cuenta activa
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              6. Sus Derechos
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              Usted tiene los siguientes derechos sobre sus datos personales:
              {'\n\n'}• Acceso: Solicitar una copia de sus datos personales
              {'\n'}• Rectificación: Corregir datos inexactos o incompletos
              {'\n'}• Eliminación: Solicitar la eliminación de sus datos
              {'\n'}• Portabilidad: Obtener sus datos en formato transferible
              {'\n'}• Restricción: Limitar el procesamiento de sus datos
              {'\n'}• Oposición: Oponerse al procesamiento en ciertas circunstancias
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              7. Cookies y Tecnologías Similares
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              La aplicación utiliza tecnologías de almacenamiento local para:
              {'\n\n'}• Recordar sus preferencias y configuraciones
              {'\n'}• Mantener su sesión activa
              {'\n'}• Almacenar datos de uso para mejorar el rendimiento
              {'\n'}• Facilitar funcionalidades sin conexión
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              8. Seguridad
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              Implementamos múltiples capas de seguridad:
              {'\n\n'}• Autenticación multi-factor opcional
              {'\n'}• Cifrado AES-256 para datos sensibles
              {'\n'}• Monitoreo continuo de amenazas
              {'\n'}• Actualizaciones regulares de seguridad
              {'\n'}• Protocolos de respuesta a incidentes
              {'\n'}• Auditorías de seguridad independientes
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              9. Menores de Edad
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              Life Reminder no está dirigida a menores de 13 años. No recopilamos conscientemente información personal de menores de 13 años. Los usuarios entre 13 y 18 años deben contar con supervisión parental.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              10. Cambios en esta Política
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos sobre cambios significativos a través de la aplicación o por email. Le recomendamos revisar esta política periódicamente.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              11. Transferencias Internacionales
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              Sus datos pueden ser transferidos y procesados en países diferentes al suyo. Garantizamos que estas transferencias cumplan con las regulaciones aplicables de protección de datos.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              12. Contacto
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              Para preguntas sobre esta política de privacidad o para ejercer sus derechos:
              {'\n\n'}• Email: privacy@lifereminder.app
              {'\n'}• Dirección: [Dirección de la empresa]
              {'\n'}• Teléfono: [Número de contacto]
              {'\n'}• Delegado de Protección de Datos: dpo@lifereminder.app
            </Text>
          </View>

          <Text style={[styles.disclaimer, { color: theme.colors.warning }]}>
            🔒 Su privacidad es nuestra prioridad. Implementamos las mejores prácticas de seguridad para proteger su información médica personal.
          </Text>

          <View style={styles.bottomSpace} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  lastUpdated: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  disclaimer: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  bottomSpace: {
    height: 20,
  },
});

export default PrivacyPolicyScreen;