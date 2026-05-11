
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme, getPriorityColor } from '../theme';

const TaskCard = ({ task, onPress, onDelete, style }) => {
    const priorityColor = getPriorityColor(task.priority);
    const isCompleted = task.completed;

    const formattedDate = new Date(task.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });

    // Format time (e.g., 10:30 AM)
    const timeString = task.time ? task.time.split(' ')[0] : '';
    const formattedTime = timeString ? new Date('1970-01-01T' + timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    return (
        <TouchableOpacity
            style={[styles.container, isCompleted && styles.containerCompleted, style]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Left: Interactive Checkbox Look */}
            <View style={styles.checkboxContainer}>
                <View style={[
                    styles.checkbox,
                    isCompleted && styles.checkboxChecked,
                    { borderColor: isCompleted ? theme.colors.success : theme.colors.gray300 }
                ]}>
                    {isCompleted && <MaterialIcons name="check" size={14} color="white" />}
                </View>
            </View>

            {/* Center: Content */}
            <View style={styles.content}>
                <View style={styles.topRow}>
                    <Text
                        style={[styles.title, isCompleted && styles.textCompleted]}
                        numberOfLines={1}
                    >
                        {task.title}
                    </Text>

                    {/* Priority Dot */}
                    {!isCompleted && (
                        <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
                    )}
                </View>

                {task.description ? (
                    <Text
                        style={[styles.description, isCompleted && styles.textCompleted]}
                        numberOfLines={2}
                    >
                        {task.description}
                    </Text>
                ) : null}

                {/* Bottom Row: Metadata */}
                <View style={styles.metaRow}>
                    <View style={styles.timeTag}>
                        <MaterialIcons name="event" size={12} color={theme.colors.textTertiary} />
                        <Text style={styles.metaText}>{formattedDate}</Text>
                        {formattedTime && (
                            <>
                                <Text style={styles.metaSeparator}>•</Text>
                                <Text style={styles.metaText}>{formattedTime}</Text>
                            </>
                        )}
                    </View>

                    {/* Category Tag */}
                    {task.category && (
                        <View style={styles.categoryTag}>
                            <Text style={styles.categoryText}>{task.category}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Right: Actions */}
            <TouchableOpacity
                onPress={onDelete}
                style={styles.deleteBtn}
                hitSlop={10}
            >
                <MaterialIcons name="close" size={18} color={theme.colors.gray300} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: 16, // More rounded (Modern)
        padding: 16, // More whitespace
        marginBottom: 12,
        alignItems: 'flex-start',
        borderWidth: 0.5,
        borderColor: theme.colors.borderLight,
        // Soft Shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.03, // Very subtle
        shadowRadius: 8,
        elevation: 1,
    },
    containerCompleted: {
        backgroundColor: '#F3F4F6', // Gray-50ish
        borderColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
    },
    checkboxContainer: {
        marginRight: 12,
        paddingTop: 2, // Align with title text
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 8, // Squircle
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: theme.colors.success,
        borderColor: theme.colors.success,
    },
    content: {
        flex: 1,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textPrimary,
        flex: 1,
        marginRight: 8,
    },
    textCompleted: {
        color: theme.colors.textTertiary,
        textDecorationLine: 'line-through',
    },
    priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    description: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        marginBottom: 8,
        lineHeight: 18,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    timeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F3F4F6', // Light gray background for tag
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    metaText: {
        fontSize: 11,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    metaSeparator: {
        fontSize: 10,
        color: theme.colors.gray300,
        marginHorizontal: 2,
    },
    categoryTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    categoryText: {
        fontSize: 11,
        color: theme.colors.textTertiary,
        fontWeight: '500',
    },
    deleteBtn: {
        paddingLeft: 12,
        paddingTop: 2,
    },
});

export default TaskCard;
