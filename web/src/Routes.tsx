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
      </Set>
      <Set wrap={ScaffoldLayout} title="Files" titleTo="files" buttonLabel="New File" buttonTo="newFile">
        <Route path="/files/new" page={FileNewFilePage} name="newFile" />
        <Route path="/files/{id}/edit" page={FileEditFilePage} name="editFile" />
        <Route path="/files/{id}" page={FileFilePage} name="file" />
        <Route path="/files" page={FileFilesPage} name="files" />
      </Set>
      <Route path="/photos" page={PhotosPage} name="photos" />
      <Route notfound page={NotFoundPage} />
    </Router>
  );
};

export default Routes;
