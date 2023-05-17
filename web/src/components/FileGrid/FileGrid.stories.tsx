// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof FileGrid> = (args) => {
//   return <FileGrid {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react';

import FileGrid from './FileGrid';

export const generated = () => {
  return <FileGrid />;
};

export default {
  title: 'Components/FileGrid',
  component: FileGrid,
} as ComponentMeta<typeof FileGrid>;
