import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView, View } from 'react-native';
import { theme } from '../theme';

const FilterChips = ({ filters, onFilterChange }) => {
    const statusFilters = ['All', 'Pending', 'Overdue'];
    const priorityFilters = ['All', 'High', 'Medium', 'Low'];

    return (
        <View style={styles.container}>
            {/* Status Filters */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Status</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
                    {statusFilters.map((status) => (
                        <TouchableOpacity
                            key={status}
                            style={[
                                styles.chip,
                                filters.status === status.toLowerCase() && styles.chipActive,
                            ]}
                            onPress={() => onFilterChange('status', status.toLowerCase())}
                        >
                            <Text
                                style={[
                                    styles.chipText,
                                    filters.status === status.toLowerCase() && styles.chipTextActive,
                                ]}
                            >
                                {status}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Priority Filters */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Priority</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
                    {priorityFilters.map((priority) => (
                        <TouchableOpacity
                            key={priority}
                            style={[
                                styles.chip,
                                filters.priority === priority.toLowerCase() && styles.chipActive,
                            ]}
                            onPress={() => onFilterChange('priority', priority.toLowerCase())}
                        >
                            <Text
                                style={[
                                    styles.chipText,
                                    filters.priority === priority.toLowerCase() && styles.chipTextActive,
                                ]}
                            >
                                {priority}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: theme.spacing.md,
    },
    section: {
        gap: theme.spacing.sm,
    },
    sectionTitle: {
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.textSecondary,
        paddingHorizontal: theme.spacing.base,
    },
    chipsContainer: {
        paddingHorizontal: theme.spacing.base,
        gap: theme.spacing.sm,
    },
    chip: {
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.radius.full,
        backgroundColor: theme.colors.gray100,
        borderWidth: 1,
        borderColor: theme.colors.gray200,
    },
    chipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    chipText: {
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.textSecondary,
    },
    chipTextActive: {
        color: theme.colors.white,
        fontWeight: theme.typography.weights.semibold,
    },
});

export default FilterChips;
