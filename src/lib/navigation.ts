export const isActivePath = (pathname: string, href: string, exact = false) => {
    if (href === "/" || exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
};
