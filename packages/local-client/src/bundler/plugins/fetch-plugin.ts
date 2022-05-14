import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
  name: 'filecache',
});

// testing localForage module
// (async () => {
//   await fileCache.setItem('color', 'red');

//   const color = await fileCache.getItem('color');

//   console.log(color);
// })();

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      // handle loading index.js entrypoint
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      });

      // if this returns null esbuild will continue on to the next matching filter, while still running the caching logic in here
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        if (cachedResult) {
          return cachedResult;
        }

        return null;
      });

      // handle loading css files
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const escaped = data
          .replace(/\n/g, '') // replace newlines with empty
          .replace(/"/g, '\\"') // replace " with escaped "
          .replace(/'/g, "\\'"); // replace ' with escaped '
        const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
          `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);

        return result;
      });

      // handle loading js files
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
