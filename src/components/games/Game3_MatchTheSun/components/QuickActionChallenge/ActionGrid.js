import React from 'react';
import ActionButton from './ActionButton';
import './QuickActionChallenge.css';

const ActionGrid = ({ actions, selectedActions, onActionSelect, disabled }) => {
  return (
    <div className="action-grid">
      {actions.map((action, index) => (
        <ActionButton
          key={action.id}
          action={action}
          isSelected={selectedActions.includes(action)}
          onSelect={onActionSelect}
          disabled={disabled}
          index={index}
        />
      ))}
    </div>
  );
};

export default ActionGrid;