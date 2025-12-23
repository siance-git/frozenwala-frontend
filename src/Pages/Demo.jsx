// import { useState } from 'react';
// import { motion } from 'framer-motion'; // Change this line
// import { Search, Filter, MoreVertical, Ban, CheckCircle, Mail, Eye } from 'lucide-react';
// const users = [
//   {
//     id: 1,
//     name: 'John Doe',
//     email: 'john.doe@email.com',
//     role: 'Buyer',
//     status: 'Active',
//     joined: 'Dec 1, 2024',
//     listings: 0,
//     purchases: 5,
//   },
//   {
//     id: 2,
//     name: 'Jane Smith',
//     email: 'jane.smith@email.com',
//     role: 'Seller',
//     status: 'Active',
//     joined: 'Nov 15, 2024',
//     listings: 8,
//     purchases: 2,
//   },
//   {
//     id: 3,
//     name: 'Mike Johnson',
//     email: 'mike.j@email.com',
//     role: 'Both',
//     status: 'Active',
//     joined: 'Oct 20, 2024',
//     listings: 12,
//     purchases: 15,
//   },
//   {
//     id: 4,
//     name: 'Sarah Williams',
//     email: 'sarah.w@email.com',
//     role: 'Buyer',
//     status: 'Suspended',
//     joined: 'Sep 5, 2024',
//     listings: 0,
//     purchases: 3,
//   },
//   {
//     id: 5,
//     name: 'David Brown',
//     email: 'david.b@email.com',
//     role: 'Seller',
//     status: 'Active',
//     joined: 'Aug 12, 2024',
//     listings: 25,
//     purchases: 8,
//   },
// ];

// export function Demo() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterRole, setFilterRole] = useState('all');

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Active':
//         return 'bg-green-100 text-green-700';
//       case 'Suspended':
//         return 'bg-red-100 text-red-700';
//       default:
//         return 'bg-slate-100 text-slate-700';
//     }
//   };

//   const getRoleBadge = (role) => {
//     switch (role) {
//       case 'Buyer':
//         return 'bg-blue-100 text-blue-700';
//       case 'Seller':
//         return 'bg-purple-100 text-purple-700';
//       case 'Both':
//         return 'bg-orange-100 text-orange-700';
//       default:
//         return 'bg-slate-100 text-slate-700';
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div>
//         <h2 className="text-slate-900 mb-2">User Management</h2>
//         <p className="text-slate-600">Manage and monitor all platform users</p>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
//         <div className="flex flex-col md:flex-row gap-4">
//           {/* Search */}
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Search users..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//             />
//           </div>

//           {/* Role Filter */}
//           <select
//             value={filterRole}
//             onChange={(e) => setFilterRole(e.target.value)}
//             className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//           >
//             <option value="all">All Roles</option>
//             <option value="buyer">Buyers</option>
//             <option value="seller">Sellers</option>
//             <option value="both">Both</option>
//           </select>

//           {/* Status Filter */}
//           <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
//             <option value="all">All Status</option>
//             <option value="active">Active</option>
//             <option value="suspended">Suspended</option>
//           </select>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <motion.div
//           whileHover={{ y: -4 }}
//           className="bg-white rounded-xl p-4 shadow-sm border border-slate-200"
//         >
//           <div className="text-slate-600 text-sm mb-1">Total Users</div>
//           <div className="text-2xl text-slate-900">125,430</div>
//         </motion.div>
//         <motion.div
//           whileHover={{ y: -4 }}
//           className="bg-white rounded-xl p-4 shadow-sm border border-slate-200"
//         >
//           <div className="text-slate-600 text-sm mb-1">Buyers</div>
//           <div className="text-2xl text-blue-600">85,200</div>
//         </motion.div>
//         <motion.div
//           whileHover={{ y: -4 }}
//           className="bg-white rounded-xl p-4 shadow-sm border border-slate-200"
//         >
//           <div className="text-slate-600 text-sm mb-1">Sellers</div>
//           <div className="text-2xl text-purple-600">30,150</div>
//         </motion.div>
//         <motion.div
//           whileHover={{ y: -4 }}
//           className="bg-white rounded-xl p-4 shadow-sm border border-slate-200"
//         >
//           <div className="text-slate-600 text-sm mb-1">Suspended</div>
//           <div className="text-2xl text-red-600">80</div>
//         </motion.div>
//       </div>

//       {/* Users Table */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
//       >
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-slate-50 border-b border-slate-200">
//               <tr>
//                 <th className="px-6 py-4 text-left text-sm text-slate-600">User</th>
//                 <th className="px-6 py-4 text-left text-sm text-slate-600">Role</th>
//                 <th className="px-6 py-4 text-left text-sm text-slate-600">Status</th>
//                 <th className="px-6 py-4 text-left text-sm text-slate-600">Joined</th>
//                 <th className="px-6 py-4 text-left text-sm text-slate-600">Listings</th>
//                 <th className="px-6 py-4 text-left text-sm text-slate-600">Purchases</th>
//                 <th className="px-6 py-4 text-left text-sm text-slate-600">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-200">
//               {users.map((user, index) => (
//                 <motion.tr
//                   key={user.id}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   whileHover={{ backgroundColor: '#f8fafc' }}
//                   className="transition-colors"
//                 >
//                   <td className="px-6 py-4">
//                     <div>
//                       <div className="text-slate-900">{user.name}</div>
//                       <div className="text-sm text-slate-500">{user.email}</div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={`px-3 py-1 rounded-full text-sm ${getRoleBadge(user.role)}`}>
//                       {user.role}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(user.status)}`}>
//                       {user.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-slate-600">{user.joined}</td>
//                   <td className="px-6 py-4 text-slate-900">{user.listings}</td>
//                   <td className="px-6 py-4 text-slate-900">{user.purchases}</td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center space-x-2">
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
//                         title="View Details"
//                       >
//                         <Eye className="w-5 h-5" />
//                       </motion.button>
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
//                         title="Send Email"
//                       >
//                         <Mail className="w-5 h-5" />
//                       </motion.button>
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         className={`p-2 rounded-lg transition-colors ${
//                           user.status === 'Active'
//                             ? 'text-red-600 hover:bg-red-50'
//                             : 'text-green-600 hover:bg-green-50'
//                         }`}
//                         title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
//                       >
//                         {user.status === 'Active' ? (
//                           <Ban className="w-5 h-5" />
//                         ) : (
//                           <CheckCircle className="w-5 h-5" />
//                         )}
//                       </motion.button>
//                     </div>
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>

//       {/* Pagination */}
//       <div className="flex items-center justify-between">
//         <p className="text-slate-600 text-sm">Showing 1 to 5 of 125,430 users</p>
//         <div className="flex space-x-2">
//           <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
//             Previous
//           </button>
//           <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">1</button>
//           <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
//             2
//           </button>
//           <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
//             3
//           </button>
//           <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }