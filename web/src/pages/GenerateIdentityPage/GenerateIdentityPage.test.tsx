import { render } from '@redwoodjs/testing/web';

import GenerateIdentityPage from './GenerateIdentityPage';

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('GenerateIdentityPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<GenerateIdentityPage />);
    }).not.toThrow();
  });
});
