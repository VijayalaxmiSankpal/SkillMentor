import React from "react";
import { FaCode, FaServer, FaLayerGroup, FaChartBar, FaCloud, FaMobileAlt, FaSitemap } from "react-icons/fa";

const ICON_MAP = {
  FaCode: FaCode,
  FaServer: FaServer,
  FaLayerGroup: FaLayerGroup,
  FaChartBar: FaChartBar,
  FaCloud: FaCloud,
  FaMobileAlt: FaMobileAlt,
  FaSitemap: FaSitemap,
};

function RoleSelector(props) {
  const roles = props.roles;
  const selectedRole = props.selectedRole;

  function handleSelect(role) {
    return function () {
      props.onRoleSelect(role)();
    };
  }

  return (
    <div className="card p-5">
      <h3 className="text-white font-semibold text-sm mb-4">Select Target Role</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {roles.map(function (role) {
          const Icon = ICON_MAP[role.icon] || FaCode;
          const isSelected = selectedRole && selectedRole.id === role.id;
          const cardClass = isSelected
            ? "bg-brand-500/10 border-brand-500/30 text-brand-400"
            : "bg-surface border-surface-border text-gray-400 hover:border-gray-500 hover:text-gray-300";

          return (
            <button
              key={role.id}
              onClick={handleSelect(role)}
              className={"flex flex-col items-center gap-2 p-4 rounded-xl border transition-all " + cardClass}
            >
              <Icon size={24} />
              <span className="text-xs font-medium text-center">{role.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RoleSelector;