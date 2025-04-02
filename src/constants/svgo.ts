import { Config } from 'svgo'

export const SVGO_CONFIG: Config = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          convertColors: {
            currentColor: true,
          },
        },
      },
    },
    {
      name: 'convertStyleToAttrs',
    },
    {
      name: 'removeDimensions',
    },
    {
      name: 'removeAttributesBySelector',
      params: {
        selector: '*:not(svg)',
        attributes: ['stroke'],
      },
    },
    {
      name: 'removeAttrs',
      params: { attrs: ['data.*', 'class'] },
    },
    {
      name: 'addAttributesToSVGElement',
      params: {
        attribute: { fill: 'currentColor', stroke: 'currentColor', 'stroke-width': '0', width: '24', height: '24' },
      },
    },
  ],
}
