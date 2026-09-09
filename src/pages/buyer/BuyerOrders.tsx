import React from 'react';
import { ShoppingBag, Truck, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';

interface BuyerOrdersProps {
  onNavigate: (path: string) => void;
}

export const BuyerOrders: React.FC<BuyerOrdersProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { formatCurrency, showToast, orders } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">
            Procurement Orders & Invoices
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct farmer contracts with verified digital e-way bills and escrow audit logs
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={() => showToast('info', 'Export Started', 'Exporting procurement tax statement PDF')}
        >
          Export Statement
        </Button>
      </div>

      <Table
        columns={[
          {
            header: 'Contract ID',
            cell: (ord) => (
              <div>
                <p className="font-bold text-slate-900">{ord.orderNumber}</p>
                <p className="text-[11px] text-slate-400">{new Date(ord.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            ),
          },
          {
            header: 'Farmer Partner',
            cell: (ord) => (
              <div>
                <p className="font-bold text-slate-800">{ord.farmerName}</p>
                <p className="text-[11px] text-slate-500">{ord.farmerAddress}</p>
              </div>
            ),
          },
          {
            header: 'Produce & Grade',
            cell: (ord) => (
              <div>
                <p className="font-semibold text-slate-900">{ord.items[0]?.productTitle}</p>
                <p className="text-xs text-slate-500">{ord.totalQuantityKg.toLocaleString('en-IN')} kg</p>
              </div>
            ),
          },
          {
            header: 'Escrow Amount',
            cell: (ord) => (
              <div>
                <p className="font-bold text-slate-900">{formatCurrency(ord.totalAmount)}</p>
                <span className="text-[10px] text-emerald-700 font-bold">
                  Bypassed ₹{(ord.traditionalMandiIntermediaryCut ?? 0).toLocaleString('en-IN')} broker fee
                </span>
              </div>
            ),
          },
          {
            header: 'Status',
            cell: (ord) => (
              <Badge
                variant={ord.status === 'in_transit' ? 'info' : 'success'}
                size="sm"
              >
                {ord.status === 'in_transit' ? 'Dispatched' : 'Delivered & Settled'}
              </Badge>
            ),
          },
          {
            header: 'Action',
            cell: (ord) => (
              <Button
                variant="outline"
                size="sm"
                icon={Truck}
                onClick={() => onNavigate('/logistics')}
              >
                GPS Tracking
              </Button>
            ),
          },
        ]}
        data={(orders || []).filter((order) => order.buyerId === user?.uid || order.buyerId === 'buyer-001' || order.buyerId === 'current-buyer')}
        keyExtractor={(ord) => ord.id}
      />
    </div>
  );
};
