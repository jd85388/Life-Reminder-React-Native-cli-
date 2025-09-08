import React, { useEffect, useRef } from 'react';
import {Animated, Text, TextStyle, StyleProp } from 'react-native';

type FadeInTextProps = {
    children: string;
    duration: number;
    style?: StyleProp<TextStyle>;
};

export default function FadeInText({ children, duration = 2000, style }: FadeInTextProps) {
    const animacionMovil = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animacionMovil, {
            toValue: 1,
            duration,
            useNativeDriver: true,
        }).start();
    }, [animacionMovil, duration]);

    return (
        <Animated.Text style={[{ opacity: animacionMovil }, style]}>
            {children }
        </Animated.Text>
    )
}