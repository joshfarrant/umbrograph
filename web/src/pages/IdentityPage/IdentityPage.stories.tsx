import type { ComponentMeta } from '@storybook/react';

import IdentityPage from './IdentityPage';

export const generated = () => {
  return <IdentityPage />;
};

export default {
  title: 'Pages/IdentityPage',
  component: IdentityPage,
} as ComponentMeta<typeof IdentityPage>;
