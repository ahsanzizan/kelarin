/** biome-ignore-all lint/suspicious/noTemplateCurlyInString: <> */
import type { Configuration } from 'electron-builder'

import {
  author as _author,
  description,
  displayName,
  name,
  resources,
  version,
} from './package.json'

const author = _author?.name ?? _author
const currentYear = new Date().getFullYear()
const authorInKebabCase = author.replace(/\s+/g, '-')
const appId = `com.${authorInKebabCase}.${name}`.toLowerCase()

const artifactName = [`${name}-v${version}`, '-${os}.${ext}'].join('')

export default {
  appId,
  productName: displayName,
  copyright: `Copyright © ${currentYear} — ${author}`,

  mac: {
    artifactName,
    icon: `${resources}/build/icons/icon.icns`,
    category: 'public.app-category.utilities',
    target: ['zip', 'dmg', 'dir'],
  },

  linux: {
    artifactName,
    category: 'Utilities',
    synopsis: description,
    target: ['AppImage', 'deb', 'pacman', 'freebsd', 'rpm'],
  },

  win: {
    artifactName,
    icon: `${resources}/build/icons/icon.ico`,
    target: ['zip', 'portable'],
  },

  extraResources: [
    {
      from: 'drizzle',
      to: 'drizzle',
    },
  ],
} satisfies Configuration
