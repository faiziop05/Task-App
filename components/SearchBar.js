import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Animated } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../theme';

const SearchBar = ({ value, onChangeText, placeholder = 'Search tasks...' }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, isFocused && styles.containerFocused]}>
            <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} />
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textDisabled}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            {value ? (
                <TouchableOpacity onPress={() => onChangeText('')}>
                    <MaterialIcons name="close" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.gray100,
        borderRadius: theme.radius.lg,
        paddingHorizontal: theme.spacing.base,
        height: 48,
        borderWidth: 2,
        borderColor: 'transparent',
        gap: theme.spacing.sm,
    },
    containerFocused: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.white,
        ...theme.shadows.sm,
    },
    input: {
        flex: 1,
        fontSize: theme.typography.sizes.base,
        color: theme.colors.textPrimary,
    },
});

export default SearchBar;
