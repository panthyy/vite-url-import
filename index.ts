import { readFileSync } from 'fs';
import type { Plugin } from 'vite';

const getBestMatch = (key: string, deps: Record<string, string>) => {
  return Object.keys(deps).reduce((acc, cur) => {
    if (key.startsWith(cur) && cur.length > acc.length) {
      return cur;
    }
    return acc;
  }, '');
};

type Hostname = string & {
  readonly __hostname: unique symbol;
};

// TODO add include and exclude options to filter which packages to transform using micromatch
type Options = {
  hostname?: 'esm.sh' | 'cdn.skypack.dev' | 'cdn.jsdelivr.net/npm' | 'unpkg.com' | Hostname;
  // include?: string[];
  // exclude?: string[];
};

/**
 * A Vite plugin to replace all dependencies with url imports to the specified origin.
 * hostname defaults to 'esm.sh'
 *
 * Transforms all non-relative imports to url imports.
 *
 * @param options  - origin: 'https://esm.sh' | 'https://cdn.skypack.dev' | 'https://cdn.jsdelivr.net/npm' | 'https://unpkg.com' | Hostname;
 *
 * @returns
 */
export default function UrlImport(options: Options): Plugin {
  const opts = {
    hostname: 'esm.sh',
    ...options,
  };

  const pkg = readFileSync(process.cwd() + '/package.json', 'utf-8');
  const pkgJson = JSON.parse(pkg);

  return {
    name: 'vite-url-import',
    resolveId(id) {
      if (id.startsWith('url:')) {
        return {
          id: id.replace('url:', ''),
          external: true,
        };
      }
    },
    async transform(code, id) {
      if (id.endsWith('.ts') || id.endsWith('.tsx')) {
        let deps: string[] = [];
        return {
          code: code.replace(/from\s+['"]([^'"]+)['"]/g, (_, pkg) => {
            if (pkg.startsWith('.') || pkg.startsWith('/')) {
              return `from '${pkg}'`;
            }

            const dep = getBestMatch(pkg, pkgJson.dependencies);

            deps.push(dep);

            return `from 'url:https://${opts.hostname}/${dep}@${pkgJson.dependencies[dep].replace(
              '^',
              '',
            )}${pkg.replace(dep, '')}'`;
          }),
          external: deps,
        };
      }
    },
  };
}
