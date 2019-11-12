export declare type SidebarItem = {
    name: string;
    domain?: string;
    path?: string;
    exact?: boolean;
    children?: SidebarItem[];
};
