// custom hook to use our action creators
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';

export const useActions = () => {
  const dispatch = useDispatch();

  // memoize the bound action creators to prevent components from rerendering infinitely
  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};
