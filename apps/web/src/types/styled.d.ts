import 'styled-components';
import { Theme } from '@moto-e-cia/shared';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
