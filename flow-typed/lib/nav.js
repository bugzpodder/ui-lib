declare type SidebarItemChild = SidebarItemLink | SidebarItemPlaceholder;
declare type SidebarItem = SidebarItemParent | SidebarItemChild;

declare type SidebarItemLink = {|
  name: string,
  domain: string,
  path: string,
  exact?: boolean,
|};

declare type SidebarItemPlaceholder = {|
  name: string,
  placeholder: true,
|};

declare type SidebarItemParent = {|
  name: string,
  children: SidebarItemChild[],
|};
