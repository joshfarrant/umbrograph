import { render } from '@redwoodjs/testing/web';

import NewAlbumPage from './NewAlbumPage';

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('NewAlbumPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewAlbumPage />);
    }).not.toThrow();
  });
});
