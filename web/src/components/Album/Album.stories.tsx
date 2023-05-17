// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Album> = (args) => {
//   return <Album {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react';

import Album from './Album';

export const generated = () => {
  return <Album />;
};

export default {
  title: 'Components/Album',
  component: Album,
} as ComponentMeta<typeof Album>;
