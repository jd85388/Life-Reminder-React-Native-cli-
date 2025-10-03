// src/Screens/TermsConditionsScreen.tsx
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

interface TermsConditionsScreenProps {
  navigation: any;
}

// Componente Section fuera del render
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>{children}</Text>
    </View>
  );
};

const TermsConditionsScreen: React.FC<TermsConditionsScreenProps> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();

  React.useEffect(() => {
    navigation.setOptions({
      title: t('terms_conditions'),
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
            Términos y Condiciones de Uso
          </Text>
          
          <Text style={[styles.lastUpdated, { color: theme.colors.textSecondary }]}>
            Última actualización: 2 de octubre de 2025
          </Text>

          <Section title="1. Aceptación de los Términos">
            Al descargar, instalar o utilizar la aplicación Life Reminder, usted acepta estar legalmente obligado por estos términos y condiciones. Si no está de acuerdo con alguno de estos términos, no utilice la aplicación.
          </Section>

          <Section title="2. Descripción del Servicio">
            Life Reminder es una aplicación móvil diseñada para ayudar a los usuarios a gestionar sus medicamentos, consultas médicas y recordatorios de salud. La aplicación proporciona funcionalidades para:
            {'\n'}• Registro y seguimiento de medicamentos
            {'\n'}• Programación de recordatorios
            {'\n'}• Gestión de consultas médicas
            {'\n'}• Almacenamiento de información médica personal
          </Section>

          <Section title="3. Uso Responsable">
            Usted se compromete a:
            {'\n'}• Utilizar la aplicación únicamente para fines legales y autorizados
            {'\n'}• Proporcionar información precisa y actualizada
            {'\n'}• Mantener la confidencialidad de sus credenciales de acceso
            {'\n'}• No utilizar la aplicación para actividades fraudulentas o maliciosas
            {'\n'}• Seguir siempre las indicaciones de profesionales médicos calificados
          </Section>

          <Section title="4. Limitaciones de Responsabilidad Médica">
            IMPORTANTE: Life Reminder es una herramienta de apoyo y NO sustituye el consejo médico profesional. Usted entiende y acepta que:
            {'\n'}• La aplicación no proporciona diagnósticos médicos
            {'\n'}• No debe confiar únicamente en la aplicación para decisiones médicas
            {'\n'}• Siempre debe consultar con profesionales de la salud calificados
            {'\n'}• En caso de emergencia médica, contacte inmediatamente a servicios de emergencia
          </Section>

          <Section title="5. Privacidad y Protección de Datos">
            Nos comprometemos a proteger su privacidad. El tratamiento de sus datos personales se rige por nuestra Política de Privacidad, que forma parte integral de estos términos. Los datos médicos son especialmente sensibles y se manejan con el máximo nivel de seguridad.
          </Section>

          <Section title="6. Precisión de la Información">
            Aunque nos esforzamos por mantener la información actualizada y precisa, no garantizamos la exactitud, integridad o actualidad de toda la información en la aplicación. Es responsabilidad del usuario verificar la información médica con profesionales calificados.
          </Section>

          <Section title="7. Disponibilidad del Servicio">
            Nos reservamos el derecho de:
            {'\n'}• Modificar, suspender o interrumpir el servicio temporalmente
            {'\n'}• Realizar mantenimiento programado
            {'\n'}• Actualizar funcionalidades de la aplicación
            {'\n'}• Cambiar estos términos con previo aviso
          </Section>

          <Section title="8. Propiedad Intelectual">
            Todos los derechos de propiedad intelectual de la aplicación, incluyendo pero no limitado a código fuente, diseño, contenido y marcas comerciales, son propiedad exclusiva del desarrollador.
          </Section>

          <Section title="9. Limitación de Responsabilidad">
            En la máxima medida permitida por la ley, el desarrollador no será responsable por:
            {'\n'}• Daños directos, indirectos, incidentales o consecuentes
            {'\n'}• Pérdida de datos o información
            {'\n'}• Interrupciones del servicio
            {'\n'}• Decisiones médicas basadas en la información de la aplicación
          </Section>

          <Section title="10. Modificaciones de los Términos">
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en la aplicación. El uso continuado de la aplicación constituye la aceptación de los términos modificados.
          </Section>

          <Section title="11. Terminación">
            Podemos terminar o suspender su acceso a la aplicación inmediatamente, sin previo aviso, por cualquier motivo, incluyendo el incumplimiento de estos términos.
          </Section>

          <Section title="12. Ley Aplicable">
            Estos términos se regirán e interpretarán de acuerdo con las leyes del país donde se desarrolló la aplicación, sin considerar conflictos de principios legales.
          </Section>

          <Section title="13. Contacto">
            Si tiene preguntas sobre estos términos y condiciones, puede contactarnos a través de:
            {'\n'}• Email: support@lifereminder.app
            {'\n'}• Dentro de la aplicación en la sección de soporte
          </Section>

          <Text style={[styles.disclaimer, { color: theme.colors.warning }]}>
            ⚠️ AVISO IMPORTANTE: Esta aplicación es una herramienta de apoyo y no sustituye la consulta médica profesional. Siempre consulte con un profesional de la salud para decisiones médicas importantes.
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
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
  },
  bottomSpace: {
    height: 20,
  },
});

export default TermsConditionsScreen;