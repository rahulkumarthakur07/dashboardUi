import React from "react";

const Home = () => {
  return (
    <div className="space-y-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">1,245</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700">Active Projects</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">87</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700">Revenue</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">$12,430</p>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Sales Overview</h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
          Chart Placeholder
        </div>
      </div>

      {/* Recent Activity / List */}
      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Users</h2>
        <ul className="divide-y divide-gray-200">
          <li className="py-2 flex justify-between items-center">
            <span>User 1</span>
            <span className="text-gray-400 text-sm">Joined 2 days ago</span>
          </li>
          <li className="py-2 flex justify-between items-center">
            <span>User 2</span>
            <span className="text-gray-400 text-sm">Joined 3 days ago</span>
          </li>
          <li className="py-2 flex justify-between items-center">
            <span>User 3</span>
            <span className="text-gray-400 text-sm">Joined 1 week ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
