(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8312:function(e,s,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return r(2547)}])},2547:function(e,s,r){"use strict";r.r(s),r.d(s,{default:function(){return K}});var t=r(5893),a=r(7294);let l=e=>{let{children:s,className:r,...a}=e;return(0,t.jsx)("button",{className:"px-4 py-2 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ".concat(r),...a,children:s})},o=(0,a.createContext)(void 0),n=e=>{let{defaultValue:s,children:r,className:l=""}=e,[n,d]=(0,a.useState)(s);return(0,t.jsx)(o.Provider,{value:{activeTab:n,setActiveTab:d},children:(0,t.jsx)("div",{className:"tabs-container ".concat(l),children:r})})},d=e=>{let{children:s,className:r=""}=e;return(0,t.jsx)("div",{className:"flex border-b ".concat(r),children:s})},i=e=>{let{value:s,children:r,className:l=""}=e,n=(0,a.useContext)(o);if(!n)throw Error("TabsTrigger must be used within Tabs");let{activeTab:d,setActiveTab:i}=n;return(0,t.jsx)("button",{className:"px-4 py-2 ".concat(d===s?"border-b-2 border-blue-500 font-bold":""," ").concat(l),onClick:()=>i(s),children:r})},c=e=>{let{value:s,children:r,className:l=""}=e,n=(0,a.useContext)(o);if(!n)throw Error("TabsContent must be used within Tabs");let{activeTab:d}=n;return d!==s?null:(0,t.jsx)("div",{className:"tabs-content ".concat(l),children:r})};var m=r(2305),h=r(2332),u=r(4206),x=r(2154),p=r(4283),b=r(6910),j=r(3447),g=r(8933),f=r(5043),N=r(9949),y=()=>{let[e,s]=(0,a.useState)([]),[r,o]=(0,a.useState)([]),[y,K]=(0,a.useState)([]),[w,v]=(0,a.useState)([]),[S,k]=(0,a.useState)(0),[q,T]=(0,a.useState)([]),[A,M]=(0,a.useState)([]);(0,a.useEffect)(()=>{C()},[]);let C=()=>{s(Array.from({length:4},()=>[,,,,].fill(5))),o([["A","D","E","F","G"],["B","C","F"],["C","D","H"],["B","E","H"]]),K([{id:0,description:"Analyze Data",requiredKsaos:["A","B"],completedKsaos:[]},{id:1,description:"Develop Strategy",requiredKsaos:["A","D","E"],completedKsaos:[]},{id:2,description:"Implement Solution",requiredKsaos:["C","D","F"],completedKsaos:[]},{id:3,description:"Test Results",requiredKsaos:["B","E","H"],completedKsaos:[]},{id:4,description:"Present Findings",requiredKsaos:["A","G"],completedKsaos:[]},{id:5,description:"Train Team",requiredKsaos:["D","E","F"],completedKsaos:[]},{id:6,description:"Evaluate Performance",requiredKsaos:["A","C","H"],completedKsaos:[]},{id:7,description:"Optimize Process",requiredKsaos:["A","D","F","G"],completedKsaos:[]}]),v([]),k(0),T([]),M(["Simulation started. Member 1 has the majority of important KSAOs, but this is unknown to the team."])},E=()=>{let s=e[0].map((s,r)=>e.reduce((e,s,t)=>t!==r?e+s[r]:e,0)),r=Math.max(...s),t=s.map(e=>e/r),a=Math.random(),l=0;for(let e=0;e<4;e++)if(a<=(l+=t[e]))return e;return 3},O=(e,r)=>{s(s=>{let t=[...s];for(let s=0;s<4;s++)s!==e&&(t[s][e]=Math.max(1,Math.min(10,t[s][e]+r)));return t})};return(0,t.jsxs)("div",{className:"p-6 max-w-6xl mx-auto",children:[(0,t.jsx)("h1",{className:"text-4xl font-bold mb-6 text-gray-800",children:"Complex Team KSAO and Mission Completion Simulation"}),(0,t.jsxs)("div",{className:"mb-6 space-x-4",children:[(0,t.jsx)(l,{onClick:()=>{let e=E(),s=y.filter(e=>e.completedKsaos.length<e.requiredKsaos.length);if(s.length>0){let t=Math.floor(Math.random()*s.length),a=s[t],l=a.requiredKsaos.filter(s=>r[e].includes(s));if(l.length>0){let s=Array.from(new Set([...a.completedKsaos,...l]));K(e=>e.map(e=>e.id===a.id?{...e,completedKsaos:s}:e)),M(s=>[...s,"Turn ".concat(S+1,": Member ").concat(e+1," contributed KSAOs ").concat(l.join(", "),' to "').concat(a.description,'"')]),O(e,l.length/a.requiredKsaos.length),s.length===a.requiredKsaos.length&&(v(e=>[...e,a]),M(e=>[...e,'Subtask "'.concat(a.description,'" fully completed!')]))}else M(s=>[...s,"Turn ".concat(S+1,": Member ").concat(e+1," couldn't contribute to \"").concat(a.description,'"')]),O(e,-.1)}let t=y.reduce((e,s)=>e+s.completedKsaos.length/s.requiredKsaos.length,0)/8;T(e=>[...e,{turn:S,score:t}]),k(e=>e+1),8===w.length&&M(e=>[...e,"Mission completed in ".concat(S+1," turns!")])},className:"bg-primary hover:bg-blue-600",children:"Run Simulation Step"}),(0,t.jsx)(l,{onClick:C,className:"bg-secondary hover:bg-green-600",children:"Reset Simulation"})]}),(0,t.jsxs)("div",{className:"mb-6 p-4 bg-white rounded-lg shadow-card",children:[(0,t.jsx)("span",{className:"font-semibold text-gray-700",children:"Current Turn:"})," ",S,(0,t.jsx)("span",{className:"ml-6 font-semibold text-gray-700",children:"Completed Subtasks:"})," ",w.length," / ",8]}),(0,t.jsxs)(n,{defaultValue:"performance",className:"w-full",children:[(0,t.jsxs)(d,{className:"mb-4 bg-white p-2 rounded-lg shadow-sm",children:[(0,t.jsx)(i,{value:"performance",className:"px-4 py-2 text-sm font-medium",children:"Performance"}),(0,t.jsx)(i,{value:"perceptions",className:"px-4 py-2 text-sm font-medium",children:"Leadership Perceptions"}),(0,t.jsx)(i,{value:"ksaos",className:"px-4 py-2 text-sm font-medium",children:"Team KSAOs"}),(0,t.jsx)(i,{value:"subtasks",className:"px-4 py-2 text-sm font-medium",children:"Subtasks"}),(0,t.jsx)(i,{value:"log",className:"px-4 py-2 text-sm font-medium",children:"Simulation Log"})]}),(0,t.jsxs)(c,{value:"performance",className:"bg-white p-6 rounded-lg shadow-card",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold mb-4 text-gray-800",children:"Mission Progress Over Time"}),(0,t.jsx)(m.h,{width:"100%",height:400,children:(0,t.jsxs)(h.w,{data:q,children:[(0,t.jsx)(u.q,{strokeDasharray:"3 3"}),(0,t.jsx)(x.K,{dataKey:"turn"}),(0,t.jsx)(p.B,{}),(0,t.jsx)(b.u,{}),(0,t.jsx)(j.D,{}),(0,t.jsx)(g.x,{type:"monotone",dataKey:"score",stroke:"#3b82f6",strokeWidth:2})]})})]}),(0,t.jsxs)(c,{value:"perceptions",className:"bg-white p-6 rounded-lg shadow-card",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold mb-4 text-gray-800",children:"Leadership Perceptions Matrix"}),(0,t.jsxs)("table",{className:"w-full border-collapse border border-gray-400",children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{className:"border border-gray-400 p-2",children:"Team Member"}),Array.from({length:4},(e,s)=>(0,t.jsxs)("th",{className:"border border-gray-400 p-2",children:["Member ",s+1]},s))]})}),(0,t.jsx)("tbody",{children:e.map((e,s)=>(0,t.jsxs)("tr",{children:[(0,t.jsxs)("td",{className:"border border-gray-400 p-2",children:["Member ",s+1]}),e.map((e,s)=>(0,t.jsx)("td",{className:"border border-gray-400 p-2",children:e.toFixed(2)},s))]},s))})]}),(0,t.jsx)("h2",{className:"text-2xl font-bold mt-6 mb-4 text-gray-800",children:"Total Leadership Perceptions"}),(0,t.jsx)(m.h,{width:"100%",height:400,children:(0,t.jsxs)(f.v,{data:e.length?e[0].map((s,r)=>({member:"Member ".concat(r+1),totalPerception:e.reduce((e,s,t)=>t!==r?e+s[r]:e,0)})):[],children:[(0,t.jsx)(u.q,{strokeDasharray:"3 3"}),(0,t.jsx)(x.K,{dataKey:"member"}),(0,t.jsx)(p.B,{}),(0,t.jsx)(b.u,{}),(0,t.jsx)(j.D,{}),(0,t.jsx)(N.$,{dataKey:"totalPerception",fill:"#3b82f6"})]})})]}),(0,t.jsxs)(c,{value:"ksaos",className:"bg-white p-6 rounded-lg shadow-card",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold mb-4 text-gray-800",children:"Team KSAOs"}),(0,t.jsxs)("table",{className:"w-full border-collapse border border-gray-400",children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{className:"border border-gray-400 p-2",children:"Team Member"}),(0,t.jsx)("th",{className:"border border-gray-400 p-2",children:"KSAOs"})]})}),(0,t.jsx)("tbody",{children:r.map((e,s)=>(0,t.jsxs)("tr",{children:[(0,t.jsxs)("td",{className:"border border-gray-400 p-2",children:["Member ",s+1]}),(0,t.jsx)("td",{className:"border border-gray-400 p-2",children:e.join(", ")})]},s))})]})]}),(0,t.jsxs)(c,{value:"subtasks",className:"bg-white p-6 rounded-lg shadow-card",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold mb-4 text-gray-800",children:"Subtasks and Required KSAOs"}),(0,t.jsx)("div",{className:"space-y-4",children:y.map(e=>{let s=e.completedKsaos.length===e.requiredKsaos.length;return(0,t.jsxs)("div",{className:"p-4 rounded-lg ".concat(s?"bg-green-100":"bg-gray-100"),children:[(0,t.jsx)("h3",{className:"font-bold text-lg mb-2",children:e.description}),(0,t.jsxs)("p",{className:"mb-1",children:["Required KSAOs: ",e.requiredKsaos.join(", ")]}),(0,t.jsxs)("p",{className:"mb-2",children:["Completed KSAOs: ",e.completedKsaos.join(", ")||"None"]}),(0,t.jsx)("div",{className:"flex space-x-2",children:e.requiredKsaos.map((s,r)=>(0,t.jsx)("div",{className:"w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium\n                          ".concat(e.completedKsaos.includes(s)?"bg-green-500 text-white":"bg-gray-300 text-gray-700"),children:s},r))})]},e.id)})})]}),(0,t.jsxs)(c,{value:"log",className:"bg-white p-6 rounded-lg shadow-card",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold mb-4 text-gray-800",children:"Simulation Log"}),(0,t.jsx)("div",{className:"border p-4 h-96 overflow-y-auto",children:A.map((e,s)=>(0,t.jsx)("div",{className:"mb-2",children:e},s))})]})]})]})},K=()=>(0,t.jsx)("div",{className:"min-h-screen bg-gray-100",children:(0,t.jsx)(y,{})})}},function(e){e.O(0,[195,888,774,179],function(){return e(e.s=8312)}),_N_E=e.O()}]);