import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
    animatedSplash: undefined;
    Home: undefined
    
};

type Props = NativeStackScreenProps<RootStackParamList, 'animatedSplash'>;


export default function AnimatedSplash({ navigation }: Props) {
    
    const onFinish = () => {
        navigation.replace('Home');
    };

    return (
        <View style={styles.container}>
            <LottieView
                source={require('../assets/animated/splash.json')}
                autoPlay
                loop={false}
                onAnimationFinish={onFinish}
                style={{ width: 260, height: 260 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1,
                backgroundColor: '#19ace6',
                alignItems: 'center',
                justifyContent: 'center'
    },
});