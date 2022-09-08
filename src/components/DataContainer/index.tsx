import { useMapDataToTree } from '../../utils';

export interface TData {
  id: number;
  name: string;
  parent_id: number;
  children?: any[];
}
interface DataContainerProps {
  data: TData[];
}

const DataContainer = ({ data }: DataContainerProps) => {
  const resultTrees = useMapDataToTree(data);

  const treeRoots = data
    .filter((dataEntry) => dataEntry['parent_id'] === 0)
    .map((dataEntry) => resultTrees.get(dataEntry['id']));

  console.log('treeroots', treeRoots, 'resultTrees', resultTrees);

  let string = '';
  const renderString = (tree: TData, level: number) => {
    const dashes = level > 0 ? '-'.repeat(level) : '';
    string += `${dashes} ${tree.name} </br>`;
    tree?.children?.forEach((child: TData) => renderString(child, level + 1));
  };

  treeRoots.forEach((treeRoot) => renderString(treeRoot, 0));

  return <code dangerouslySetInnerHTML={{ __html: string }} />;
};

export default DataContainer;
