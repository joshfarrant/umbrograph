import { render } from '@redwoodjs/testing/web';

import FileGrid from './FileGrid';

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('FileGrid', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<FileGrid />);
    }).not.toThrow();
  });
});
