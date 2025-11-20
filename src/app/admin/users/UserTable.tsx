'use client';

import { useState } from 'react';
import { updateUserRole, updateUserActiveStatus } from './actions';

type User = {
  userId: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  is_active: boolean;
};

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'student') => {
    setLoading(userId);
    setError(null);

    try {
      await updateUserRole(userId, newRole);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปเดต');
    } finally {
      setLoading(null);
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    setLoading(userId);
    setError(null);

    try {
      await updateUserActiveStatus(userId, !currentStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปเดต');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                อีเมล
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                ชื่อ-นามสกุล
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                บทบาท
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                วันที่สมัคร
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                สถานะ
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                การจัดการ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50 transition">
                {/* Email */}
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {user.email}
                </td>

                {/* Full Name */}
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.full_name || '-'}
                </td>

                {/* Role Badge */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white ${
                      user.role.toLowerCase() === 'admin'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                  >
                    {user.role.toLowerCase() === 'admin'
                      ? 'ผู้ดูแล (ADMIN)'
                      : 'นักเรียน (STUDENT)'}
                  </span>
                </td>

                {/* Created At */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(user.created_at)}
                </td>

                {/* Active Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      user.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-sm">
                  <div className="space-y-2">
                    {/* Role Dropdown */}
                    <div>
                      <select
                        value={user.role.toLowerCase()}
                        onChange={(e) =>
                          handleRoleChange(
                            user.userId,
                            e.target.value as 'admin' | 'student'
                          )
                        }
                        disabled={loading === user.userId}
                        className="block w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer"
                      >
                        <option value="student">นักเรียน</option>
                        <option value="admin">ผู้ดูแล</option>
                      </select>
                    </div>

                    {/* Toggle Active Button */}
                    <button
                      onClick={() => handleToggleActive(user.userId, user.is_active)}
                      disabled={loading === user.userId}
                      className={`w-full px-3 py-1 rounded-md text-sm font-medium transition ${
                        user.is_active
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      } disabled:opacity-50`}
                    >
                      {loading === user.userId
                        ? 'กำลังอัปเดต...'
                        : user.is_active
                          ? 'ปิดใช้งาน'
                          : 'เปิดใช้งาน'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
