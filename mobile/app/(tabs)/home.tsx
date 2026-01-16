import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { colors, typography, spacing } from '../../src/theme';
import { fetchTodayMeetings } from '../../src/services/api';
import { Meeting } from '../../src/types';
import { MeetingCard } from '../../src/components/MeetingCard';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadMeetings();
    }, []);

    const loadMeetings = async () => {
        try {
            const data = await fetchTodayMeetings();
            setMeetings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePress = (meeting: Meeting) => {
        // Pass full object as string param for MVP simplicity
        router.push({
            pathname: `/meeting/${meeting.id}`,
            params: { meeting: JSON.stringify(meeting) }
        });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Today's Meetings</Text>

            <FlatList
                data={meetings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <MeetingCard meeting={item} onPress={handlePress} />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No meetings found for today.</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 60, // Safe area padding
    },
    headerTitle: {
        ...typography.h1,
        color: colors.text,
        paddingHorizontal: spacing.l,
        marginBottom: spacing.l,
    },
    listContent: {
        paddingHorizontal: spacing.l,
    },
    emptyText: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.xl,
    },
});
