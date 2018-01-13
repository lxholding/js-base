export default () => {
  (() => {
    console.dir(Node);
    for (const key in Node) {
      console.info(key, `=${Node[key]}`);
    }

    const nodeAnchor = document.querySelector('a');
    const props = [];
    for (const key in nodeAnchor) {
      props.push(key);
    }
    console.info(props.sort());

    let proto = nodeAnchor;
    do {
      proto = Object.getPrototypeOf(proto);
      console.info(proto);
    } while (proto);

    nodeAnchor.addEventListener('click', function (ev) {
      console.info('addEventListener', this, ev, this.nodeName, this.nodeType, this.nodeValue, this.firstChild.nodeName, this.firstChild.nodeType, this.firstChild.nodeValue);
    });
  })();
};
