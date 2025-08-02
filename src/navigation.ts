import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';
import { SITE } from 'astrowind:config';

export const headerData = {
  links: [
    {
      text: 'Ana Sayfa',
      href: getPermalink('/'),
    },
    {
      text: 'Hakkında',
      href: getPermalink('/hakkinda'),
    },
    {
      text: 'Yemekler',
      href: getBlogPermalink(),
    },
  ],
  actions: [],
};

export const footerData = {
  links: [
    {
      title: 'Menü',
      links: [
        { text: 'Ana Sayfa', href: getPermalink('/') },
        { text: 'Hakkında', href: getPermalink('/hakkinda') },
        { text: 'Yemekler', href: getBlogPermalink() },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: SITE.social,
  footNote: `
    © ${new Date().getFullYear()} Ersin Aynur · Tüm hakları saklıdır.
  `,
};
