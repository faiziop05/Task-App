import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../theme';

const EmptyState = ({
    icon = 'event-busy',
    title = 'No Items Found',
    message = 'Get started by adding your first item',
    actionText,
    onAction
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <MaterialIcons name={icon} size={80} color={theme.colors.gray300} />
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            {actionText && onAction && (
                <TouchableOpacity style={styles.actionButton} onPress={onAction}>
                    <Text style={styles.actionText}>{actionText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing['4xl'],
        paddingHorizontal: theme.spacing.xl,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: theme.radius.full,
        backgroundColor: theme.colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.xl,
    },
    title: {
        fontSize: theme.typography.sizes['2xl'],
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    message: {
        fontSize: theme.typography.sizes.base,
        fontWeight: theme.typography.weights.regular,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: theme.spacing.xl,
    },
    actionButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radius.sm,
    },
    actionText: {
        fontSize: theme.typography.sizes.base,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.white,
    },
});

export default EmptyState;
