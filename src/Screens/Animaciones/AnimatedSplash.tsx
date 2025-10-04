import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App'; 

type Props = NativeStackScreenProps<RootStackParamList, 'animatedSplash'>;

export default function AnimatedSplash({ navigation }: Props) {
  const onFinish = () => {
    navigation.replace('Rutas'); 
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/animated/splash.json')}
        autoPlay
        loop={false}
        onAnimationFinish={onFinish}
        style={{ width: 260, height: 260 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#19ace6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
