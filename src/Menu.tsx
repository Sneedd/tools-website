import { HashingShaPage } from "./pages/HashingShaPage";
import { HashingMd5Page } from "./pages/HashingMd5Page";
import { HomePage } from "./pages/HomePage";
import { MenuItem } from "./components/menu/MenuItem";
import { Icon } from "./components/icon/Icon";
import { UniqueRandomPage } from "./pages/UniqueRandomPage";
import { UniqueUuidPage } from "./pages/UniqueUuidPage";


export const Menu: MenuItem[] = [
  {
    displayName: "Start",
    icon: <Icon iconName="HouseFill" />,
    path: "/",
    element: <HomePage />,
  },

  {
    displayName: "Hash Functions",
    icon: <Icon iconName="Hash" />,
    path: "/hash",
    element: <HashingShaPage />,
    children: [
      {
        displayName: "SHA 256/512",
        icon: <Icon iconName="Hash" />,
        path: "/hash/sha",
        element: <HashingShaPage />
      },
      {
        displayName: "MD5",
        icon: <Icon iconName="Hash" />,
        path: "/hash/md5",
        element: <HashingMd5Page />
      },
    ]
  },

  {
    displayName: "Unique Values",
    icon: <Icon iconName="Dice5"/>,
    path: "/unique",
    element: <HashingMd5Page />,
    children: [
      {
        displayName: "Random",
        icon: <Icon iconName="Dice1" />,
        path: "/unique/random",
        element: <UniqueRandomPage />
      },
      {
        displayName: "UUID",
        icon: <Icon iconName="Dice2" />,
        path: "/unique/uuid",
        element: <UniqueUuidPage />
      },
    ]
  },
  
  // {
  //   displayName: "DateTime"
  //   path: "/datetime",
  //   icon: <Icon iconName="Calendar" />,
  //   element: <HashingMd5Page />,
  //   children: [
  //     {
  //       displayName: "Day of Year",
  //     }
  //   ]
  // },

  // TODO Ascii Table printable
];