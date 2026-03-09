export const printReceipt = (order)=>{

 const win = window.open("","print","width=300");

 win.document.write(`

 <html>

 <style>

 body{
 font-family:monospace;
 text-align:center;
 }

 table{
 width:100%;
 }

 </style>

 <body>

 <h3>Storematic POS</h3>

 ${order.items.map(i=>

 `<p>${i.name} x${i.qty} = ${i.price*i.qty}</p>`

 ).join("")}

 <hr>

 <h4>Total ${order.total}</h4>

 </body>

 </html>

 `);

 win.print();

};