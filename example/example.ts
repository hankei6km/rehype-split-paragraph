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
