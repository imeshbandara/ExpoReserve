import React from 'react';

const ProfileInfo = ({ user }) => {
  if (!user) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-3xl font-bold">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              user.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-slate-500">{user.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
              {user.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6 text-sm">
          <div>
            <p className="text-slate-500 mb-1">Organization Name</p>
            <p className="font-medium text-slate-900">{user.organization_name || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Phone Number</p>
            <p className="font-medium text-slate-900">{user.phone || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">Member Since</p>
            <p className="font-medium text-slate-900">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-slate-500 mb-1">OIDC Sub</p>
            <p className="font-mono text-xs text-slate-400 break-all">{user.oidc_sub}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
