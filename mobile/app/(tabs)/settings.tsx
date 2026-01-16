import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../src/theme';

export default function SettingsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Settings</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    text: {
        ...typography.h2,
        color: colors.text,
    },
});
