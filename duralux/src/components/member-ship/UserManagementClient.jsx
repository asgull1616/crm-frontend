"use client"; // 👈 Dosyanın 1. satırı bu olmalı!

import React, { useEffect, useState, useCallback } from 'react';
import { membershipService } from '../../lib/services/membership.request.service'; 
import { toast } from 'react-hot-toast'; // Projende hot-toast kullanıyorsan bunu seç

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await membershipService.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Kullanıcılar yüklenemedi!");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await membershipService.assignRole(userId, newRole);
      toast.success("Rol başarıyla güncellendi");
      fetchUsers(); // Listeyi tazele
    } catch (error) {
      toast.error("Yetkiniz bu işlem için yetersiz!");
    }
  };

  if (loading) return <div className="p-4">Yükleniyor...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Kullanıcı Yönetimi</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Kullanıcı Adı</th>
              <th className="p-3">Email</th>
              <th className="p-3">Mevcut Rol</th>
              <th className="p-3">Rolü Değiştir</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{user.username}</td>
                <td className="p-3 text-gray-600">{user.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 
                    user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-3">
                  {/* Super admin kendi rolünü değiştirmesin diye kontrol */}
                  {user.role !== 'SUPER_ADMIN' && (
                    <select 
                      className="border rounded p-1 text-sm bg-white"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                     
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;