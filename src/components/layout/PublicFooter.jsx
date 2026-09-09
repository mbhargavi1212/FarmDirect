import React from 'react';
import { Sprout, ShieldCheck, HeartHandshake, FileCheck2 } from 'lucide-react';
export const PublicFooter = () => {
    return (<footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Platform & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Sprout className="w-5 h-5"/>
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                Farm<span className="text-emerald-400">Direct</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Smart India Hackathon 2026 (Problem Statement SIH26033). Empowering Indian agriculturists
              by bypassing predatory middlemen chains through fair price discovery, smart escrow protection,
              and AI-driven harvest demand forecasting.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4"/> Escrow Backed Payouts
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <HeartHandshake className="w-4 h-4"/> 0% Intermediary Cuts
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <FileCheck2 className="w-4 h-4"/> MSP Price Floor Protection
              </span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Direct Crop Marketplace</li>
              <li>Fair Price Engine (MSP + Mandi)</li>
              <li>AI Demand & Harvest Planner</li>
              <li>Cold Chain & Fleet Logistics</li>
              <li>Smart Escrow & Settlements</li>
            </ul>
          </div>

          {/* Col 3: Stakeholder Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Portals & Governance
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Farmer Producer (FPO) Desk</li>
              <li>Retail & Institutional Procurement</li>
              <li>State Mandi Nodal Officer Dashboard</li>
              <li>Quality Grading & Verification</li>
              <li>Audit Trail & Transactions</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 FarmDirect • Smart India Hackathon Prototype (SIH26033).</p>
          <p className="text-slate-400">
            Dedicated to 140M+ Indian Smallholder Farmers • Made with Next-Gen AgriTech
          </p>
        </div>
      </div>
    </footer>);
};
