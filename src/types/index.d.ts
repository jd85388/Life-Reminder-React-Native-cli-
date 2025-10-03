// Declaraciones de tipos para módulos sin tipos oficiales

declare module 'react-native-push-notification' {
  export interface PushNotificationOptions {
    title?: string;
    message: string;
    date?: Date;
    playSound?: boolean;
    soundName?: string;
    repeatType?: 'week' | 'day' | 'hour' | 'minute' | 'time';
    actions?: string[];
    userInfo?: any;
    id?: string;
    ticker?: string;
    autoCancel?: boolean;
    largeIcon?: string;
    smallIcon?: string;
    bigText?: string;
    subText?: string;
    color?: string;
    vibrate?: boolean;
    vibration?: number;
    tag?: string;
    group?: string;
    ongoing?: boolean;
    priority?: 'max' | 'high' | 'low' | 'min' | 'default';
    visibility?: 'private' | 'public' | 'secret';
    importance?: 'default' | 'high' | 'low' | 'max' | 'min' | 'none' | 'unspecified';
    allowWhileIdle?: boolean;
    ignoreInForeground?: boolean;
    channelId?: string;
    onlyAlertOnce?: boolean;
    when?: number;
    usesChronometer?: boolean;
    timeoutAfter?: number;
    invokeApp?: boolean;
    category?: string;
  }

  export interface PushNotificationPermissions {
    alert?: boolean;
    badge?: boolean;
    sound?: boolean;
  }

  export interface ConfigurationOptions {
    onRegister?: (token: { token: string; os: string }) => void;
    onNotification?: (notification: any) => void;
    permissions?: PushNotificationPermissions;
    popInitialNotification?: boolean;
    requestPermissions?: boolean;
  }

  export interface ChannelObject {
    channelId: string;
    channelName: string;
    channelDescription?: string;
    soundName?: string;
    importance?: number;
    vibrate?: boolean;
  }

  interface PushNotificationClass {
    configure(options: ConfigurationOptions): void;
    localNotification(options: PushNotificationOptions): void;
    localNotificationSchedule(options: PushNotificationOptions): void;
    createChannel(channel: ChannelObject, callback?: (created: boolean) => void): void;
    cancelLocalNotifications(details: { id: string }): void;
    cancelAllLocalNotifications(): void;
    getApplicationIconBadgeNumber(callback: (number: number) => void): void;
    setApplicationIconBadgeNumber(number: number): void;
    getScheduledLocalNotifications(callback: (notifications: any[]) => void): void;
    getDeliveredNotifications(callback: (notifications: any[]) => void): void;
    removeDeliveredNotifications(identifiers: string[]): void;
    removeAllDeliveredNotifications(): void;
    requestPermissions(permissions?: PushNotificationPermissions): Promise<PushNotificationPermissions>;
    checkPermissions(callback: (permissions: PushNotificationPermissions) => void): void;
  }

  const PushNotification: PushNotificationClass;
  export default PushNotification;
}

declare module 'react-native-keyboard-aware-scroll-view' {
  import { ScrollViewProps } from 'react-native';
  import React from 'react';

  export interface KeyboardAwareScrollViewProps extends ScrollViewProps {
    enableOnAndroid?: boolean;
    enableAutomaticScroll?: boolean;
    extraHeight?: number;
    keyboardOpeningTime?: number;
    innerRef?: React.Ref<any>;
    extraScrollHeight?: number;
    getTextInputRefs?: () => any[];
    scrollToInputAdditionalOffset?: number;
    viewIsInsideTabBar?: boolean;
    resetScrollToCoords?: { x: number; y: number };
    enableResetScrollToCoords?: boolean;
  }

  export class KeyboardAwareScrollView extends React.Component<KeyboardAwareScrollViewProps> {}
}