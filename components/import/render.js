// @ts-ignore
import puppeteer from '../../../../lib/puppeteer/puppeteer.js';
/* Taken from TRSS-Yunzai Renderer:
      sys: {
        scale: 1
      },
      copyright: `Created By TRSS-Yunzai<span class="version">${Version?.yunzai}</span> `,
      _res_path: pluResPath,
      _miao_path: miaoResPath,
      _tpl_path: process.cwd() + "/plugins/miao-plugin/resources/common/tpl/",
      defaultLayout: layoutPath + "default.html",
      elemLayout: layoutPath + "elem.html",

      ...data,

      _plugin: plugin,
      _htmlPath: path,
      pluResPath,
      tplFile: `./plugins/${plugin}/resources/${path}.html`,
      saveId: data.saveId || data.save_id || paths[paths.length - 1]
*/
const Render = {
    async render(name, data) {
        return puppeteer.screenshot(name, data);
    }
};
export default Render;
