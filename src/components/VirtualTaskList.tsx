/**
 * Virtual scrolling list for tasks
 * Improves performance when rendering large lists
 */

import { FixedSizeList as List } from 'react-window';
import TaskCard from './TaskCard';
import { Task } from '@/types';

interface VirtualTaskListProps {
  tasks: Task[];
  height?: number;
  itemSize?: number;
  onTaskClick?: (task: Task) => void;
}

const DEFAULT_HEIGHT = 600;
const DEFAULT_ITEM_SIZE = 200;

export default function VirtualTaskList({
  tasks,
  height = DEFAULT_HEIGHT,
  itemSize = DEFAULT_ITEM_SIZE,
  onTaskClick,
}: VirtualTaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <p>No tasks available</p>
      </div>
    );
  }

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style} className="px-4 py-2">
      <TaskCard
        task={tasks[index]}
        onClick={() => onTaskClick?.(tasks[index])}
      />
    </div>
  );

  return (
    <List
      height={height}
      itemCount={tasks.length}
      itemSize={itemSize}
      width="100%"
    >
      {Row}
    </List>
  );
}
