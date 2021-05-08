import unified from 'unified';
import rehypeParse from 'rehype-parse';
import stringify from 'rehype-stringify';
import { splitParagraphTransformer } from './split';

describe('splitParagraphTransformer()', () => {
  const f = async (html: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      unified()
        .use(rehypeParse, { fragment: true })
        .use(splitParagraphTransformer)
        .use(stringify)
        .freeze()
        .process(html, (err, file) => {
          if (err) {
            reject(err);
          }
          resolve(String(file));
        });
    });
  };
  it('should split paragraph by br duplicated', async () => {
    expect(await f('<p>test1</p>')).toEqual('<p>test1</p>');
    expect(await f('<p>test2<br>tet3</p>')).toEqual('<p>test2<br>tet3</p>');
    expect(await f('<p>test4<br><br>test5</p>')).toEqual(
      '<p>test4</p><p>test5</p>'
    );
    expect(await f('<p>test6</p><ul><li>test7</li></ul><p>test8</p>')).toEqual(
      '<p>test6</p><ul><li>test7</li></ul><p>test8</p>'
    );
    expect(
      await f(
        '<p>test9<br><br>test10</p><ul><li>test11</li></ul><p>test12<br><br>test13</p>'
      )
    ).toEqual(
      '<p>test9</p><p>test10</p><ul><li>test11</li></ul><p>test12</p><p>test13</p>'
    );
    expect(await f('<p>test14<br><br><br>test15</p>')).toEqual(
      '<p>test14</p><p>test15</p>'
    );
    expect(await f('<p>test16<br>test17<br>test18<br>test19</p>')).toEqual(
      '<p>test16<br>test17<br>test18<br>test19</p>'
    );
  });
  it('should split paragraph by br+img or img+br ', async () => {
    expect(await f('<p>test1<img src="image1">test2</p>')).toEqual(
      '<p>test1<img src="image1">test2</p>'
    );
    expect(await f('<p>test3<br><img src="image2">test4</p>')).toEqual(
      '<p>test3<br></p><p><img src="image2">test4</p>'
    );
    expect(await f('<p>test5<img src="image3"><br>test6</p>')).toEqual(
      '<p>test5<img src="image3"></p><p><br>test6</p>'
    );
    expect(await f('<p>test7<br><img src="image4"><br>test8</p>')).toEqual(
      '<p>test7<br></p><p><img src="image4"></p><p><br>test8</p>'
    );
  });
});
