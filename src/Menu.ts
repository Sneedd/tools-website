import { createHomePage } from "./pages/HomePage";
import {
  createMd5Page,
  createSha1Page,
  createSha224Page,
  createSha256Page,
  createSha384Page,
  createSha512Page,
  createSha3Page,
} from "./pages/HashSinglePage";
import { createPasswordPronounceablePage } from "./pages/PasswordPronounceablePage";
import { createUniqueRandomPage } from "./pages/UniqueRandomPage";
import { createUuidV1Page, createUuidV4Page } from "./pages/UniqueUuidCreatePage";
import { createUuidAnalysePage } from "./pages/UniqueUuidAnalysePage";
import { MenuItem } from "./components/menu/MenuItem";


export const Menu: MenuItem[] = [
  {
    displayName: "Start",
    icon: "bi-house-fill",
    path: "/",
    page: createHomePage,
  },

  {
    displayName: "Hash Functions",
    icon: "bi-hash",
    path: "/hash",
    page: createMd5Page,
    children: [
      {
        displayName: "MD5",
        icon: "bi-hash",
        path: "/hash/md5",
        page: createMd5Page
      },
      {
        displayName: "SHA-1",
        icon: "bi-hash",
        path: "/hash/sha1",
        page: createSha1Page
      },
      {
        displayName: "SHA-224",
        icon: "bi-hash",
        path: "/hash/sha224",
        page: createSha224Page
      },
      {
        displayName: "SHA-256",
        icon: "bi-hash",
        path: "/hash/sha256",
        page: createSha256Page
      },
      {
        displayName: "SHA-384",
        icon: "bi-hash",
        path: "/hash/sha384",
        page: createSha384Page
      },
      {
        displayName: "SHA-512",
        icon: "bi-hash",
        path: "/hash/sha512",
        page: createSha512Page
      },
      {
        displayName: "SHA-3",
        icon: "bi-hash",
        path: "/hash/sha3",
        page: createSha3Page
      },
    ]
  },

  {
    displayName: "Password",
    icon: "bi-key-fill",
    path: "/password",
    page: createPasswordPronounceablePage,
    children: [
      {
        displayName: "Pronounceable",
        icon: "bi-key-fill",
        path: "/password/pronounceable",
        page: createPasswordPronounceablePage
      },
    ]
  },

  {
    displayName: "Unique Values",
    icon: "bi-dice-5",
    path: "/unique",
    page: createUniqueRandomPage,
    children: [
      {
        displayName: "Random",
        icon: "bi-dice-1",
        path: "/unique/random",
        page: createUniqueRandomPage
      },
      {
        displayName: "UUID v1",
        icon: "bi-dice-2",
        path: "/unique/uuid/v1",
        page: createUuidV1Page
      },
      {
        displayName: "UUID v4",
        icon: "bi-dice-3",
        path: "/unique/uuid/v4",
        page: createUuidV4Page
      },
      {
        displayName: "UUID Analyser",
        icon: "bi-search",
        path: "/unique/uuid/analyse",
        page: createUuidAnalysePage
      },
    ]
  },

  // {
  //   displayName: "DateTime"
  //   path: "/datetime",
  //   icon: "bi-calendar",
  //   page: createMd5Page,
  //   children: [
  //     {
  //       displayName: "Day of Year",
  //     }
  //   ]
  // },

  // TODO Ascii Table printable
];
