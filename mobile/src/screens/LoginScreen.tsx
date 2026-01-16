import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { colors, spacing, typography } from '../theme';
import { saveToken } from '../services/auth';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const router = useRouter();

    const handleLogin = async () => {
        // Points to our local backend auth route
        // In dev: Use localhost (mapped via adb or ngrok)
        // For Simulator: localhost works
        const backendUrl = 'http://localhost:5000/api/auth/google';

        const result = await WebBrowser.openAuthSessionAsync(
            backendUrl,
            Linking.createURL('/auth/callback')
        );

        if (result.type === 'success' && result.url) {
            // Extract token from URL
            const { queryParams } = Linking.parse(result.url);
            const token = queryParams?.token;

            if (token) {
                await saveToken(token as string);
                router.replace('/(tabs)/home'); // Navigate to home
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Sage</Text>
                <Text style={styles.subtitle}>Never wait for a meeting again.</Text>
            </View>

            <View style={styles.content}>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Sign in with Google</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        padding: spacing.l,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl * 2,
    },
    title: {
        ...typography.h1,
        color: colors.text,
        marginBottom: spacing.s,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    content: {
        alignItems: 'center',
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.xl,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        ...typography.body,
        fontWeight: '600' as const,
        color: 'white',
    },
});
