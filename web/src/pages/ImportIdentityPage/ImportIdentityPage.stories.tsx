import type { ComponentMeta } from '@storybook/react';

import ImportIdentityPage from './ImportIdentityPage';

export const generated = () => {
  return <ImportIdentityPage />;
};

export default {
  title: 'Pages/ImportIdentityPage',
  component: ImportIdentityPage,
} as ComponentMeta<typeof ImportIdentityPage>;
