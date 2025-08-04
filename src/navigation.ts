import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';
import { SITE } from 'astrowind:config';

export const headerData = {
  showToggleTheme: true,
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
      href: getPermalink('/yemekler'),
    },
    {
      text: 'Yorumlarım',
      href: getPermalink('/yorumlarim'),
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
        { text: 'Yemekler', href: getPermalink('/yemekler') },
        { text: 'Yorumlarım', href: getPermalink('/yorumlarim') },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: SITE.social,
  footNote: `
    © ${new Date().getFullYear()} Ersin Aynur · Tüm hakları saklıdır.
  `,
};
