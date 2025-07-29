export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  
  borderRadius: {
    sm: 10,
    md: 12,
    lg: 16,
    xl: 20,
  },
  
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
  
  animation: {
    duration: {
      fast: 150,
      normal: 200,
      slow: 350,
    },
  },
  
  layout: {
    bottomTabHeight: 72,
    buttonHeight: 52,
  },
};