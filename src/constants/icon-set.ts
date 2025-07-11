import { kebabCase } from 'change-case'
import fg from 'fast-glob'
import path from 'node:path'

import { TIconSet } from '../utils/types.js'

export const ICON_SETS: TIconSet[] = [
  {
    id: 'ci',
    name: 'Circum Icons',
    projectUrl: 'https://circumicons.com/',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*.svg')),
        name: async name => name.replace(/_/g, '').replace(/&/g, '-and-'),
      },
    ],
    source: {
      type: 'git',
      remoteDir: 'svg/',
      url: 'https://github.com/Klarr-Agency/Circum-Icons.git',
      branch: 'main',
    },
  },
  {
    id: 'fa',
    name: 'Font Awesome 5',
    projectUrl: 'https://fontawesome.com/',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './+(brands|solid)/*.svg')),
        name: async name => name,
      },
      {
        files: dirPath => fg(path.join(dirPath, './regular/*.svg')),
        name: async name => `regular-${name}`,
      },
    ],
    source: {
      type: 'git',
      remoteDir: 'svgs/',
      url: 'https://github.com/FortAwesome/Font-Awesome.git',
      branch: '5.x',
    },
  },
  {
    id: 'fa6',
    name: 'Font Awesome 6',
    projectUrl: 'https://fontawesome.com/',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './+(brands|solid)/*.svg')),
        name: async name => name,
      },
      {
        files: dirPath => fg(path.join(dirPath, './regular/*.svg')),
        name: async name => `regular-${name}`,
      },
    ],
    source: {
      type: 'git',
      remoteDir: 'svgs/',
      url: 'https://github.com/FortAwesome/Font-Awesome.git',
      branch: '6.x',
    },
  },
  {
    id: 'io',
    name: 'Ionicons',
    projectUrl: 'https://ionicons.com/',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*.svg')),
        name: async name => name,
      },
    ],
    source: {
      type: 'git',
      url: 'https://github.com/ionic-team/ionicons.git',
      branch: 'main',
      remoteDir: 'src/svg/',
    },
  },
  {
    id: 'md',
    name: 'Material Design icons',
    projectUrl: 'http://google.github.io/material-design-icons/',
    resolvers: [
      {
        files: async dirPath => {
          const normal = await fg(path.resolve(dirPath, './*/*/materialicons/24px.svg'))

          const twotone = await fg(path.resolve(dirPath, './*/*/materialiconstwotone/24px.svg'))

          return [...normal, ...twotone.filter(file => !normal.includes(file.replace('twotone/', '/')))]
        },
        name: async (_name, file) => `${kebabCase(file.replace(/^.*\/([^/]+)\/materialicons[^/]*\/24px.svg$/i, '$1'))}`,
      },
      {
        files: async dirPath => await fg(path.resolve(dirPath, './*/*/materialiconsoutlined/24px.svg')),
        name: async (_name, file) =>
          `outline-${kebabCase(file.replace(/^.*\/([^/]+)\/materialicons[^/]*\/24px.svg$/i, '$1'))}`,
      },
    ],
    source: {
      type: 'git',
      remoteDir: 'src/',
      url: 'https://github.com/google/material-design-icons.git',
      branch: 'master',
    },
  },
  {
    id: 'ti',
    name: 'Typicons',
    projectUrl: 'http://s-ings.com/typicons/',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*.svg')),
        name: async name => name,
      },
    ],
    source: {
      type: 'git',
      remoteDir: 'src/svg/',
      url: 'https://github.com/stephenhutchings/typicons.font.git',
      branch: 'master',
    },
  },
  {
    id: 'go',
    name: 'Octicons icons',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*-24.svg')),
        name: async name => name.replace('24', ''),
      },
    ],
    projectUrl: 'https://octicons.github.com/',
    source: {
      type: 'git',
      remoteDir: 'icons/',
      url: 'https://github.com/primer/octicons.git',
      branch: 'main',
    },
  },
  {
    id: 'fi',
    name: 'Feather',
    projectUrl: 'https://feathericons.com/',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*.svg')),
        name: async name => name,
      },
    ],
    source: {
      type: 'git',
      remoteDir: 'icons/',
      url: 'https://github.com/feathericons/feather.git',
      branch: 'main',
    },
  },
  {
    id: 'lu',
    name: 'Lucide',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*.svg')),
        name: async name => name,
      },
    ],
    projectUrl: 'https://lucide.dev/',
    source: {
      type: 'git',
      remoteDir: 'icons/',
      url: 'https://github.com/lucide-icons/lucide.git',
      branch: 'main',
    },
  },
  {
    id: 'wi',
    name: 'Weather Icons',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*.svg')),
        name: async name => name.replace(/^wi-/, ''),
      },
    ],
    projectUrl: 'https://erikflowers.github.io/weather-icons/',
    source: {
      type: 'git',
      remoteDir: 'svg/',
      url: 'https://github.com/erikflowers/weather-icons.git',
      branch: 'master',
    },
  },
  {
    id: 'di',
    name: 'Devicons',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*.svg')),
        name: async name => name,
      },
    ],
    projectUrl: 'https://vorillaz.github.io/devicons/',
    source: {
      type: 'git',
      remoteDir: '!SVG/',
      url: 'https://github.com/vorillaz/devicons.git',
      branch: 'master',
    },
  },
  {
    id: 'ai',
    name: 'Ant Design Icons',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './filled/*.svg')),
        name: async name => `fill-${name}`,
      },
      {
        files: dirPath => fg(path.join(dirPath, './outlined/*.svg')),
        name: async name => `outline-${name}`,
      },
      {
        files: dirPath => fg(path.join(dirPath, './twotone/*.svg')),
        name: async name => `twotone-${name}`,
      },
    ],
    projectUrl: 'https://github.com/ant-design/ant-design-icons',
    source: {
      type: 'git',
      remoteDir: 'packages/icons-svg/svg/',
      url: 'https://github.com/ant-design/ant-design-icons.git',
      branch: 'master',
    },
  },
  {
    id: 'bs',
    name: 'Bootstrap Icons',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*!(-reverse)-fill.svg')),
        name: async name => `fill-${name}`,
      },
      {
        files: dirPath => fg(path.join(dirPath, './*-reverse!(-fill).svg')),
        name: async name => `reverse-${name}`,
      },
      {
        files: dirPath => fg(path.join(dirPath, './*!(-fill|-reverse|reverse-).svg')),
        name: async name => name,
      },
    ],
    projectUrl: 'https://github.com/twbs/icons',
    source: {
      type: 'git',
      remoteDir: 'icons/',
      url: 'https://github.com/twbs/icons.git',
      branch: 'main',
    },
  },
  {
    id: 'ri',
    name: 'Remix Icon',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*/*.svg')),
        name: async name => name,
      },
    ],
    projectUrl: 'https://github.com/Remix-Design/RemixIcon',
    source: {
      type: 'git',
      remoteDir: 'icons/',
      url: 'https://github.com/Remix-Design/RemixIcon.git',
      branch: 'master',
    },
  },
  {
    id: 'fc',
    name: 'Flat Color Icons',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*.svg')),
        name: async name => name,
      },
    ],
    projectUrl: 'https://github.com/icons8/flat-color-icons',
    source: {
      type: 'git',
      remoteDir: 'svg/',
      url: 'https://github.com/icons8/flat-color-icons.git',
      branch: 'master',
    },
  },
  {
    id: 'gr',
    name: 'Grommet-Icons',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*.svg')),
        name: async name => name,
      },
    ],
    projectUrl: 'https://github.com/grommet/grommet-icons',
    source: {
      type: 'git',
      remoteDir: 'public/img/',
      url: 'https://github.com/grommet/grommet-icons.git',
      branch: 'master',
    },
  },
  {
    id: 'hi',
    name: 'Heroicons',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './24/solid/*.svg')),
        name: async name => name,
      },
      {
        files: dirPath => fg(path.join(dirPath, './24/outline/*.svg')),
        name: async name => `outline-${name}`,
      },
    ],
    projectUrl: 'https://github.com/tailwindlabs/heroicons',
    source: {
      type: 'git',
      remoteDir: 'optimized/',
      url: 'https://github.com/tailwindlabs/heroicons.git',
      branch: 'master',
    },
  },
  {
    id: 'si',
    name: 'Simple Icons',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*.svg')),
        name: async name => name,
      },
    ],
    projectUrl: 'https://simpleicons.org/',
    source: {
      type: 'git',
      remoteDir: 'icons/',
      url: 'https://github.com/simple-icons/simple-icons.git',
      branch: 'develop',
    },
  },
  {
    id: 'sl',
    name: 'Simple Line Icons',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*.svg')),
        name: async name => name,
      },
    ],
    projectUrl: 'https://thesabbir.github.io/simple-line-icons/',

    source: {
      type: 'git',
      remoteDir: 'src/svgs/',
      url: 'https://github.com/thesabbir/simple-line-icons.git',
      branch: 'master',
    },
  },
  {
    id: 'im',
    name: 'IcoMoon Free',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*.svg')),
        name: async name => name.slice(3),
      },
    ],
    projectUrl: 'https://github.com/Keyamoon/IcoMoon-Free',
    source: {
      type: 'git',
      remoteDir: 'SVG/',
      url: 'https://github.com/Keyamoon/IcoMoon-Free.git',
      branch: 'master',
    },
  },
  {
    id: 'bi',
    name: 'BoxIcons',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './regular/*.svg')),
        name: async name => name.replace('Bx', ''),
      },
      {
        files: dirPath => fg(path.join(dirPath, './solid/*.svg')),
        name: async name => `solid-${name.replace('Bxs', '')}`,
      },
      {
        files: dirPath => fg(path.join(dirPath, './logos/*.svg')),
        name: async name => `logo-${name.replace('Bxl', '')}`,
      },
    ],
    projectUrl: 'https://github.com/atisawd/boxicons',
    source: {
      type: 'git',
      remoteDir: 'svg/',
      url: 'https://github.com/atisawd/boxicons.git',
      branch: 'master',
    },
  },
  {
    id: 'cg',
    name: 'css.gg',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*.svg')),
        name: async name => name,
      },
    ],
    projectUrl: 'https://github.com/astrit/css.gg',
    source: {
      type: 'git',
      remoteDir: 'icons/svg/',
      url: 'https://github.com/astrit/css.gg.git',
      branch: 'main',
    },
  },
  {
    id: 'vsc',
    name: 'VS Code Icons',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*.svg')),
        name: async name => name,
      },
    ],
    projectUrl: 'https://github.com/microsoft/vscode-codicons',
    source: {
      type: 'git',
      remoteDir: 'src/icons/',
      url: 'https://github.com/microsoft/vscode-codicons.git',
      branch: 'main',
    },
  },
  {
    id: 'tb',
    name: 'Tabler Icons',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './filled/*.svg')),
        name: async name => `filled-${name}`,
      },
      {
        files: dirPath => fg(path.join(dirPath, './outline/*.svg')),
        name: async name => name,
      },
    ],
    projectUrl: 'https://github.com/tabler/tabler-icons',
    source: {
      type: 'git',
      remoteDir: 'icons/',
      url: 'https://github.com/tabler/tabler-icons.git',
      branch: 'main',
    },
  },
  {
    id: 'tfi',
    name: 'Themify Icons',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*.svg')),
        name: async name => name,
      },
    ],
    projectUrl: 'https://github.com/lykmapipo/themify-icons',
    source: {
      type: 'git',
      remoteDir: 'SVG/',
      url: 'https://github.com/lykmapipo/themify-icons.git',
      branch: 'master',
    },
  },
  {
    id: 'rx',
    name: 'Radix Icons',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*.svg')),
        name: async name => name,
      },
    ],
    projectUrl: 'https://icons.radix-ui.com',
    source: {
      type: 'git',
      remoteDir: 'packages/radix-icons/icons/',
      url: 'https://github.com/radix-ui/icons.git',
      branch: 'master',
    },
  },
  {
    id: 'pi',
    name: 'Phosphor Icons',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*/*.svg')),
        name: async name => name,
      },
    ],
    projectUrl: 'https://github.com/phosphor-icons/core',
    source: {
      type: 'git',
      remoteDir: 'assets/',
      url: 'https://github.com/phosphor-icons/core.git',
      branch: 'main',
    },
  },
  {
    id: 'lia',
    name: 'Icons8 Line Awesome',
    resolvers: [
      {
        files: dirPath => fg(path.join(dirPath, './*.svg')),
        name: async name => name,
      },
    ],
    projectUrl: 'https://icons8.com/line-awesome',
    source: {
      type: 'git',
      remoteDir: 'svg/',
      url: 'https://github.com/icons8/line-awesome.git',
      branch: 'master',
    },
  },
]

export const SORTED_ICON_SETS = ICON_SETS.sort((a, b) => a.name.localeCompare(b.name))
