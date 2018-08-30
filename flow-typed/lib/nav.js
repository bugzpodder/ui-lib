declare type SidebarItem = {|
  name: string,
  domain: string,
  path: string,
  exact?: boolean,
|};

declare type ParentSidebarItem = {|
  name: string,
  children: SidebarItem[],
|};
