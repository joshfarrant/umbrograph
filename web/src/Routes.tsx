// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router';

import ScaffoldLayout from 'src/layouts/ScaffoldLayout';
import { AppLayout } from './layouts/AppLayout';

const Routes = () => {
  return (
    <Router>
      <Set wrap={AppLayout}>
        <Route path="/upload" page={UploadPage} name="upload" />
        <Route path="/album/{albumId}" page={AlbumPage} name="albums" />
      </Set>
      <Route path="/photos" page={PhotosPage} name="photos" />
      <Route notfound page={NotFoundPage} />
    </Router>
  );
};

export default Routes;
