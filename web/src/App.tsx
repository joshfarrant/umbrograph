import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web';
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo';

import FatalErrorPage from 'src/pages/FatalErrorPage';
import Routes from 'src/Routes';
import { IdentityProvider } from 'src/contexts/identity';

import './index.css';

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <RedwoodApolloProvider>
        <IdentityProvider>
          <Routes />
        </IdentityProvider>
      </RedwoodApolloProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
);

export default App;
