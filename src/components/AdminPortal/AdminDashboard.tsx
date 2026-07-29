import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { securityService } from '../../services/securityService';
import { DELIVERY_MODE_CONFIGS } from '../../services/deliveryLogistics';
import { OrderStatus } from '../../types';
import { ShieldCheck, IndianRupee, Zap, Lock, Download, Filter, FileText, CheckCircle2, Printer, Search } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders();
  const logs = securityService.getLogs();
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');

  const handleExportLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `flybite_audit_trail_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.restaurantName.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const filteredLogs = logs.filter((log) => {
    if (severityFilter === 'all') return true;
    return log.severity === severityFilter;
  });

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 text-2xl">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">SuperAdmin Control & Governance Console</h1>
            <p className="text-xs text-slate-400">Live Customer Orders, Payment Gateway Switch & Security Audit</p>
          </div>
        </div>

        <button
          onClick={handleExportLogs}
          className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center space-x-2 border border-purple-400/30"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Trail (JSON)</span>
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-orange-400" />
            Total Platform GMV
          </span>
          <p className="text-2xl font-extrabold text-white">₹1,48,500</p>
          <span className="text-[10px] text-emerald-400 font-bold">+24% Indian Air Express Growth</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Active Platform Orders
          </span>
          <p className="text-2xl font-extrabold text-white">{orders.length} Active</p>
          <span className="text-[10px] text-cyan-400 font-bold">Live Status Synced</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            NPCI UPI Settlement
          </span>
          <p className="text-2xl font-extrabold text-white">100% Success</p>
          <span className="text-[10px] text-emerald-400 font-bold">256-Bit SSL Encrypted</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            Security Incidents
          </span>
          <p className="text-2xl font-extrabold text-white">0 Breaches</p>
          <span className="text-[10px] text-purple-400 font-bold">Audit Verified</span>
        </div>
      </div>

      {/* MASTER ORDERS & PAYMENT STATUS CONSOLE */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Customer Live Orders & Payment Status Master Console</span>
            </h2>
            <p className="text-xs text-slate-400">Monitor payment settlements, transaction IDs & status overrides</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Order ID, Customer, Kitchen..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl pl-9 pr-3 py-2 outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer & Phone</th>
                <th className="p-3">Restaurant</th>
                <th className="p-3">Transport Mode</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Amount (₹)</th>
                <th className="p-3">Payment Status</th>
                <th className="p-3">Order Progress</th>
                <th className="p-3 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500 font-sans">
                    No orders currently in memory. Place an order in Customer Portal to see it appear here live!
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const modeCfg = DELIVERY_MODE_CONFIGS[ord.deliveryMode];
                  return (
                    <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-bold text-orange-400">{ord.id}</td>
                      <td className="p-3 font-sans font-bold text-white">
                        {ord.customerName}
                        <span className="block text-[10px] font-mono text-slate-400">{ord.customerPhone}</span>
                      </td>
                      <td className="p-3 font-sans font-semibold text-slate-200">{ord.restaurantName}</td>
                      <td className="p-3">
                        <span className="flex items-center gap-1 font-sans text-slate-300">
                          <span>{modeCfg.icon}</span>
                          <span>{modeCfg.title.split(' ')[0]}</span>
                        </span>
                      </td>
                      <td className="p-3 font-sans font-semibold uppercase text-slate-300">
                        {ord.payment.method} {ord.payment.upiApp ? `(${ord.payment.upiApp})` : ''}
                      </td>
                      <td className="p-3 text-cyan-400 font-mono text-[11px]">
                        {ord.payment.transactionId || 'TXN-UPI-9942'}
                      </td>
                      <td className="p-3 font-bold text-white">₹{ord.totalAmount}</td>
                      <td className="p-3">
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                          {ord.payment.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-[11px] outline-none cursor-pointer focus:border-purple-500"
                        >
                          <option value="placed">Placed</option>
                          <option value="kitchen_accepted">Kitchen Accepted</option>
                          <option value="drone_vectoring">Rider/Drone Vectoring</option>
                          <option value="airborne">En Route / Airborne</option>
                          <option value="hovering_landing">Arrived / Landing</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => alert(`Printing GST Invoice for Order #${ord.id}`)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-1.5 rounded-lg text-xs"
                          title="Print Invoice"
                        >
                          <Printer className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Log Inspector */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-400" />
            <span>Real-Time Security Audit Stream ({filteredLogs.length})</span>
          </h2>

          <div className="flex items-center space-x-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Role</th>
                <th className="p-3">Action</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40">
                  <td className="p-3 text-slate-400">{log.timestamp}</td>
                  <td className="p-3 font-bold text-white">{log.actor}</td>
                  <td className="p-3 uppercase text-cyan-400">{log.role}</td>
                  <td className="p-3 font-semibold text-slate-200">{log.action}</td>
                  <td className="p-3 text-slate-500">{log.ipAddress}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        log.severity === 'critical' || log.severity === 'high'
                          ? 'bg-rose-500 text-white'
                          : log.severity === 'medium'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 truncate max-w-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
