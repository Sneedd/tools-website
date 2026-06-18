import { PageFactory } from "../../pages/Page";

export interface MenuItem {

  displayName: string;
  icon: string;
  path: string;
  page: PageFactory;
  children?: MenuItem[];
};
