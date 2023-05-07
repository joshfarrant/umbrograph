import type { ComponentMeta } from '@storybook/react';

import UploadPage from './UploadPage';

export const generated = () => {
  return <UploadPage />;
};

export default {
  title: 'Pages/UploadPage',
  component: UploadPage,
} as ComponentMeta<typeof UploadPage>;
