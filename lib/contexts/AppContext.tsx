import React, { useContext } from 'react'
import { useList, List } from '../hooks/useList'

export const ListContext = React.createContext<List>({} as List)

export const useListContext = () => useContext(ListContext)

type Props = {
  children: React.ReactNode;
};

export const ListProvider: React.FC<Props> = ({ children }) => {
  const list = useList()

  return <ListContext.Provider value={list}>{children}</ListContext.Provider>
}