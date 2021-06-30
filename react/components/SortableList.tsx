import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { ReactElement } from 'react';
import React from 'react';

const SortableItem = SortableElement(props => props.children);

const SortableListComponent = SortableContainer(({items}) => {
    return (
        <div>
            {items.map((ItemComponent, index) => (
                <SortableItem key={`item-${index}-${ItemComponent.key}`} index={index}>
                    {ItemComponent}
                </SortableItem>
            ))}
        </div>
    );
});

function SortableList ({ items, onMove }): ReactElement {
     const handleSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            onMove(oldIndex, newIndex);
        }
    };
    return <SortableListComponent items={items} onSortEnd={handleSortEnd} />;
}

export default SortableList;