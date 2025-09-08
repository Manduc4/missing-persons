import { createTheme as createMuiTheme } from '@mui/material';
import { createPalette } from './create-palette';
import { createComponents } from './create-components';
import { createShadows } from './create-shadows';
import { createTypography } from './create-typography';

export function createTheme() {
  const palette = createPalette();
  const components = createComponents({ palette });
  const shadows = createShadows();
  const typography = createTypography();

  return createMuiTheme({
    breakpoints: {
      values: {
        xs: 300,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1440,
      },
    },
    // @ts-ignore
    components,
    // @ts-ignore
    palette,
    // @ts-ignore
    shadows,
    // @ts-ignore
    typography,
    shape: {
      borderRadius: 0,
    },
  });
}
