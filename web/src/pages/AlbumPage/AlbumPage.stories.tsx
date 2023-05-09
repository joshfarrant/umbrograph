import type { ComponentMeta } from '@storybook/react';

import AlbumPage from './AlbumPage';

export const generated = () => {
  return <AlbumPage />;
};

export default {
  title: 'Pages/AlbumPage',
  component: AlbumPage,
} as ComponentMeta<typeof AlbumPage>;
