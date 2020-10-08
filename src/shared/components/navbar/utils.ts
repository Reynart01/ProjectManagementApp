interface Link {
  children: string;
  to: string;
}

export const BASE_LINKS: Link[] = [
  { children: 'Home', to: '/' },
  { children: 'About', to: '/about' }
];

export const IMPORTANT_LINKS: Link[] = [
  { children: 'App', to: '/app' }
];
