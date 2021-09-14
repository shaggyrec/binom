import SortableList from './SortableList';
import React, { ReactElement } from 'react';

function ListContainer ({ children, onMove, isAdmin }): ReactElement {
    return isAdmin ?  <SortableList onMove={onMove} items={children}/> : <>{children}</>;
}
export default ListContainer;