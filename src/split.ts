import { Plugin, Transformer } from 'unified';
import { Node, Root } from 'hast';
import {
  hastTrimBr,
  hastRemoveEmptyParagraph
} from 'rehype-remove-empty-paragraph';

export type RehypeSplitParagraphOptions = {
  cleanParagraph?: boolean;
};

export function hastSplitParagraphByBr(tree: Root): void {
  const children: Root['children'] = [];
  tree.children.forEach((c) => {
    if (c.type === 'element' && c.tagName === 'p') {
      let pool: Root['children'] = [];
      let brCnt = 0;
      c.children.forEach((cc, i) => {
        if (cc.type === 'element' && cc.tagName === 'br') {
          brCnt++;
        } else {
          if (brCnt === 0) {
            pool.push(cc);
          } else if (brCnt === 1) {
            pool.push(c.children[i - 1]);
            pool.push(cc);
            brCnt = 0;
          } else {
            children.push({ ...c, children: pool } as Root['children'][0]);
            pool = [];
            pool.push(cc);
            brCnt = 0;
          }
        }
      });
      children.push({ ...c, children: pool } as Root['children'][0]);
    } else {
      children.push(c);
    }
  });
  tree.children = children;
}

export function hastSplitParagraphByImgAndBr(tree: Root): void {
  const children: Root['children'] = [];
  tree.children.forEach((c) => {
    if (
      c.type === 'element' &&
      c.tagName === 'p' &&
      Array.isArray(c.children)
    ) {
      let pool: Root['children'] = [];
      c.children.forEach((cc, i) => {
        if (
          cc.type === 'element' &&
          cc.tagName === 'img' &&
          Array.isArray(c.children)
        ) {
          if (
            c.children[i - 1] &&
            c.children[i - 1].type === 'element' &&
            c.children[i - 1].tagName === 'br'
          ) {
            children.push({ ...c, children: pool } as Root['children'][0]); // <br> が残るが他の transformer で除去している
            pool = [];
            pool.push(cc);
          } else {
            pool.push(cc);
          }
        } else if (
          cc.type === 'element' &&
          cc.tagName === 'br' &&
          Array.isArray(c.children)
        ) {
          if (
            c.children[i - 1] &&
            c.children[i - 1].type === 'element' &&
            c.children[i - 1].tagName === 'img'
          ) {
            children.push({ ...c, children: pool } as Root['children'][0]); // <br> が残るが他の transformer で除去している
            pool = [];
            pool.push(cc);
          } else {
            pool.push(cc);
          }
        } else {
          pool.push(cc);
        }
      });
      children.push({ ...c, children: pool } as Root['children'][0]);
    } else {
      children.push(c);
    }
  });
  tree.children = children;
}

const rehypeSplitParagraph: Plugin = function (
  { cleanParagraph }: RehypeSplitParagraphOptions = {
    cleanParagraph: true
  }
): Transformer {
  // 最上位の paragraph のみ対象。リストや引用、ネストは扱わない。
  return function transformer(tree: Node): void {
    if (tree.type === 'root' && tree.children) {
      // 連続 br
      hastSplitParagraphByBr(tree as Root);
      // img
      hastSplitParagraphByImgAndBr(tree as Root);
      if (cleanParagraph) {
        hastTrimBr(tree as Root);
        hastRemoveEmptyParagraph(tree as Root);
      }
    }
  };
};

export default rehypeSplitParagraph;
