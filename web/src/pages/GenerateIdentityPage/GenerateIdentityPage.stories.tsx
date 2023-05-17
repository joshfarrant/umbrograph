import type { ComponentMeta } from '@storybook/react';

import GenerateIdentityPage from './GenerateIdentityPage';

export const generated = () => {
  return <GenerateIdentityPage />;
};

export default {
  title: 'Pages/GenerateIdentityPage',
  component: GenerateIdentityPage,
} as ComponentMeta<typeof GenerateIdentityPage>;
