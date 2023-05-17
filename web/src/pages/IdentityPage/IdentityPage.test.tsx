import { render } from '@redwoodjs/testing/web';

import IdentityPage from './IdentityPage';

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('IdentityPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<IdentityPage />);
    }).not.toThrow();
  });
});
