import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Download, Landmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';

interface PaymentsEscrowPageProps {
  onNavigate: (path: string) => void;
}

export const PaymentsEscrowPage: React.FC<PaymentsEscrowPageProps> = ({ onNavigate }) => {
  const { user, role, updateUserBalance } = useAuth();
  const { formatCurrency, showToast, transactions } = useApp();
  const [withdrawing, setWithdrawing] = useState(false);

  const handleWithdraw = () => {
    const withdrawalAmount = Math.min(50000, user?.walletBalance ?? 0);
    if (withdrawalAmount <= 0) {
      showToast('warning', 'Insufficient Balance', 'There is no available balance to withdraw.');
      return;
    }
    setWithdrawing(true);
    setTimeout(() => {
      updateUserBalance(user.uid, -withdrawalAmount);
      setWithdrawing(false);
      showToast(
        'success',
        'Instant Settlement Dispatched',
        `${formatCurrency(withdrawalAmount)} NEFT transferred to State Bank of India account ending in ••4821.`
      );
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            {role === 'buyer' ? 'Consumer Transactions' : 'Smart Escrow & Direct Bank Settlements'}
          </h1>
          <Badge variant="success" size="sm">Transactions</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {role === 'buyer' ? 'Review your completed and active marketplace transactions.' : 'Review your available withdrawal balance and transparent transaction history.'}
        </p>
      </div>

      {/* Financial Summary Cards */}
      {role !== 'buyer' && <div className="grid grid-cols-1 gap-6">
        <Card padding="lg" className="border-emerald-200 bg-emerald-50/40 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Available Withdrawable Balance
          </p>
          <p className="text-3xl font-extrabold text-emerald-800 font-heading">
            {formatCurrency(user?.walletBalance ?? 0)}
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              icon={Landmark}
              onClick={handleWithdraw}
              isLoading={withdrawing}
            >
              Withdraw to Bank (UPI / NEFT)
            </Button>
          </div>
        </Card>

      </div>}

      {/* Ledger Table */}
      <Card padding="lg" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Transparent Transaction Ledger
            </h3>
            <p className="text-xs text-slate-500">Immutable audit records with direct UPI/NEFT verification references</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => showToast('info', 'Statement Downloaded', 'Audit ledger exported as PDF.')}
          >
            Download Ledger
          </Button>
        </div>

        <Table
          columns={[
            {
              header: 'Txn ID / Ref',
              cell: (tx) => (
                <div>
                  <p className="font-mono text-xs font-bold text-slate-800">{tx.id}</p>
                  <p className="text-[11px] text-slate-400">Order #{tx.orderId}</p>
                </div>
              ),
            },
            {
              header: 'Type',
              cell: (tx) => (
                <div className="flex items-center gap-1.5">
                  {tx.type.includes('release') || tx.type.includes('payout') ? (
                    <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-sky-600" />
                  )}
                  <span className="text-xs font-medium capitalize text-slate-700">
                    {tx.type.replace('_', ' ')}
                  </span>
                </div>
              ),
            },
            {
              header: 'Counterparty',
              cell: (tx) => (
                <div>
                  <p className="font-semibold text-slate-800">
                    {role === 'farmer' ? tx.payerName : tx.payeeName}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize">{tx.paymentMethod}</p>
                </div>
              ),
            },
            {
              header: 'Gross Amount',
              cell: (tx) => (
                <span className="font-bold text-slate-900">{formatCurrency(tx.amount)}</span>
              ),
            },
            {
              header: 'Intermediary Cut',
              cell: (tx) => (
                <div>
                  <span className="text-xs font-bold text-emerald-700">₹0 (Zero Cut)</span>
                  <p className="text-[10px] text-slate-400">Ref: {tx.referenceId.slice(-6)}</p>
                </div>
              ),
            },
            {
              header: 'Status',
              cell: (tx) => (
                <Badge variant={tx.status === 'successful' ? 'success' : 'warning'} size="sm">
                  {tx.status.toUpperCase()}
                </Badge>
              ),
            },
          ]}
          data={transactions}
          keyExtractor={(tx) => tx.id}
        />
      </Card>
    </div>
  );
};
