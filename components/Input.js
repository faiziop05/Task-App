
import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { theme } from '../theme';

const Input = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    error,
    leftIcon,
    rightIcon,
    keyboardType,
    autoCapitalize = 'none',
    multiline = false,
    numberOfLines = 1,
    style,
    inputStyle
}) => {
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={[
                styles.inputContainer,
                error && styles.inputContainerError,
                multiline && styles.inputContainerMultiline
            ]}>
                {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.gray400}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    style={[
                        styles.input,
                        multiline && styles.inputMultiline,
                        inputStyle
                    ]}
                />

                {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.base,
    },
    label: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textPrimary,
        fontWeight: theme.typography.weights.medium,
        marginBottom: theme.spacing.xs,
        marginLeft: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.base,
        paddingHorizontal: theme.spacing.md,
        height: 52,
        ...theme.shadows.sm, // Very subtle shadow
    },
    inputContainerError: {
        borderColor: theme.colors.error,
    },
    inputContainerMultiline: {
        height: 'auto',
        minHeight: 120,
        alignItems: 'flex-start',
        paddingVertical: theme.spacing.md,
    },
    input: {
        flex: 1,
        fontSize: theme.typography.sizes.base,
        color: theme.colors.textPrimary,
        height: '100%',
    },
    inputMultiline: {
        textAlignVertical: 'top',
    },
    leftIcon: {
        marginRight: theme.spacing.sm,
    },
    rightIcon: {
        marginLeft: theme.spacing.sm,
    },
    errorText: {
        fontSize: theme.typography.sizes.xs,
        color: theme.colors.error,
        marginTop: 4,
        marginLeft: 2,
    }
});

export default Input;
