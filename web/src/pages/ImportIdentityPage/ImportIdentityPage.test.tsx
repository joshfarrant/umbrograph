import { render } from '@redwoodjs/testing/web';

import ImportIdentityPage from './ImportIdentityPage';

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ImportIdentityPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ImportIdentityPage />);
    }).not.toThrow();
  });
});
