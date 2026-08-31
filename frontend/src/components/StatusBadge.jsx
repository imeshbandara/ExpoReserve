import React from 'react';

const StatusBadge = ({ status }) => {
  let badgeClasses = 'px-3 py-1 rounded-full text-sm font-medium border ';

  switch (status) {
    case 'APPROVED':
      badgeClasses += 'bg-green-100 text-green-800 border-green-200';
      break;
    case 'PENDING':
      badgeClasses += 'bg-yellow-100 text-yellow-800 border-yellow-200';
      break;
    case 'REJECTED':
      badgeClasses += 'bg-red-100 text-red-800 border-red-200';
      break;
    case 'CANCELLED':
      badgeClasses += 'bg-gray-100 text-gray-800 border-gray-200';
      break;
    default:
      badgeClasses += 'bg-slate-100 text-slate-800 border-slate-200';
  }

  return (
    <span className={badgeClasses}>
      {status}
    </span>
  );
};

export default StatusBadge;
