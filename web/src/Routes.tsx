// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router';

import { AppLayout } from './layouts/AppLayout';

const Routes = () => {
  return (
    <Router>
      <Set wrap={AppLayout}>
        <Route path="/albums/new" page={NewAlbumPage} name="upload" />
        <Route path="/albums/{albumId}" page={AlbumPage} name="album" />

        <Route path="/identity" page={IdentityPage} name="identity" />
        <Route path="/identity/import" page={ImportIdentityPage} name="importIdentity" />
        <Route path="/identity/generate" page={GenerateIdentityPage} name="generateIdentity" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  );
};

export default Routes;
