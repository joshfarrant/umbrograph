import { NavBar } from 'src/components/NavBar';
import { AppLayoutProps } from './AppLayout.types';

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex min-h-[100vh] flex-col flex-nowrap">
      <NavBar />
      <div className="flex-1 bg-gray-100">{children}</div>
    </div>
  );
};
