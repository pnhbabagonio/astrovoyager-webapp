import React from 'react';
import RoleCard from './RoleCard';
import './RoleSelection.css';

const RoleSelection = ({ roles, onRoleSelect }) => {
  return (
    <div className="role-selection">
      <div className="role-selection-header">
        <h2>Choose Your Mission Role</h2>
        <p>Select a role to begin your disaster response training. Each role has unique responsibilities and challenges.</p>
      </div>

      <div className="roles-grid">
        {roles.map(role => (
          <RoleCard
            key={role.id}
            role={role}
            onSelect={onRoleSelect}
          />
        ))}
      </div>

      <div className="role-selection-footer">
        <p>Your choice will determine the challenges and decisions you face in each scenario.</p>
      </div>
    </div>
  );
};

export default RoleSelection;