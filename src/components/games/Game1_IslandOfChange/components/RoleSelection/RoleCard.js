import React from 'react';
import './RoleSelection.css';

const RoleCard = ({ role, onSelect }) => {
  return (
    <div 
      className="role-card"
      style={{ '--role-color': role.color }}
      onClick={() => onSelect(role)}
    >
      <div className="role-icon">{role.icon}</div>
      <h3 className="role-name">{role.name}</h3>
      <p className="role-description">{role.description}</p>
      <div className="role-specialty">
        <strong>Specialty:</strong> {role.specialty}
      </div>
      <div className="role-select-button">
        Select Role
      </div>
    </div>
  );
};

export default RoleCard;