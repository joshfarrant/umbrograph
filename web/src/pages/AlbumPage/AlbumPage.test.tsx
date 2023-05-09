import { render } from '@redwoodjs/testing/web';

import AlbumPage from './AlbumPage';

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AlbumPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AlbumPage />);
    }).not.toThrow();
  });
});
