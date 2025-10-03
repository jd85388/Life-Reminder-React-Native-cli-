// src/Screens/SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  StatusBar,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import EnhancedNotificationService, { NotificationSettings } from '../services/EnhancedNotificationService';

interface SettingsScreenProps {
  navigation: any;
}

// Componentes auxiliares fuera del render
const SettingItem: React.FC<{
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  icon?: string;
  showArrow?: boolean;
}> = ({ title, subtitle, onPress, rightComponent, icon, showArrow = false }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        {icon && (
          <Icon name={icon} size={24} color={theme.colors.primary} style={styles.settingIcon} />
        )}
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && (
          <Icon name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.sectionHeader, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>{title}</Text>
    </View>
  );
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: true,
    sound: true,
    vibration: true,
    badge: true,
    snoozeMinutes: 5,
    maxSnoozes: 3,
  });
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [snoozeModalVisible, setSnoozeModalVisible] = useState(false);

  useEffect(() => {
    loadNotificationSettings();
    // Configurar header
    navigation.setOptions({
      title: t('settings'),
      headerStyle: {
        backgroundColor: theme.colors.surface,
      },
      headerTintColor: theme.colors.text,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [theme, language, navigation, t]);

  const loadNotificationSettings = async () => {
    try {
      const settings = await EnhancedNotificationService.getNotificationSettings();
      setNotificationSettings(settings);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const updateNotificationSetting = async (
    key: keyof NotificationSettings,
    value: boolean | number
  ) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    
    try {
      await EnhancedNotificationService.updateNotificationSettings(newSettings);
    } catch (error) {
      console.error('Error actualizando configuración:', error);
      Alert.alert(t('error'), t('something_went_wrong'));
    }
  };

  const requestNotificationPermissions = async () => {
    try {
      const granted = await EnhancedNotificationService.requestPermissions();
      if (granted) {
        updateNotificationSetting('enabled', true);
        Alert.alert(t('success'), 'Permisos de notificación otorgados');
      } else {
        Alert.alert(
          t('warning'),
          'Los permisos de notificación son necesarios para los recordatorios de medicamentos'
        );
      }
    } catch (error) {
      console.error('Error solicitando permisos:', error);
    }
  };

  const showLanguageModal = () => {
    setLanguageModalVisible(true);
  };

  const selectLanguage = (lang: 'es' | 'en') => {
    setLanguage(lang);
    setLanguageModalVisible(false);
    Alert.alert(t('success'), 'Idioma actualizado correctamente');
  };

  const showSnoozeModal = () => {
    setSnoozeModalVisible(true);
  };

  const selectSnoozeTime = (minutes: number) => {
    updateNotificationSetting('snoozeMinutes', minutes);
    setSnoozeModalVisible(false);
  };

  // Estilos calculados
  const getLanguageButtonStyle = (isSelected: boolean) => [
    styles.languageOption,
    isSelected ? { backgroundColor: theme.colors.primary } : null
  ];

  const getLanguageTextStyle = (isSelected: boolean) => [
    styles.languageText,
    { color: isSelected ? '#fff' : theme.colors.text }
  ];

  const getSnoozeButtonStyle = (isSelected: boolean) => [
    styles.languageOption,
    isSelected ? { backgroundColor: theme.colors.primary } : null
  ];

  const getSnoozeTextStyle = (isSelected: boolean) => [
    styles.languageText,
    { color: isSelected ? '#fff' : theme.colors.text }
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        backgroundColor={theme.colors.surface}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Sección de Notificaciones */}
        <SectionHeader title={t('notifications')} />
        
        <SettingItem
          title={t('enable_notifications')}
          subtitle="Recibir recordatorios de medicamentos"
          icon="notifications-outline"
          rightComponent={
            <Switch
              value={notificationSettings.enabled}
              onValueChange={(value) => {
                if (value) {
                  requestNotificationPermissions();
                } else {
                  updateNotificationSetting('enabled', value);
                }
              }}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.card}
            />
          }
        />

        {notificationSettings.enabled && (
          <>
            <SettingItem
              title={t('enable_sound')}
              subtitle="Reproducir sonido con las notificaciones"
              icon="volume-high-outline"
              rightComponent={
                <Switch
                  value={notificationSettings.sound}
                  onValueChange={(value) => updateNotificationSetting('sound', value)}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={theme.colors.card}
                />
              }
            />

            <SettingItem
              title={t('enable_vibration')}
              subtitle="Vibrar al recibir notificaciones"
              icon="phone-portrait-outline"
              rightComponent={
                <Switch
                  value={notificationSettings.vibration}
                  onValueChange={(value) => updateNotificationSetting('vibration', value)}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={theme.colors.card}
                />
              }
            />

            <SettingItem
              title="Tiempo de postergación"
              subtitle={`${notificationSettings.snoozeMinutes} minutos`}
              icon="time-outline"
              onPress={showSnoozeModal}
              showArrow
            />

            <SettingItem
              title="Máximo de postergaciones"
              subtitle={`${notificationSettings.maxSnoozes} veces`}
              icon="repeat-outline"
              rightComponent={
                <View style={styles.numberContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      if (notificationSettings.maxSnoozes > 1) {
                        updateNotificationSetting('maxSnoozes', notificationSettings.maxSnoozes - 1);
                      }
                    }}
                    style={[styles.numberButton, { backgroundColor: theme.colors.surface }]}
                  >
                    <Icon name="remove" size={16} color={theme.colors.text} />
                  </TouchableOpacity>
                  <Text style={[styles.numberText, { color: theme.colors.text }]}>
                    {notificationSettings.maxSnoozes}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (notificationSettings.maxSnoozes < 10) {
                        updateNotificationSetting('maxSnoozes', notificationSettings.maxSnoozes + 1);
                      }
                    }}
                    style={[styles.numberButton, { backgroundColor: theme.colors.surface }]}
                  >
                    <Icon name="add" size={16} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>
              }
            />
          </>
        )}

        {/* Sección de Apariencia */}
        <SectionHeader title="Apariencia" />
        
        <SettingItem
          title={t('theme')}
          subtitle={isDark ? t('dark_mode') : t('light_mode')}
          icon="contrast-outline"
          rightComponent={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.card}
            />
          }
        />

        <SettingItem
          title={t('language')}
          subtitle={language === 'es' ? 'Español' : 'English'}
          icon="language-outline"
          onPress={showLanguageModal}
          showArrow
        />

        {/* Sección de Privacidad */}
        <SectionHeader title={t('privacy')} />
        
        <SettingItem
          title={t('terms_conditions')}
          subtitle="Leer términos y condiciones"
          icon="document-text-outline"
          onPress={() => navigation.navigate('TermsConditions')}
          showArrow
        />

        <SettingItem
          title={t('privacy_policy')}
          subtitle="Leer política de privacidad"
          icon="shield-checkmark-outline"
          onPress={() => navigation.navigate('PrivacyPolicy')}
          showArrow
        />

        <SettingItem
          title={t('legal_notices')}
          subtitle="Avisos legales y licencias"
          icon="information-circle-outline"
          onPress={() => navigation.navigate('LegalNotices')}
          showArrow
        />

        {/* Sección de Cuenta */}
        <SectionHeader title="Cuenta" />
        
        <SettingItem
          title="Historial de notificaciones"
          subtitle="Ver historial de recordatorios"
          icon="time-outline"
          onPress={() => navigation.navigate('NotificationHistory')}
          showArrow
        />

        <SettingItem
          title="Exportar datos"
          subtitle="Descargar información personal"
          icon="download-outline"
          onPress={() => {
            Alert.alert('Funcionalidad próximamente', 'Esta función estará disponible pronto');
          }}
          showArrow
        />

        <SettingItem
          title="Eliminar todos los recordatorios"
          subtitle="Cancelar todas las notificaciones"
          icon="trash-outline"
          onPress={() => {
            Alert.alert(
              'Confirmar eliminación',
              '¿Estás seguro de que quieres eliminar todos los recordatorios?',
              [
                { text: t('cancel'), style: 'cancel' },
                {
                  text: 'Eliminar',
                  style: 'destructive',
                  onPress: async () => {
                    await EnhancedNotificationService.cancelAllNotifications();
                    Alert.alert(t('success'), 'Todos los recordatorios han sido eliminados');
                  },
                },
              ]
            );
          }}
        />

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Modal de selección de idioma */}
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Seleccionar Idioma
            </Text>
            
            <TouchableOpacity
              style={getLanguageButtonStyle(language === 'es')}
              onPress={() => selectLanguage('es')}
            >
              <Text style={getLanguageTextStyle(language === 'es')}>
                🇪🇸 Español
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={getLanguageButtonStyle(language === 'en')}
              onPress={() => selectLanguage('en')}
            >
              <Text style={getLanguageTextStyle(language === 'en')}>
                🇺🇸 English
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: theme.colors.border }]}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={[styles.cancelText, { color: theme.colors.textSecondary }]}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de tiempo de postergación */}
      <Modal
        visible={snoozeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSnoozeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Tiempo de Postergación
            </Text>
            
            {[5, 10, 15, 30].map((minutes) => (
              <TouchableOpacity
                key={minutes}
                style={getSnoozeButtonStyle(notificationSettings.snoozeMinutes === minutes)}
                onPress={() => selectSnoozeTime(minutes)}
              >
                <Text style={getSnoozeTextStyle(notificationSettings.snoozeMinutes === minutes)}>
                  {minutes} minutos
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: theme.colors.border }]}
              onPress={() => setSnoozeModalVisible(false)}
            >
              <Text style={[styles.cancelText, { color: theme.colors.textSecondary }]}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  numberButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  bottomSpace: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  languageOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  languageText: {
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SettingsScreen;