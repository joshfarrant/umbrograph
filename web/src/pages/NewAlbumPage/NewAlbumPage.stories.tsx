import type { ComponentMeta } from '@storybook/react';

import NewAlbumPage from './NewAlbumPage';

export const generated = () => {
  return <NewAlbumPage />;
};

export default {
  title: 'Pages/NewAlbumPage',
  component: NewAlbumPage,
} as ComponentMeta<typeof NewAlbumPage>;
