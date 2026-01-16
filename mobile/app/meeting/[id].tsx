import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, typography } from '../../src/theme';
import { Meeting } from '../../src/types';
import { Ionicons } from '@expo/vector-icons';
import { createVIPAlert } from '../../src/services/api';

// For MVP, since we don't have a specific "get meeting details" endpoint that differs from the list,
// we will pass the meeting object via navigation params or context. 
// However, Expo Router params are strings, so we might need to fetch or parse.
// To keep it robust, let's assume we pass the full object as a JSON string for now, or fetch by ID if we built that endpoint.
// We'll simulate fetching or use the param for now.

export default function MeetingDetailScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedVIP, setSelectedVIP] = useState<string | null>(null);

    useEffect(() => {
        if (params.meeting) {
            try {
                const parsed = JSON.parse(params.meeting as string);
                setMeeting(parsed);
            } catch (e) {
                console.error("Failed to parse meeting param", e);
            }
        }
    }, [params]);

    const handleSetAlert = async (participantName: string) => {
        if (!meeting) return;

        Alert.alert(
            "Set VIP Alert",
            `Notify me when ${participantName} joins?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Set Alert",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await createVIPAlert(meeting.id, participantName); // Email optional for now
                            setSelectedVIP(participantName);
                            Alert.alert("Success", "You will be called when they join!");
                        } catch (error) {
                            Alert.alert("Error", "Failed to set alert");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    if (!meeting) return <View style={styles.container}><ActivityIndicator /></View>;

    // Mock participants if empty (common in dev with google calendar)
    const participants = meeting.participants && meeting.participants.length > 0
        ? meeting.participants
        : ['Brian Chen', 'Sarah Jones', 'Alex Rivera', 'Sam Altman'];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Select VIP</Text>
            </View>

            <View style={styles.meetingInfo}>
                <Text style={styles.meetingTitle}>{meeting.title}</Text>
                <Text style={styles.subtitle}>Who are you waiting for?</Text>
            </View>

            <FlatList
                data={participants}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.participantCard,
                            selectedVIP === item && styles.selectedCard
                        ]}
                        onPress={() => handleSetAlert(item)}
                        disabled={loading}
                    >
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{item[0]}</Text>
                        </View>
                        <Text style={styles.name}>{item}</Text>
                        {selectedVIP === item && (
                            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                        )}
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.l,
        marginBottom: spacing.l,
    },
    backButton: {
        marginRight: spacing.m,
    },
    title: {
        ...typography.h2,
        color: colors.text,
    },
    meetingInfo: {
        paddingHorizontal: spacing.l,
        marginBottom: spacing.l,
    },
    meetingTitle: {
        ...typography.h2,
        fontSize: 20,
        color: colors.primary,
        marginBottom: spacing.s,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
    },
    list: {
        paddingHorizontal: spacing.l,
    },
    participantCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        padding: spacing.m,
        borderRadius: 12,
        marginBottom: spacing.m,
    },
    selectedCard: {
        borderColor: colors.success,
        borderWidth: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    avatarText: {
        ...typography.h2,
        color: colors.text,
        fontSize: 18,
    },
    name: {
        ...typography.body,
        color: colors.text,
        flex: 1,
        fontWeight: '600' as const,
    },
});
