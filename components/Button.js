
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { theme } from '../theme';

const Button = ({
    title,
    onPress,
    variant = 'primary', // primary, secondary, outline, ghost
    size = 'base', // sm, base, lg
    disabled = false,
    loading = false,
    style,
    textStyle,
    icon
}) => {

    const getBackgroundColor = () => {
        if (disabled && variant !== 'ghost') return theme.colors.gray300;
        switch (variant) {
            case 'primary': return theme.colors.primary;
            case 'secondary': return theme.colors.primarySoft;
            case 'outline': return 'transparent';
            case 'ghost': return 'transparent';
            default: return theme.colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return theme.colors.gray500;
        switch (variant) {
            case 'primary': return theme.colors.textInverse;
            case 'secondary': return theme.colors.primaryDark;
            case 'outline': return theme.colors.primary;
            case 'ghost': return theme.colors.primary;
            default: return theme.colors.textInverse;
        }
    };

    const getBorderStyles = () => {
        if (variant === 'outline' && !disabled) {
            return {
                borderWidth: 1.5,
                borderColor: theme.colors.primary
            };
        }
        return {};
    };

    const getHeight = () => {
        switch (size) {
            case 'sm': return 36;
            case 'lg': return 56;
            default: return 48;
        }
    };

    const getFontSize = () => {
        switch (size) {
            case 'sm': return theme.typography.sizes.sm;
            case 'lg': return theme.typography.sizes.lg;
            default: return theme.typography.sizes.base;
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    height: getHeight(),
                    ...getBorderStyles()
                },
                style
            ]}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {icon}
                    <Text style={[
                        styles.text,
                        {
                            color: getTextColor(),
                            fontSize: getFontSize(),
                            marginLeft: icon ? 8 : 0
                        },
                        textStyle
                    ]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radius.base,
        paddingHorizontal: theme.spacing.lg,
        // ...theme.shadows.sm, // Soft shadow for depth
    },
    text: {
        fontWeight: theme.typography.weights.semibold,
        letterSpacing: 0.5,
    }
});

export default Button;
