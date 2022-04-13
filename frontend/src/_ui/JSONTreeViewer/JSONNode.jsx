import React from 'react';
import _ from 'lodash';

export const JSONNode = ({ data, ...restProps }) => {
  const { path, shouldExpandNode, currentNode, getCurrentPath, getCurrentNodeType, toUseNodeIcons, renderNodeIcons } =
    restProps;

  const [expandable, set] = React.useState(() =>
    typeof shouldExpandNode === 'function' ? shouldExpandNode(path, data) : shouldExpandNode
  );

  const toggleExpandNode = () => set((prev) => !prev);

  const currentNodePath = getCurrentPath(path, currentNode);
  // if data is an array or an object and is not empty and is expandable then show the node
  const toExpandNode = (data instanceof Array || data instanceof Object) && !_.isEmpty(data);

  let $VALUE = null;
  let $NODEType = null;
  let $NODEIcon = null;
  const typeofCurrentNode = getCurrentNodeType(data);
  const numberOfEntries =
    (typeofCurrentNode === 'Array' && data.length) || (typeofCurrentNode === 'Object' && Object.keys(data).length);

  if (toUseNodeIcons && currentNode) {
    $NODEIcon = renderNodeIcons(currentNode);
  }

  switch (typeofCurrentNode) {
    case 'String':
      $VALUE = <JSONNode.StringNode data={data} />;
      $NODEType = 'String';

      break;

    case 'Object':
      $VALUE = <JSONNode.ObjectNode data={data} path={currentNodePath} {...restProps} />;
      $NODEType = <span>{`Object { } ${numberOfEntries} ${numberOfEntries > 1 ? 'entries' : 'entry'}`}</span>;
      break;

    case 'Array':
      $VALUE = <JSONNode.ArrayNode data={data} path={currentNodePath} {...restProps} />;
      $NODEType = <span>{`Array [ ] ${numberOfEntries} ${numberOfEntries > 1 ? 'items' : 'item'}`}</span>;

      break;

    default:
      $VALUE = <span>{String(data)}</span>;
      $NODEType = typeofCurrentNode;
  }

  let $key = <span>{String(currentNode)}</span>;

  if (!currentNode) {
    return $VALUE;
  }

  return (
    <div className="row">
      <div className="col-md-1 json-tree-icon-container">
        <JSONNode.NodeIndicator
          toExpand={expandable}
          toShowJSONNOde={toExpandNode}
          handleToggle={toggleExpandNode}
          typeofCurrentNode={typeofCurrentNode}
        />
      </div>
      <div className="col-md-1 json-tree-icon-container">{$NODEIcon}</div>
      <div className="col">
        {$key} {$NODEType} {toExpandNode && !expandable ? null : $VALUE}
      </div>
    </div>
  );
};

const JSONTreeNodeIndicator = ({ toExpand, toShowJSONNOde, handleToggle, ...restProps }) => {
  const { renderCustomIndicator, typeofCurrentNode } = restProps;

  const defaultStyles = {
    transform: toExpand ? 'rotate(90deg)' : 'rotate(0deg)',
    transition: '0.2s all',
    display: 'inline-block',
    cursor: 'pointer',
  };

  const renderDefaultIndicator = () => (
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.02063 1L5.01032 5.01028L1.00003 8.99997"
        stroke="#61656F"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (!toShowJSONNOde && (typeofCurrentNode !== 'Object' || typeofCurrentNode !== 'Array')) return null;
  if (!toShowJSONNOde) return renderDefaultIndicator();

  return (
    <React.Fragment>
      <span className="json-tree-node-icon" onClick={handleToggle} style={defaultStyles}>
        {renderCustomIndicator ? renderCustomIndicator() : renderDefaultIndicator()}
      </span>
    </React.Fragment>
  );
};

const JSONTreeStringNode = ({ data, ...restProps }) => {
  return <span className="json-tree-node-string">{String(data)}</span>;
};

const JSONTreeObjectNode = ({ data, path, ...restProps }) => {
  const nodeKeys = Object.keys(data);

  return nodeKeys.map((key, index) => {
    const currentPath = [...path, key];
    const _currentNode = key;
    const props = { ...restProps };
    props.currentNode = _currentNode;

    return <JSONNode key={`obj-${key}/${index}`} data={data[key]} path={currentPath} {...props} />;
  });
};

const JSONTreeArrayNode = ({ data, path, ...restProps }) => {
  const keys = [];

  for (let i = 0; i < data.length; i++) {
    keys.push(i);
  }

  return keys.map((key, index) => {
    const currentPath = [...path, key];
    const _currentNode = key;
    const props = { ...restProps };
    props.currentNode = _currentNode;

    return <JSONNode key={`arr-${key}/${index}`} data={data[key]} path={currentPath} {...props} />;
  });
};

JSONNode.NodeIndicator = JSONTreeNodeIndicator;
JSONNode.StringNode = JSONTreeStringNode;
JSONNode.ObjectNode = JSONTreeObjectNode;
JSONNode.ArrayNode = JSONTreeArrayNode;