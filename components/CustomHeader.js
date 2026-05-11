
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../theme';

const CustomHeader = ({
    title,
    showBack,
    onBackPress,
    rightAction,
    rightIcon = 'more-vert',
    onRightPress,
    transparent = false
}) => {
    return (
        <View style={[styles.headerWrapper, transparent && styles.transparentWrapper]}>
            <View style={[styles.safeArea, transparent && styles.transparentSafeArea]}>
                <View style={styles.container}>
                    <View style={styles.leftSection}>
                        {showBack ? (
                            <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
                                <MaterialIcons name="arrow-back-ios-new" size={20} color={theme.colors.textPrimary} />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.placeholder} />
                        )}
                    </View>

                    <View style={styles.centerSection}>
                        <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    </View>

                    <View style={styles.rightSection}>
                        {rightAction ? (
                            <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
                                <MaterialIcons name={rightIcon} size={24} color={theme.colors.textPrimary} />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.placeholder} />
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerWrapper: {
        backgroundColor: theme.colors.surface,
        ...theme.shadows.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
        zIndex: 10,
    },
    transparentWrapper: {
        backgroundColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
        borderBottomWidth: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    safeArea: {
        backgroundColor: theme.colors.surface,
    },
    transparentSafeArea: {
        backgroundColor: 'transparent',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56, // Standard header height
        paddingHorizontal: theme.spacing.base,
    },
    leftSection: {
        width: 48,
        alignItems: 'flex-start',
    },
    centerSection: {
        flex: 1,
        alignItems: 'center',
    },
    rightSection: {
        width: 48,
        alignItems: 'flex-end',
    },
    title: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.textPrimary,
        letterSpacing: 0.5,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.gray50,
        paddingRight: 2
    },
    placeholder: {
        width: 48,
    },
});

export default CustomHeader;
