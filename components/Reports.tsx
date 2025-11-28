
import React from 'react';
import { OrderData, OrderItem } from '../types';
import { 
  Truck, 
  ArrowLeft, 
  FileSpreadsheet,
  Users,
  Layers,
  PackageCheck,
  Receipt
} from 'lucide-react';

interface ReportProps {
  data: OrderData[];
  onBack: () => void;
}

// ----------------------------------------------------------------------
// 1. Waybill Data Report
// ----------------------------------------------------------------------
export const WaybillReport: React.FC<ReportProps> = ({ data, onBack }) => {
  const handleExportToCSV = () => {
    // Headers matching the table columns plus address for completeness
    const headers = ["Line No", "Order ID", "Customer Name", "Customer Address", "Courier Service", "Status"];
    
    // Map data to CSV rows
    const rows = data.map((order, index) => {
      // Helper to escape quotes for CSV format (e.g. "John Doe" -> """John Doe""")
      const escape = (text: string | undefined) => `"${(text || "").replace(/"/g, '""')}"`;
      
      return [
        index + 1,
        escape(order.invoiceNumber),
        escape(order.customerName),
        escape(order.customerAddress),
        escape(order.carrier),
        "Ready"
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'waybill_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden print:shadow-none">
        {/* Header */}
        <div className="bg-slate-800 text-white p-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-widest flex items-center gap-2">
              <Truck className="w-8 h-8" /> Waybill Data Report
            </h1>
            <p className="text-slate-400 mt-2">Processed {data.length} {data.length === 1 ? 'Order' : 'Orders'}</p>
          </div>
          <button 
            onClick={handleExportToCSV} 
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg shadow-emerald-900/20 print:hidden"
            title="Download CSV to open in Google Sheets or Excel"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Export to Sheets
          </button>
        </div>

        {/* Data Table */}
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-xs tracking-wider">
                <th className="p-4 font-bold w-16 text-center">#</th>
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">Customer Name (To)</th>
                <th className="p-4 font-bold">Courier Service</th>
                <th className="p-4 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((order, index) => (
                <tr key={index} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="p-4 text-center font-mono text-slate-400">{index + 1}</td>
                  <td className="p-4 font-medium text-slate-900">
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded text-sm border border-slate-200">
                      {order.invoiceNumber || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-700">
                    <div className="font-semibold">{order.customerName || "Unknown Customer"}</div>
                    <div className="text-xs text-slate-400 truncate max-w-[200px]">{order.customerAddress}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${order.carrier?.includes('SPX') ? 'bg-orange-100 text-orange-800 border-orange-200' : 
                        order.carrier?.includes('J&T') ? 'bg-red-100 text-red-800 border-red-200' : 
                        order.carrier?.includes('FLASH') ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                        order.carrier?.includes('LEX') ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        order.carrier?.includes('Ninja') ? 'bg-rose-100 text-rose-800 border-rose-200' :
                        order.carrier?.includes('Kerry') ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        'bg-slate-100 text-slate-800 border-slate-200'
                      }`}>
                      {order.carrier || "Unknown"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-emerald-600 text-sm font-medium flex items-center justify-end">
                      Ready
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Bar */}
        <div className="bg-slate-50 p-4 border-t flex justify-start print:hidden">
          <button onClick={onBack} className="flex items-center text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 2. Order Aggregate System
// ----------------------------------------------------------------------
export const AggregateReport: React.FC<ReportProps> = ({ data, onBack }) => {
  // Logic 1: Group data by Customer Name for the main table.
  
  interface ConsolidatedCustomer {
    name: string;
    orderIds: Set<string>;
    items: OrderItem[];
  }

  const groupedData: Record<string, ConsolidatedCustomer> = {};

  // Logic 2: Group data by Product Name + Variation for the Summary Table.
  interface ProductSummary {
    name: string;
    variation: string;
    totalQty: number;
  }
  const productSummaryMap: Record<string, ProductSummary> = {};


  data.forEach(order => {
    // 1. Customer Grouping
    const name = order.customerName ? order.customerName.trim() : "Unknown Customer";
    
    if (!groupedData[name]) {
      groupedData[name] = {
        name: name,
        orderIds: new Set(),
        items: []
      };
    }

    if (order.invoiceNumber) {
      groupedData[name].orderIds.add(order.invoiceNumber);
    }

    if (order.items && order.items.length > 0) {
      groupedData[name].items.push(...order.items);

      // 2. Product Summary Grouping
      order.items.forEach(item => {
        // Create a unique key based on name and variation
        const key = `${item.description}__${item.variation || 'N/A'}`;
        
        if (!productSummaryMap[key]) {
          productSummaryMap[key] = {
            name: item.description || "Unknown Product",
            variation: item.variation || "N/A",
            totalQty: 0
          };
        }
        productSummaryMap[key].totalQty += (item.quantity || 0);
      });
    }
  });

  // Flatten for Customer table display
  const tableRows: {
    name: string;
    orderIds: string;
    productName: string;
    variation: string;
    qty: string | number;
    isFirstRowForCustomer: boolean;
  }[] = [];

  Object.values(groupedData).forEach(customer => {
    const orderIdStr = Array.from(customer.orderIds).join(', ') || "N/A";
    
    if (customer.items.length === 0) {
      tableRows.push({
        name: customer.name,
        orderIds: orderIdStr,
        productName: "N/A",
        variation: "N/A",
        qty: "N/A",
        isFirstRowForCustomer: true
      });
    } else {
      customer.items.forEach((item, idx) => {
        tableRows.push({
          name: customer.name,
          orderIds: orderIdStr,
          productName: item.description || "N/A",
          variation: item.variation || "N/A",
          qty: item.quantity || "N/A",
          isFirstRowForCustomer: idx === 0
        });
      });
    }
  });

  // Convert Product Summary Map to Array for display
  const productSummaryList = Object.values(productSummaryMap).sort((a, b) => a.name.localeCompare(b.name));

  const handleExportToCSV = () => {
    // 1. Main Table Data
    const headers = ["Name", "Order ID", "Product Name", "Variation", "QTY"];
    const mainRows = tableRows.map(row => {
        const escape = (text: string | number) => `"${String(text).replace(/"/g, '""')}"`;
        return [
            escape(row.name),
            escape(row.orderIds),
            escape(row.productName),
            escape(row.variation),
            escape(row.qty)
        ].join(",");
    });

    // 2. Summary Table Data
    const summaryHeader = ["Final Product Release Summary"];
    const summarySubHeaders = ["Product Name", "Variation", "Final Release Qty"];
    const summaryRows = productSummaryList.map(item => {
        const escape = (text: string | number) => `"${String(text).replace(/"/g, '""')}"`;
        return [
            escape(item.name),
            escape(item.variation),
            escape(item.totalQty)
        ].join(",");
    });

    // Combine sections with spacing
    const csvContent = [
        headers.join(","), 
        ...mainRows,
        "", // Empty row
        "", // Empty row
        summaryHeader.join(","),
        summarySubHeaders.join(","),
        ...summaryRows
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'aggregate_report.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Main Card: Customer Aggregate */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-slate-800 text-white p-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-8 h-8" /> Order Aggregate System
              </h1>
              <p className="text-slate-400 mt-2">Consolidated view by Customer Name</p>
            </div>
            <div className="flex gap-2">
               <button 
                  onClick={handleExportToCSV}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg shadow-purple-900/20"
               >
                  <FileSpreadsheet className="w-4 h-4 mr-2" /> Export
               </button>
            </div>
          </div>

          {/* Customer Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-xs tracking-wider">
                  <th className="p-4 font-bold border-r border-slate-200">Name</th>
                  <th className="p-4 font-bold border-r border-slate-200">Order ID</th>
                  <th className="p-4 font-bold border-r border-slate-200">Product Name</th>
                  <th className="p-4 font-bold border-r border-slate-200">Variation</th>
                  <th className="p-4 font-bold text-center">QTY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableRows.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    {/* Name Column */}
                    <td className="p-4 border-r border-slate-100 align-top">
                      {row.isFirstRowForCustomer ? (
                          <div className="font-bold text-slate-800 flex items-center">
                              <Users className="w-4 h-4 mr-2 text-indigo-500" />
                              {row.name}
                          </div>
                      ) : (
                          <span className="text-slate-200 text-xs select-none">"</span>
                      )}
                    </td>
                    
                    {/* Order ID Column */}
                    <td className="p-4 border-r border-slate-100 align-top">
                       {row.isFirstRowForCustomer ? (
                          <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 break-words">
                              {row.orderIds}
                          </span>
                       ) : (
                          <span className="text-slate-200 text-xs select-none">"</span>
                       )}
                    </td>
                    
                    {/* Product Details */}
                    <td className="p-4 border-r border-slate-100 text-slate-700">{row.productName}</td>
                    <td className="p-4 border-r border-slate-100 text-slate-500 italic">{row.variation}</td>
                    <td className="p-4 text-center font-bold text-slate-800">{row.qty}</td>
                  </tr>
                ))}
                
                {tableRows.length === 0 && (
                    <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">
                            No data found or processed.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Second Card: Final Product Release Summary */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mt-8 border border-slate-200">
           <div className="bg-indigo-50 border-b border-indigo-100 p-6">
              <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
                 <PackageCheck className="w-6 h-6 text-indigo-600" />
                 Final Product Release Summary
              </h2>
              <p className="text-indigo-600/70 mt-1">Total quantity needed for batch release</p>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-white border-b border-slate-200 text-slate-500 uppercase text-xs tracking-wider">
                   <th className="p-4 font-bold border-r border-slate-100 w-1/2">Product Name</th>
                   <th className="p-4 font-bold border-r border-slate-100 w-1/4">Variation</th>
                   <th className="p-4 font-bold text-center w-1/4 text-indigo-700 bg-indigo-50/50">Final Release Qty</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {productSummaryList.map((item, idx) => (
                   <tr key={idx} className="hover:bg-slate-50">
                     <td className="p-4 border-r border-slate-100 font-medium text-slate-800">
                       {item.name}
                     </td>
                     <td className="p-4 border-r border-slate-100 text-slate-600 italic">
                       {item.variation}
                     </td>
                     <td className="p-4 text-center text-xl font-bold text-indigo-600 bg-indigo-50/30">
                       {item.totalQty}
                     </td>
                   </tr>
                 ))}
                 {productSummaryList.length === 0 && (
                   <tr>
                     <td colSpan={3} className="p-6 text-center text-slate-400 italic">
                       No product items to summarize.
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-start">
          <button onClick={onBack} className="flex items-center text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 3. Customer Invoicing
// ----------------------------------------------------------------------
export const InvoiceReport: React.FC<ReportProps> = ({ data, onBack }) => {
  // Flatten orders into items for list view
  const rows = data.flatMap(order => {
    // If order has no items, create a row with empty item fields to show the order exists
    if (!order.items || order.items.length === 0) {
       return [{
         customerName: order.customerName,
         orderId: order.invoiceNumber,
         productName: null,
         variation: null,
         qty: 0,
         unitPrice: 0,
         totalPrice: 0,
         netVat: 0,
         vat: 0,
         currency: order.currency || ''
       }];
    }

    return order.items.map(item => {
      const qty = item.quantity || 0;
      const price = item.unitPrice || 0;
      const totalPrice = item.total || (qty * price);
      
      // Calculations 
      const netVat = totalPrice * 0.12; 
      const vat = totalPrice - netVat;

      return {
        customerName: order.customerName,
        orderId: order.invoiceNumber,
        productName: item.description,
        variation: item.variation,
        qty: qty,
        unitPrice: price,
        totalPrice: totalPrice,
        netVat: netVat,
        vat: vat,
        currency: order.currency || ''
      };
    });
  });

  const handleExportToCSV = () => {
    const headers = [
      "Customer Name", 
      "Order ID", 
      "Product Name", 
      "Variation", 
      "Qty", 
      "Unit Price", 
      "Total Price", 
      "Net VAT", 
      "VAT"
    ];

    const csvRows = rows.map(row => {
      const escape = (text: any) => `"${String(text || '-').replace(/"/g, '""')}"`;
      const formatMoney = (val: number) => (val || 0).toFixed(2);
      
      return [
        escape(row.customerName),
        escape(row.orderId),
        escape(row.productName),
        escape(row.variation),
        row.qty || '-', 
        escape(formatMoney(row.unitPrice)),
        escape(formatMoney(row.totalPrice)),
        escape(formatMoney(row.netVat)),
        escape(formatMoney(row.vat))
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'invoice_list_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (val: number, currency: string) => {
    if (val === 0 || val === null || val === undefined) return '-';
    return `${currency}${val.toFixed(2)}`;
  };
  
  const formatText = (text: string | undefined | null) => {
      return text || '-';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 text-white p-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-widest flex items-center gap-2">
              <Receipt className="w-8 h-8" /> Customer Invoicing List
            </h1>
            <p className="text-slate-400 mt-2">Consolidated view of all invoice items</p>
          </div>
          <button 
            onClick={handleExportToCSV} 
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-lg shadow-emerald-900/20"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Export to Sheets
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-xs tracking-wider">
                <th className="p-4 font-bold border-r border-slate-200">Customer Name</th>
                <th className="p-4 font-bold border-r border-slate-200">Order ID</th>
                <th className="p-4 font-bold border-r border-slate-200 w-64">Product Name</th>
                <th className="p-4 font-bold border-r border-slate-200">Variation</th>
                <th className="p-4 font-bold text-center border-r border-slate-200">Qty</th>
                <th className="p-4 font-bold text-right border-r border-slate-200">Unit Price</th>
                <th className="p-4 font-bold text-right border-r border-slate-200 text-indigo-700">Total Price</th>
                <th className="p-4 font-bold text-right border-r border-slate-200">Net VAT</th>
                <th className="p-4 font-bold text-right">VAT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 border-r border-slate-100 font-medium text-slate-800 whitespace-nowrap">
                    {formatText(row.customerName)}
                  </td>
                  <td className="p-4 border-r border-slate-100 font-mono text-xs text-slate-600">
                     {formatText(row.orderId)}
                  </td>
                  <td className="p-4 border-r border-slate-100 text-slate-700">
                     {formatText(row.productName)}
                  </td>
                  <td className="p-4 border-r border-slate-100 text-slate-500 italic">
                     {formatText(row.variation)}
                  </td>
                  <td className="p-4 border-r border-slate-100 text-center font-bold text-slate-800">
                     {row.qty || '-'}
                  </td>
                  <td className="p-4 border-r border-slate-100 text-right text-slate-600">
                     {formatCurrency(row.unitPrice, row.currency)}
                  </td>
                  <td className="p-4 border-r border-slate-100 text-right font-bold text-indigo-600 bg-indigo-50/20">
                     {formatCurrency(row.totalPrice, row.currency)}
                  </td>
                  <td className="p-4 border-r border-slate-100 text-right text-slate-500 text-sm">
                     {formatCurrency(row.netVat, row.currency)}
                  </td>
                  <td className="p-4 text-right text-slate-500 text-sm">
                     {formatCurrency(row.vat, row.currency)}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                  <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400">
                          No invoice data available.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Action */}
        <div className="bg-slate-50 p-4 border-t flex justify-start">
          <button onClick={onBack} className="flex items-center text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
