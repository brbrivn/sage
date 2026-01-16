import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Meeting } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    meeting: Meeting;
    onPress: (meeting: Meeting) => void;
}

export const MeetingCard = ({ meeting, onPress }: Props) => {
    const startTime = new Date(meeting.startTime);
    const timeString = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Calculate time until meeting
    const now = new Date();
    const diffMs = startTime.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    let timeStatus = '';
    let statusColor = colors.textSecondary;

    if (diffMs < 0) {
        timeStatus = 'Started';
        statusColor = colors.success;
    } else if (diffMins < 60) {
        timeStatus = `in ${diffMins}m`;
        statusColor = colors.primary;
    } else {
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        timeStatus = `in ${hours}h ${mins}m`;
    }

    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(meeting)}>
            <View style={styles.iconContainer}>
                <Ionicons name="videocam" size={24} color={colors.primary} />
            </View>

            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{meeting.title}</Text>
                <Text style={styles.time}>{timeString} • {meeting.platform}</Text>
            </View>

            <View style={styles.status}>
                <Text style={[styles.statusText, { color: statusColor }]}>{timeStatus}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(99, 102, 241, 0.1)', // Primary with opacity
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    info: {
        flex: 1,
    },
    title: {
        ...typography.h2,
        fontSize: 16,
        color: colors.text,
        marginBottom: 4,
    },
    time: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    status: {
        marginLeft: spacing.s,
    },
    statusText: {
        ...typography.caption,
        fontWeight: '600' as const,
    },
});
