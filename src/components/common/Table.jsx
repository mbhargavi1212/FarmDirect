import React from 'react';
export function Table({ columns, data, keyExtractor, emptyMessage = 'No records found', isLoading = false, }) {
    return (<div className="w-full overflow-x-auto border border-slate-200 rounded-2xl bg-white">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
          <tr>
            {columns.map((col, idx) => (<th key={idx} className={`px-4 sm:px-6 py-3.5 ${col.className || ''}`}>
                {col.header}
              </th>))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {isLoading ? (<tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"/>
                  <span>Loading data...</span>
                </div>
              </td>
            </tr>) : data.length === 0 ? (<tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>) : (data.map((item) => (<tr key={keyExtractor(item)} className="hover:bg-slate-50/70 transition-colors">
                {columns.map((col, colIdx) => (<td key={colIdx} className={`px-4 sm:px-6 py-4 ${col.className || ''}`}>
                    {col.cell
                    ? col.cell(item)
                    : col.accessorKey
                        ? String(item[col.accessorKey] ?? '')
                        : null}
                  </td>))}
              </tr>)))}
        </tbody>
      </table>
    </div>);
}
