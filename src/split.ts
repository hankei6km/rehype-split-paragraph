import { Transformer } from 'unified';
import { Node } from 'hast';

export function rehypeSplitParagraph(): Transformer {
  // 最上位の paragraph のみ対象。リストや引用、ネストは扱わない。
  return function transformer(tree: Node): void {
    // 連続 br
    if (tree.type === 'root' && Array.isArray(tree.children)) {
      const children: Node[] = [];
      tree.children.forEach((c: Node) => {
        if (
          c.type === 'element' &&
          c.tagName === 'p' &&
          Array.isArray(c.children)
        ) {
          let pool: Node[] = [];
          let brCnt = 0;
          c.children.forEach((cc: Node, i) => {
            if (cc.type === 'element' && cc.tagName === 'br') {
              brCnt++;
            } else {
              if (brCnt === 0) {
                pool.push(cc);
              } else if (brCnt === 1) {
                pool.push((c.children as Node[])[i - 1]);
                pool.push(cc);
                brCnt = 0;
              } else {
                children.push({ ...c, children: pool });
                pool = [];
                pool.push(cc);
                brCnt = 0;
              }
            }
          });
          children.push({ ...c, children: pool });
        } else {
          children.push(c);
        }
      });
      tree.children = children;
    }
    // img
    if (tree.type === 'root' && Array.isArray(tree.children)) {
      const children: Node[] = [];
      tree.children.forEach((c: Node) => {
        if (
          c.type === 'element' &&
          c.tagName === 'p' &&
          Array.isArray(c.children)
        ) {
          let pool: Node[] = [];
          c.children.forEach((cc: Node, i) => {
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
                children.push({ ...c, children: pool }); // <br> が残るが他の transformer で除去している
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
                children.push({ ...c, children: pool }); // <br> が残るが他の transformer で除去している
                pool = [];
                pool.push(cc);
              } else {
                pool.push(cc);
              }
            } else {
              pool.push(cc);
            }
          });
          children.push({ ...c, children: pool });
        } else {
          children.push(c);
        }
      });
      tree.children = children;
    }
  };
}
