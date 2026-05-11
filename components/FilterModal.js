
import React, { useState, useEffect } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    Animated,
    Dimensions
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../theme';

const { height } = Dimensions.get('window');

const FilterModal = ({ visible, onClose, currentFilters, onApply }) => {
    const [filters, setFilters] = useState(currentFilters);
    const [slideAnim] = useState(new Animated.Value(height));

    useEffect(() => {
        if (visible) {
            setFilters(currentFilters); // Reset to current applied when opening
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                damping: 20,
                mass: 1,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: height,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleClose = () => {
        Animated.timing(slideAnim, {
            toValue: height,
            duration: 250,
            useNativeDriver: true,
        }).start(() => onClose());
    };

    const toggleFilter = (type, value) => {
        setFilters(prev => ({
            ...prev,
            [type]: prev[type] === value ? 'all' : value
        }));
    };

    const handleApply = () => {
        onApply(filters);
        handleClose();
    };

    const handleClear = () => {
        const resetFilters = { status: 'all', priority: 'all', sort: 'newest' };
        setFilters(resetFilters);
        // Optional: Apply immediately or wait for "Apply"
        // onApply(resetFilters); 
    };

    const FilterSection = ({ title, options, type }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.optionsGrid}>
                {options.map((opt) => {
                    const isActive = filters[type] === opt.value;
                    return (
                        <TouchableOpacity
                            key={opt.value}
                            style={[styles.optionChip, isActive && styles.optionChipActive]}
                            onPress={() => toggleFilter(type, opt.value)}
                        >
                            <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                                {opt.label}
                            </Text>
                            {isActive && <MaterialIcons name="check" size={16} color={theme.colors.primary} />}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                <Animated.View
                    style={[
                        styles.modalContainer,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Filters</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                            <MaterialIcons name="close" size={24} color={theme.colors.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        <FilterSection
                            title="Status"
                            type="status"
                            options={[
                                { label: 'Pending', value: 'pending' },
                                { label: 'Overdue', value: 'overdue' },
                                { label: 'Completed', value: 'completed' }, // Hidden by default in Home logic, but user can force show
                            ]}
                        />

                        <FilterSection
                            title="Priority"
                            type="priority"
                            options={[
                                { label: 'High Priority', value: 'high' },
                                { label: 'Medium Priority', value: 'medium' },
                                { label: 'Low Priority', value: 'low' },
                            ]}
                        />

                        {/* Additional Filters Example */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Sort Order</Text>
                            <View style={styles.optionsGrid}>
                                {[{ label: 'Newest First', value: 'newest' }, { label: 'Oldest First', value: 'oldest' }].map(opt => (
                                    <TouchableOpacity
                                        key={opt.value}
                                        style={[styles.optionChip, filters.sort === opt.value && styles.optionChipActive]}
                                        onPress={() => setFilters(prev => ({ ...prev, sort: opt.value }))}
                                    >
                                        <Text style={[styles.optionText, filters.sort === opt.value && styles.optionTextActive]}>
                                            {opt.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
                            <Text style={styles.clearText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleApply} style={styles.applyBtn}>
                            <Text style={styles.applyText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContainer: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        paddingBottom: 20,
        ...theme.shadows.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.lg,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.borderLight,
    },
    title: {
        fontSize: theme.typography.sizes.xl,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
    },
    content: {
        padding: theme.spacing.lg,
    },
    section: {
        marginBottom: theme.spacing['2xl'],
    },
    sectionTitle: {
        fontSize: theme.typography.sizes.base,
        fontWeight: '600',
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    optionChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: theme.radius.full,
        borderWidth: 1,
        borderColor: theme.colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: theme.colors.background,
    },
    optionChipActive: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '10', // 10% opacity primary
    },
    optionText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    optionTextActive: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        padding: theme.spacing.lg,
        borderTopWidth: 0.5,
        borderTopColor: theme.colors.borderLight,
        gap: theme.spacing.md,
    },
    clearBtn: {
        flex: 1,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radius.base,
        // backgroundColor: theme.colors.background,
    },
    clearText: {
        color: theme.colors.textSecondary,
        fontWeight: '600',
        fontSize: 16,
    },
    applyBtn: {
        flex: 2,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        backgroundColor: theme.colors.primary,
        ...theme.shadows.md,
    },
    applyText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default FilterModal;
