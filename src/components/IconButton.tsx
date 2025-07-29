import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  View,
} from 'react-native';
import { theme } from '../theme';

interface IconButtonProps extends TouchableOpacityProps {
  icon: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'medium',
  variant = 'primary',
  style,
  ...props
}) => {
  const sizeStyles = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  };
  
  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles[size],
        variantStyles[variant],
        style,
      ]}
      activeOpacity={0.7}
      {...props}
    >
      <View style={styles.iconContainer}>{icon}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  small: {
    width: 40,
    height: 40,
  },
  medium: {
    width: 56,
    height: 56,
  },
  large: {
    width: 80,
    height: 80,
  },
  primary: {
    backgroundColor: theme.colors.accentRed,
  },
  secondary: {
    backgroundColor: theme.colors.charcoal,
  },
});