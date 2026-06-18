import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';
import { Menu } from './Menu';
import { Router } from './router/Router';
import { Navigation } from './components/navigation/Navigation';
import { MenuItem } from './components/menu/MenuItem';

function flatten(menu: MenuItem[]): MenuItem[] {
  return [...menu, ...menu.flatMap(m => m.children ?? [])];
}

const pageContainer = document.getElementById('page-container') as HTMLElement;
const navContainer = document.getElementById('nav-container') as HTMLElement;

const router = new Router(pageContainer);
router.addRoutes(flatten(Menu).map(m => ({ path: m.path, factory: m.page })));

new Navigation(navContainer, Menu, router).render();

router.start();
