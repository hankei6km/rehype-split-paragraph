# rehype-split-paragraph

<p>` を `<br>` の連続 / `<img><br>` / `<br><img>` で分割する [rehype](https://github.com/rehypejs/rehype のプラグイン。

## Install

npm:

```
npm install rehype-split-paragraph
```

## Usage

code: `example/example.ts`

```typescript
import unified from 'unified';
import rehypeParse from 'rehype-parse';
import stringify from 'rehype-stringify';
import rehypeSplitParagraph from '../src';

const html =
  '<p>foo<br><br>bar</p><p>foo<br><img src="/path/to/image.jpg"><br>bar</p>';
unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSplitParagraph)
  .use(stringify)
  .freeze()
  .process(html, (err, file) => {
    if (err) {
      console.error(err);
    }
    console.log(String(file));
  });
```

yield:

```html
<p>foo</p><p>bar</p><p>foo</p><p><img src="/path/to/image.jpg"></p><p>bar</p>
```

## API

### `rehypeSplitParagraph([options])`

<p>` を `<br>` の連続 / `<img><br>` / `<br><img>` で分割する。
Paragraph は `root / paragraph` 階層のみサポートしている.

#### options.cleanParagraph

- Paragraph 内の先頭と末尾の `<br>` を取り除く
- 空の Paragraph を削除する

## License

MIT License

Copyright (c) 2021 hankei6km

