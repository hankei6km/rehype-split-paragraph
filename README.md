# rehype-split-paragraph

[rehype](https://github.com/rehypejs/rehype) plugin that split `<p>` by `<br>`s / `<img><br>` / `<br><img>`.

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

Split `<p>` by `<br>`s / `<img><br>` / `<br><img>`.
Paragraph is only supported `root / paragraph` hierarchy.

#### options.cleanParagraph

- Trim leading/trailing `<br>` in Paragraph.
- Remove empty Paragraph.

## License

MIT License

Copyright (c) 2021 hankei6km

