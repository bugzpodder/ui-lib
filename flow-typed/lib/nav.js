declare type SidebarItemChild = SidebarItemLink;
declare type SidebarItem = SidebarItemParent | SidebarItemChild;

declare type SidebarItemLink = {|
  name: string,
  domain: string,
  path: string,
  exact?: boolean,
|};

declare type SidebarItemParent = {|
  name: string,
  children: SidebarItemChild[],
|};
