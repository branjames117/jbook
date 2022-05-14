interface ActionBarButtonProps {
  callback: any;
  type: 'up' | 'down' | 'delete';
  id: string;
}

const ActionBarButton: React.FC<ActionBarButtonProps> = ({
  callback,
  type,
  id,
}) => {
  if (type !== 'delete') {
    return (
      <button
        className='button is-primary is-small'
        onClick={() => callback(id, type)}
      >
        <span className='icon'>
          <i className={`fas fa-arrow-${type}`}></i>
        </span>
      </button>
    );
  } else {
    return (
      <button
        className='button is-primary is-small'
        onClick={() => callback(id)}
      >
        <span className='icon'>
          <i className='fas fa-times'></i>
        </span>
      </button>
    );
  }
};

export default ActionBarButton;
