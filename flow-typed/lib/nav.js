declare type SidebarItem = {|
  name: string,
  domain: Symbol,
  path: string,
  exact?: boolean,
|};

declare type ParentSidebarItem = {|
  name: string,
  children: SidebarItem[],
|};
