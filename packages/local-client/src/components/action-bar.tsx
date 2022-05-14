import './action-bar.css';
import { useActions } from '../hooks/use-actions';
import ActionBarButton from './action-bar-button';

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell } = useActions();

  return (
    <div className='action-bar'>
      <ActionBarButton callback={moveCell} type='up' id={id} />
      <ActionBarButton callback={moveCell} type='down' id={id} />
      <ActionBarButton callback={deleteCell} type='delete' id={id} />
    </div>
  );
};

export default ActionBar;
