# svg-icons

**svg-icons** is a command-line interface (CLI) tool that allows you to download and store specific SVG icons locally from various icon sets, avoiding the need to import entire libraries and reducing the bundle size.

The icon sets are temporarily stored on the user's system to facilitate future interactions without the need for repeated downloads.

## 📌 Features

- 📦 Downloads only the necessary icons, optimizing bundle size.
- 🚀 Supports most popular icon sets.
- ⚡ Simple and easy to use.

## 📥 Installation

Installation should be done per project, using npm or yarn:

```sh
npm install @raulduartep/svg-icons --save-dev
# or
yarn add @raulduartep/svg-icons --dev
```

After installation, you need to create a svg-icons.config.json file in the root directory of your project with the following content:

```json
{
  "dir": "relative path where the icons will be saved"
}
```

## 🚀 Usage

Simply type the following command in the terminal:

```sh
svg-icons
```

The CLI will ask which icon set you want to use, and then it will request the names of the icons you need.

## 📚 Supported Icon Sets

- [Ant Design Icons](https://github.com/ant-design/ant-design-icons)
- [BoxIcons](https://github.com/atisawd/boxicons)
- [Bootstrap Icons](https://github.com/twbs/icons)
- [Circum Icons](https://circumicons.com/)
- [css.gg](https://github.com/astrit/css.gg)
- [Devicons](https://vorillaz.github.io/devicons/)
- [Feather](https://feathericons.com/)
- [Flat Color Icons](https://github.com/icons8/flat-color-icons)
- [Font Awesome 5](https://fontawesome.com/)
- [Font Awesome 6](https://fontawesome.com/)
- [Grommet-Icons](https://github.com/grommet/grommet-icons)
- [Heroicons](https://github.com/tailwindlabs/heroicons)
- [IcoMoon Free](https://github.com/Keyamoon/IcoMoon-Free)
- [Icons8 Line Awesome](https://icons8.com/line-awesome)
- [Ionicons](https://ionicons.com/)
- [Lucide](https://lucide.dev/)
- [Material Design Icons](http://google.github.io/material-design-icons/)
- [Octicons](https://octicons.github.com/)
- [Phosphor Icons](https://github.com/phosphor-icons/core)
- [Radix Icons](https://icons.radix-ui.com)
- [Remix Icon](https://github.com/Remix-Design/RemixIcon)
- [Simple Icons](https://simpleicons.org/)
- [Simple Line Icons](https://thesabbir.github.io/simple-line-icons/)
- [Tabler Icons](https://github.com/tabler/tabler-icons)
- [Themify Icons](https://github.com/lykmapipo/themify-icons)
- [Typicons](http://s-ings.com/typicons/)
- [VS Code Icons](https://github.com/microsoft/vscode-codicons)
- [Weather Icons](https://erikflowers.github.io/weather-icons/)

## Inspiration

The **svg-icons** project was inspired by the [React Icons](https://github.com/react-icons/react-icons) library.

## 🛠 Contribuição

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 Licença

This project is licensed under the MIT License.
