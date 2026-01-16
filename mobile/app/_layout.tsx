import { Stack } from 'expo-router';
import { View } from 'react-native';
import { colors } from '../src/theme';

export default function Layout() {
    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.background,
                    },
                    headerTintColor: colors.text,
                    headerShadowVisible: false,
                    contentStyle: { backgroundColor: colors.background },
                }}
            >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </View>
    );
}
