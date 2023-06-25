# URL Import Vite Plugin
A Vite plugin to replace all dependencies with URL imports to the specified origin. This plugin allows you to load dependencies from different origins or CDNs by modifying the import statements in your code.

## Installation
You can install the plugin using npm:
```bash
npm install vite-url-import
```
or yarn:
```bash
yarn add vite-url-import
```
or pnpm:
```bash
pnpm add vite-url-import
```


## Configuration

The **UrlImport** function accepts an options object with the following properties:
- **hostname**:  (optional): Specifies the origin or CDN to fetch the dependencies from. this property is a string and defaults to `esm.sh`. 
    - **esm.sh**: Fetches the dependencies from [esm.sh](https://esm.sh/).
    - **cdn.skypack.dev**: Fetches the dependencies from [Skypack](https://www.skypack.dev/).
    - **unpkg.com**: Fetches the dependencies from [unpkg](https://unpkg.com/).
    or any other custom hostname.


## Usage
```js
// vite.config.js
import UrlImport from 'vite-url-import';

export default {
  plugins: [
    UrlImport()
  ]
}
```
If you look in your network tab, you will see that all your dependencies are now being fetched from the specified origin instead of your local machine.

## License
This plugin is licensed under the MIT License.
