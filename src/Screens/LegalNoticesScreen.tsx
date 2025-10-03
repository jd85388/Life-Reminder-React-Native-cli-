// src/Screens/LegalNoticesScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface LegalNoticesScreenProps {
  navigation: any;
}

// Componente LicenseItem fuera del render
const LicenseItem: React.FC<{
  name: string;
  version?: string;
  license: string;
  url?: string;
  description: string;
}> = ({ name, version, license, url, description }) => {
  const { theme } = useTheme();
  
  const handleOpenLink = (linkUrl: string) => {
    Linking.openURL(linkUrl).catch(err => console.error('Error al abrir enlace:', err));
  };

  return (
    <View style={[styles.licenseItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.licenseHeader}>
        <Text style={[styles.licenseName, { color: theme.colors.text }]}>
          {name} {version && `v${version}`}
        </Text>
        <Text style={[styles.licenseType, { color: theme.colors.primary }]}>
          {license}
        </Text>
      </View>
      <Text style={[styles.licenseDescription, { color: theme.colors.textSecondary }]}>
        {description}
      </Text>
      {url && (
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => handleOpenLink(url)}
        >
          <Text style={[styles.linkText, { color: theme.colors.primary }]}>
            Ver más información
          </Text>
          <Icon name="open-outline" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const LegalNoticesScreen: React.FC<LegalNoticesScreenProps> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();

  React.useEffect(() => {
    navigation.setOptions({
      title: t('legal_notices'),
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
            Avisos Legales y Licencias
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Información de la Aplicación
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              Life Reminder v1.0.0{'\n'}
              Desarrollado para el manejo de medicamentos y recordatorios de salud{'\n'}
              © 2025 Life Reminder Team. Todos los derechos reservados.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Librerías y Dependencias de Código Abierto
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              Esta aplicación utiliza las siguientes librerías de código abierto:
            </Text>
          </View>

          <LicenseItem
            name="React Native"
            version="0.72.6"
            license="MIT License"
            description="Framework para desarrollo de aplicaciones móviles multiplataforma"
            url="https://github.com/facebook/react-native/blob/main/LICENSE"
          />

          <LicenseItem
            name="React Navigation"
            version="6.x"
            license="MIT License"
            description="Librería de navegación para aplicaciones React Native"
            url="https://github.com/react-navigation/react-navigation/blob/main/LICENSE"
          />

          <LicenseItem
            name="AsyncStorage"
            version="1.19.x"
            license="MIT License"
            description="Sistema de almacenamiento local asíncrono para React Native"
            url="https://github.com/react-native-async-storage/async-storage/blob/main/LICENSE"
          />

          <LicenseItem
            name="React Native Vector Icons"
            version="10.x"
            license="MIT License"
            description="Conjunto de iconos vectoriales personalizables"
            url="https://github.com/oblador/react-native-vector-icons/blob/master/LICENSE"
          />

          <LicenseItem
            name="React Native Push Notification"
            version="8.x"
            license="MIT License"
            description="Librería para notificaciones push locales y remotas"
            url="https://github.com/zo0r/react-native-push-notification/blob/master/LICENSE"
          />

          <LicenseItem
            name="React Native DateTimePicker"
            version="7.x"
            license="MIT License"
            description="Selector de fecha y hora nativo para React Native"
            url="https://github.com/react-native-datetimepicker/datetimepicker/blob/master/LICENSE.md"
          />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Atribuciones de Iconos
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              Los iconos utilizados en esta aplicación provienen de:
              {'\n\n'}• Ionicons - Diseñados por el equipo de Ionic
              {'\n'}• Material Design Icons - Google
              {'\n'}• Algunos iconos personalizados diseñados específicamente para Life Reminder
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Reconocimientos
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              Agradecemos a todas las comunidades de código abierto que hacen posible el desarrollo de aplicaciones como Life Reminder. Su trabajo y dedicación benefician a desarrolladores y usuarios en todo el mundo.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Licencia de la Aplicación
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              Life Reminder está protegida por derechos de autor y se distribuye bajo los términos especificados en nuestros Términos y Condiciones. El uso de esta aplicación está sujeto a dichos términos.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Cumplimiento Legal
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              Esta aplicación cumple con:
              {'\n\n'}• Regulaciones de protección de datos (GDPR, CCPA)
              {'\n'}• Normativas de aplicaciones médicas cuando aplique
              {'\n'}• Estándares de accesibilidad digital
              {'\n'}• Políticas de las tiendas de aplicaciones (App Store, Google Play)
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Contacto Legal
            </Text>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              Para consultas legales, violaciones de derechos de autor, o solicitudes relacionadas con licencias:
              {'\n\n'}• Email legal: legal@lifereminder.app
              {'\n'}• Dirección postal: [Dirección legal de la empresa]
            </Text>
          </View>

          <View style={styles.disclaimer}>
            <Icon name="information-circle-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.disclaimerText, { color: theme.colors.textSecondary }]}>
              Las licencias de código abierto pueden cambiar. Para obtener la información más actualizada, consulte los repositorios oficiales de cada proyecto.
            </Text>
          </View>

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
    marginBottom: 30,
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
  licenseItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
  },
  licenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  licenseName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  licenseType: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 4,
  },
  licenseDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 8,
    marginTop: 20,
  },
  disclaimerText: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 10,
    flex: 1,
  },
  bottomSpace: {
    height: 20,
  },
});

export default LegalNoticesScreen;