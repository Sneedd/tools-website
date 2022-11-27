import { ReactNode } from "react"

export interface MenuItem {
  
  displayName: string;
  icon: ReactNode;
  path: string;
  element: ReactNode;
  children?: MenuItem[];  
};
