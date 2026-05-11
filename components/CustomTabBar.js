
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { theme } from '../theme';

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 12) - 12 }]}>
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const getIcon = () => {
                        const color = isFocused ? theme.colors.primary : theme.colors.textTertiary;
                        const iconSize = 24;

                        switch (route.name) {
                            case 'Home':
                                return <MaterialIcons name="dashboard" size={iconSize} color={color} />;
                            case 'AllTasks':
                                return <FontAwesome5 name="tasks" size={20} color={color} />;
                            case 'Add':
                                return <MaterialIcons name="add" size={32} color="#fff" />;
                            case 'Settings':
                                return <MaterialIcons name="settings" size={iconSize} color={color} />;
                            default:
                                return <MaterialIcons name="circle" size={iconSize} color={color} />;
                        }
                    };

                    if (route.name === 'Add') {
                        return (
                            <View key={index} style={styles.addButtonWrapper}>
                                <TouchableOpacity
                                    onPress={onPress}
                                    style={styles.addButton}
                                    activeOpacity={0.9}
                                >
                                    {getIcon()}
                                </TouchableOpacity>
                            </View>
                        );
                    }

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={onPress}
                            style={styles.tab}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconContainer, isFocused && styles.iconActive]}>
                                {getIcon()}
                            </View>
                            {isFocused && ( // Only show dot for active tab to keep it minimal
                                <View style={styles.activeDot} />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 24,
        left: 20,
        right: 20,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 12,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...theme.shadows.lg, // Deep shadow for floating effect
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.primary,
        marginTop: 4,
    },
    addButtonWrapper: {
        top: -24, // Lift it up
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.lg,
        shadowColor: theme.colors.primary, // Colored shadow
        shadowOpacity: 0.4,
        borderWidth: 4,
        borderColor: theme.colors.background, // Match background to create "cutout" effect
    },
});

export default CustomTabBar;
