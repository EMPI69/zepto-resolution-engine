import React from 'react';
import { OrderContextData } from '../types';
import { formatINR } from '../utils/formatters';

interface OrderContextProps {
  order: OrderContextData | null;
}

export const OrderContext: React.FC<OrderContextProps> = ({ order }) => {
  if (!order) {
    return (
      <div className="bg-gray-900/80 border border-gray-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-xl">
        <h3 className="text-base font-bold text-white mb-2">Order Context</h3>
        <p className="text-xs text-amber-400 font-medium">No order context linked to this ticket.</p>
      </div>
    );
  }

  const isDelivered = order.delivery_status?.toLowerCase() === 'delivered';
  const isCancelled = order.delivery_status?.toLowerCase() === 'cancelled';

  const statusStyle = isDelivered
    ? 'bg-emerald-950 text-emerald-300 border-emerald-800/60'
    : isCancelled
    ? 'bg-rose-950 text-rose-300 border-rose-800/60'
    : 'bg-amber-950 text-amber-300 border-amber-800/60';

  return (
    <div className="bg-gray-900/80 border border-gray-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" />
            </svg>
            Order Details
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Contextual order information for this ticket</p>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-gray-950 text-indigo-300 border border-gray-800">
          #{order.order_id}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gray-950/70 border border-gray-800/80 rounded-xl p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">Items</span>
          <span className="text-sm font-bold text-white mt-1 block">{order.items ?? 'N/A'} items</span>
        </div>

        <div className="bg-gray-950/70 border border-gray-800/80 rounded-xl p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">Order Value</span>
          <span className="text-sm font-bold font-mono text-emerald-400 mt-1 block">{formatINR(order.value_inr)}</span>
        </div>

        <div className="bg-gray-950/70 border border-gray-800/80 rounded-xl p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">Delivery Time</span>
          <span className="text-sm font-bold text-white mt-1 block">{order.delivery_time_min ?? 'N/A'} min</span>
        </div>

        <div className="bg-gray-950/70 border border-gray-800/80 rounded-xl p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block">Status</span>
          <div className="mt-1">
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded border ${statusStyle} capitalize`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isDelivered ? 'bg-emerald-400' : isCancelled ? 'bg-rose-400' : 'bg-amber-400'}`} />
              {order.delivery_status || 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
