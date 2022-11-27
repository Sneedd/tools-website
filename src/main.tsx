import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import { PageLoader } from './components/loaders/PageLoader';
import { MenuItem } from './components/menu/MenuItem';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Menu } from './Menu';
import { DefaultLayout } from './components/layouts/DefaultLayout';

function mapToRoute(menu: MenuItem[]): RouteObject[] {
  const flatRoutes = [...menu, ...menu.flatMap(a => a.children)];  
  return flatRoutes.filter(a => a).map(a => { 
      return {
        path: a!.path,
        element: <DefaultLayout>{a!.element}</DefaultLayout>,
      };
  });  
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider 
      router={createBrowserRouter(mapToRoute(Menu))} 
      fallbackElement={<PageLoader/>}
    />
  </React.StrictMode>
)
