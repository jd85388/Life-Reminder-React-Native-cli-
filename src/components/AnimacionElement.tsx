import React, { useEffect, useRef } from 'react';
import { ViewStyle, Animated, StyleProp } from 'react-native';

type FadeInViewProps = {
    children: React.ReactNode;
    duration?: number; 
    style?: StyleProp<ViewStyle>
};

export default function AnimacionEfecto({ children, duration = 2000, style }: FadeInViewProps) {
    const animacionEfecto = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animacionEfecto, {
            toValue: 1,
            duration,
            useNativeDriver: true,
        }).start();
    }, [animacionEfecto, duration]);

    return (
        <Animated.View style={[{ opacity: animacionEfecto }, style]}>
            {children}
        </Animated.View>
    );
} 