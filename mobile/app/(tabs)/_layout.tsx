import { Tabs } from 'expo-router';
import { colors } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Meetings',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
