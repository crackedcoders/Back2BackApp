import { TextStyle } from 'react-native';

export const typography = {
  fontFamily: {
    poppins: {
      regular: 'Poppins-Regular',
      medium: 'Poppins-Medium',
      semiBold: 'Poppins-SemiBold',
      bold: 'Poppins-Bold',
    },
    inter: {
      regular: 'Inter-Regular',
      medium: 'Inter-Medium',
      semiBold: 'Inter-SemiBold',
      bold: 'Inter-Bold',
    },
  },
  
  heading: {
    h1: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 32,
      lineHeight: 40,
      letterSpacing: 0.5,
    } as TextStyle,
    h2: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: 0.5,
    } as TextStyle,
    h3: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: 0.5,
    } as TextStyle,
    h4: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.5,
    } as TextStyle,
  },
  
  body: {
    regular: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      lineHeight: 22.4, // 1.4em
    } as TextStyle,
    medium: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      lineHeight: 22.4,
    } as TextStyle,
    small: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      lineHeight: 19.6,
    } as TextStyle,
  },
  
  caption: {
    regular: {
      fontFamily: 'Inter-Medium',
      fontSize: 12,
      lineHeight: 16,
    } as TextStyle,
    small: {
      fontFamily: 'Inter-Medium',
      fontSize: 10,
      lineHeight: 14,
    } as TextStyle,
  },
};