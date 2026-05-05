import { useState, useEffect } from "react";

// ─── CONFIGURAÇÃO ─────────────────────────────────────────────
const USERS = {
  daniela: { pw:"1234", access:["record","veritas"], name:"Daniela", role:"admin" },
  marcus:  { pw:"1234", access:["record"],           name:"Marcus",  role:"partner" },
};
const BRANDS = {
  record:  { name:"Record Assessoria Contábil", short:"Record", c:"#2a4a8a", c2:"#c9a96e", tagline:"Assessoria Contábil · 43 anos" },
  veritas: { name:"Veritas Hub", short:"Veritas", c:"#c9a96e", c2:"#8f775f", tagline:"BPO Financeiro · Segurança e Clareza" },
};

// Documentos por tipo de cliente
const DOCS_TRANSFER = [
  { id:"contrato_social",   label:"Contrato Social / Estatuto" },
  { id:"cnpj",              label:"Cartão CNPJ" },
  { id:"ultima_declaracao", label:"Última Declaração (IRPJ/DEFIS)" },
  { id:"livros_fiscais",    label:"Livros Fiscais" },
  { id:"extratos",          label:"Extratos Bancários (3 meses)" },
  { id:"folha",             label:"Folha de Pagamento" },
  { id:"docs_socios",       label:"Documentos dos Sócios (RG/CPF)" },
  { id:"autorizacao",       label:"Autorização de Transferência" },
  { id:"certificado",       label:"Certificado Digital" },
  { id:"senhas_gov",        label:"Senhas Gov/eSocial/Simples" },
];
const DOCS_CONSTITUTION = [
  { id:"docs_socios",       label:"Documentos dos Sócios (RG/CPF)" },
  { id:"comprovante_end",   label:"Comprovante de Endereço" },
  { id:"contrato_rascunho", label:"Rascunho do Contrato Social" },
  { id:"capital_social",    label:"Definição do Capital Social" },
  { id:"atividades",        label:"Descrição das Atividades (CNAE)" },
  { id:"endereco_empresa",  label:"Endereço da Empresa" },
  { id:"regime_tributario", label:"Regime Tributário Definido" },
];

// Etapas do onboarding
const STAGES = [
  { id:"documentacao",       label:"Documentação",            icon:"📁", desc:"Recebimento e conferência de documentos" },
  { id:"dominio",            label:"Sistema Domínio",         icon:"💻", desc:"Cadastro e acesso ao sistema contábil" },
  { id:"zappy",              label:"Zappy Contábil",          icon:"⚡", desc:"Configuração do portal do cliente" },
  { id:"reuniao_mes1",       label:"Reunião 1º Mês",          icon:"🤝", desc:"Alinhamento inicial com o cliente" },
  { id:"reuniao_trimestral", label:"Reunião Trimestral",      icon:"🔄", desc:"Apresentação de resultados trimestrais" },
  { id:"reuniao_semestral",  label:"Reunião Semestral",       icon:"📊", desc:"Análise semestral completa" },
  { id:"jantar",             label:"Jantar de Boas-vindas",   icon:"🍽️", desc:"Evento de boas-vindas ao escritório" },
  { id:"kit",                label:"Kit de Boas-vindas",      icon:"🎁", desc:"Entrega do kit personalizado" },
];

// BPO - Categorias e sugestões
const CAT_COLORS = { caixa:"#10b981", pagamentos:"#f59e0b", cobranca:"#ef4444", relatorio:"#6366f1", bancario:"#3b82f6", rh:"#ec4899", fiscal:"#f97316", reuniao:"#8b5cf6" };
const CAT_LABELS = { caixa:"Caixa", pagamentos:"Pagamentos", cobranca:"Cobrança", relatorio:"Relatórios", bancario:"Bancário", rh:"RH", fiscal:"Fiscal", reuniao:"Reunião" };
const BPO_SUGESTOES = [
  { id:"saldo_diario",    label:"Verificação de Saldo",         freq:"daily",   dia:null, icon:"💰", cat:"caixa",     desc:"Conferir saldo de todas as contas" },
  { id:"lancamentos",     label:"Registro de Lançamentos",       freq:"daily",   dia:null, icon:"📝", cat:"caixa",     desc:"Lançar entradas e saídas do dia" },
  { id:"contas_pagar",    label:"Contas a Pagar",               freq:"weekly",  dia:3,    icon:"📤", cat:"pagamentos", desc:"Verificar e agendar pagamentos" },
  { id:"contas_receber",  label:"Contas a Receber",             freq:"weekly",  dia:3,    icon:"📥", cat:"cobranca",   desc:"Acompanhar cobranças" },
  { id:"fluxo_semanal",   label:"Fluxo de Caixa Semanal",       freq:"weekly",  dia:5,    icon:"📊", cat:"relatorio",  desc:"Relatório semanal" },
  { id:"pix_colaborador", label:"PIX — Colaboradores",          freq:"weekly",  dia:5,    icon:"💸", cat:"pagamentos", desc:"Pagamentos via PIX" },
  { id:"pix_fornecedor",  label:"PIX — Fornecedores",           freq:"weekly",  dia:5,    icon:"💸", cat:"pagamentos", desc:"Pagamentos a fornecedores" },
  { id:"iss",             label:"ISS",                          freq:"monthly", dia:10,   icon:"🏛️", cat:"fiscal",     desc:"Pagamento ISS Municipal" },
  { id:"inss",            label:"INSS",                         freq:"monthly", dia:20,   icon:"🏛️", cat:"fiscal",     desc:"Pagamento INSS" },
  { id:"fgts",            label:"FGTS",                         freq:"monthly", dia:20,   icon:"🏛️", cat:"fiscal",     desc:"Recolhimento FGTS" },
  { id:"das",             label:"DAS — Simples Nacional",       freq:"monthly", dia:20,   icon:"📋", cat:"fiscal",     desc:"Guia DAS" },
  { id:"conciliacao",     label:"Conciliação Bancária",         freq:"monthly", dia:5,    icon:"🏦", cat:"bancario",   desc:"Extrato vs lançamentos" },
  { id:"folha",           label:"Folha de Pagamento",           freq:"monthly", dia:25,   icon:"👥", cat:"rh",         desc:"Processar folha" },
  { id:"dre",             label:"DRE — Demonstrativo",         freq:"monthly", dia:10,   icon:"📈", cat:"relatorio",  desc:"Resultado do mês" },
  { id:"relatorio_ger",   label:"Relatório Gerencial",          freq:"monthly", dia:10,   icon:"📋", cat:"relatorio",  desc:"Relatório de gestão" },
  { id:"inadimplencia",   label:"Inadimplência",                freq:"monthly", dia:8,    icon:"⚠️", cat:"cobranca",   desc:"Recebimentos em atraso" },
];

const REGIMES = ["MEI","Simples Nacional","Lucro Presumido","Lucro Real","Imune / Isenta"];
const WDAYS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const CLIENT_COLORS = ["#c9a96e","#10b981","#6366f1","#ef4444","#f59e0b","#3b82f6","#ec4899","#8b5cf6","#f97316","#14b8a6"];

// ─── UTILS ────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2,9);
const todayStr = () => new Date().toISOString().slice(0,10);
const fmtDate = d => d ? new Date(d+"T12:00:00").toLocaleDateString("pt-BR") : "—";
const daysLeft = d => Math.ceil((new Date(d+"T12:00:00")-Date.now())/86400000);
const addMonths = (d,n) => { const x=new Date(d+"T12:00:00"); x.setMonth(x.getMonth()+n); return x.toISOString().slice(0,10); };
const clientColor = i => CLIENT_COLORS[i % CLIENT_COLORS.length];
const maskPhone = v => { const d=v.replace(/\D/g,"").slice(0,11); return d.length<=10?d.replace(/^(\d{2})(\d)/,"($1) $2").replace(/(\d{4})(\d)/,"$1-$2"):d.replace(/^(\d{2})(\d)/,"($1) $2").replace(/(\d{5})(\d)/,"$1-$2"); };
const maskCNPJ = v => v.replace(/\D/g,"").slice(0,14).replace(/^(\d{2})(\d)/,"$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3").replace(/\.(\d{3})(\d)/,".$1/$2").replace(/(\d{4})(\d)/,"$1-$2");

// Storage
const DB = {
  get: (k,def) => { try { const r=localStorage.getItem(k); return r?JSON.parse(r):def; } catch(e){ return def; } },
  set: (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); } catch(e){} },
};

// Google Calendar
const openCalendar = (title,date,time,notes) => {
  const d=date||todayStr(), t=time||"09:00";
  const fmt = x=>x.toISOString().replace(/[-:]/g,"").split(".")[0]+"Z";
  const s=new Date(`${d}T${t}:00`), e=new Date(s.getTime()+3600000);
  const p=new URLSearchParams({action:"TEMPLATE",text:title,dates:`${fmt(s)}/${fmt(e)}`,details:notes||"",add:"danimcustodiof@gmail.com,mvmcustodio@gmail.com"});
  window.open(`https://calendar.google.com/calendar/u/0/r/eventedit?${p}`,"_blank");
};
const openReminder = (title,date,notes) => {
  const d=(date||todayStr()).replace(/-/g,"");
  const next=new Date((date||todayStr())+"T12:00:00"); next.setDate(next.getDate()+1);
  const d2=next.toISOString().slice(0,10).replace(/-/g,"");
  const p=new URLSearchParams({action:"TEMPLATE",text:"🔔 "+title,dates:`${d}/${d2}`,details:notes||""});
  window.open(`https://calendar.google.com/calendar/u/0/r/eventedit?${p}`,"_blank");
};

// ─── LOGOS ────────────────────────────────────────────────────
function VLogo({size=40}){return(<svg width={size} height={size} viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#9b7d5c"/><defs><linearGradient id="gv"><stop offset="0%" stopColor="#e4ce90"/><stop offset="100%" stopColor="#a07840"/></linearGradient></defs><path d="M27 25 C14 12 9 20 17 28 C21 32 35 48 50 76" stroke="url(#gv)" strokeWidth="4" fill="none" strokeLinecap="round"/><path d="M50 76 C62 50 70 33 76 23 C80 15 87 11 81 18 C77 23 74 19 78 13" stroke="url(#gv)" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>);}
function RLogo({size=40}){return(<svg width={size} height={size} viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#152844"/><defs><linearGradient id="gr"><stop offset="0%" stopColor="#eedba8"/><stop offset="100%" stopColor="#9a7a3a"/></linearGradient></defs><line x1="25" y1="20" x2="25" y2="80" stroke="white" strokeWidth="7" strokeLinecap="round"/><path d="M25 20 C25 20 63 20 63 38 C63 56 25 56 25 56" stroke="white" strokeWidth="7" fill="none" strokeLinecap="round"/><line x1="37" y1="56" x2="68" y2="80" stroke="white" strokeWidth="7" strokeLinecap="round"/><path d="M31 24 L57 24 L44 41 Z" fill="url(#gr)"/><path d="M44 41 L31 55 L57 55 Z" fill="url(#gr)" opacity=".85"/></svg>);}

// ─── APP ROOT ─────────────────────────────────────────────────
export default function App(){
  const [user,setUser]=useState(null);
  const [co,setCo]=useState(null);
  const [mod,setMod]=useState("dashboard");
  const [toast,setToast]=useState(null);
  const [clients,setClients]=useState(()=>DB.get("gp2_clients",[]));
  const [agenda,setAgenda]=useState(()=>DB.get("gp2_agenda",[]));
  const [bpo,setBpo]=useState(()=>DB.get("gp2_bpo",[]));

  const showToast=(msg,type="ok")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),2800); };

  const saveClients=v=>{ setClients(v); DB.set("gp2_clients",v); showToast("✅ Salvo!"); };
  const saveAgenda=v=>{ setAgenda(v); DB.set("gp2_agenda",v); };
  const saveBpo=v=>{ setBpo(v); DB.set("gp2_bpo",v); showToast("✅ Salvo!"); };

  const doExport=()=>{
    const data={clients,agenda,bpo,exportedAt:new Date().toISOString()};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download=`gestorpro_backup_${todayStr()}.json`; a.click();
    URL.revokeObjectURL(url); showToast("✅ Backup exportado!");
  };
  const doImport=()=>{
    const input=document.createElement("input"); input.type="file"; input.accept=".json";
    input.onchange=e=>{
      const file=e.target.files[0]; if(!file)return;
      const reader=new FileReader();
      reader.onload=ev=>{ try{
        const d=JSON.parse(ev.target.result);
        if(d.clients){ setClients(d.clients); DB.set("gp2_clients",d.clients); }
        if(d.agenda){ setAgenda(d.agenda); DB.set("gp2_agenda",d.agenda); }
        if(d.bpo){ setBpo(d.bpo); DB.set("gp2_bpo",d.bpo); }
        showToast("✅ Dados restaurados!");
      }catch(err){ showToast("❌ Arquivo inválido","err"); }};
      reader.readAsText(file);
    }; input.click();
  };

  if(!user) return <Login onLogin={(u)=>{ setUser(u); const a=USERS[u].access[0]; setCo(a); setMod("dashboard"); }}/>;

  const brand=BRANDS[co];
  const acc=USERS[user].access;
  const coClients=clients.filter(c=>c.co===co);

  return(
    <div style={{background:"#080810",minHeight:"100vh",color:"#e2e8f0",fontFamily:"system-ui,sans-serif"}}>
      <TopBar user={user} co={co} setCo={v=>{setCo(v);setMod("dashboard");}} acc={acc} mod={mod} setMod={setMod} brand={brand} onLogout={()=>{setUser(null);setCo(null);}} onExport={doExport} onImport={doImport}/>
      {toast&&<Toast toast={toast}/>}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"24px 16px"}}>
        {/* RECORD */}
        {co==="record"&&mod==="dashboard"&&<RecordDashboard clients={coClients} agenda={agenda} brand={brand} setMod={setMod}/>}
        {co==="record"&&mod==="clientes"&&<ClientesTab clients={coClients} allClients={clients} onSave={saveClients} brand={brand} co={co} agenda={agenda} onSaveAgenda={saveAgenda}/>}
        {co==="record"&&mod==="agenda"&&<AgendaTab agenda={agenda} onSave={saveAgenda} brand={brand} showToast={showToast}/>}
        {/* VERITAS */}
        {co==="veritas"&&mod==="dashboard"&&<VeritasDashboard bpo={bpo} brand={brand} onSave={saveBpo}/>}
        {co==="veritas"&&mod==="clientes"&&<BpoTab bpo={bpo} onSave={saveBpo} brand={brand}/>}
        {co==="veritas"&&mod==="agenda"&&<AgendaTab agenda={agenda} onSave={saveAgenda} brand={brand} showToast={showToast}/>}
      </div>
    </div>
  );
}

// ─── TOP BAR ─────────────────────────────────────────────────
function TopBar({user,co,setCo,acc,mod,setMod,brand,onLogout,onExport,onImport}){
  const ac=brand?.c||"#c9a96e";
  const mods=co==="veritas"
    ?[{id:"dashboard",label:"🏠 Início"},{id:"clientes",label:"👥 Clientes BPO"},{id:"agenda",label:"🗓️ Agenda"}]
    :[{id:"dashboard",label:"🏠 Início"},{id:"clientes",label:"👥 Clientes"},{id:"agenda",label:"🗓️ Agenda"}];
  return(
    <div style={{background:"#0c0c18",borderBottom:"1px solid #171728",padding:"0 20px",position:"sticky",top:0,zIndex:100}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",gap:12,height:54}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {co==="veritas"?<VLogo size={30}/>:<RLogo size={30}/>}
          <span style={{fontWeight:800,fontSize:14,color:"#fff"}}>GestorPro</span>
        </div>
        {acc.length>1&&(
          <div style={{display:"flex",gap:2,background:"#111120",borderRadius:8,padding:3}}>
            {acc.map(a=><button key={a} onClick={()=>setCo(a)} style={{padding:"4px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:co===a?700:400,background:co===a?BRANDS[a].c:"transparent",color:co===a?"#fff":"#64748b"}}>{BRANDS[a].short}</button>)}
          </div>
        )}
        <nav style={{display:"flex",gap:2,flex:1}}>
          {mods.map(m=><button key={m.id} onClick={()=>setMod(m.id)} style={{padding:"6px 14px",borderRadius:7,border:"none",cursor:"pointer",fontSize:12,fontWeight:mod===m.id?600:400,background:mod===m.id?ac+"22":"transparent",color:mod===m.id?ac:"#64748b",borderBottom:mod===m.id?`2px solid ${ac}`:"2px solid transparent"}}>{m.label}</button>)}
        </nav>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <button onClick={onExport} style={{background:"#0a1a0a",border:"1px solid #1a4a1a",borderRadius:6,padding:"5px 10px",color:"#4ade80",cursor:"pointer",fontSize:11,fontWeight:600}}>⬇️ Backup</button>
          <button onClick={onImport} style={{background:"#0a0a1a",border:"1px solid #1a1a4a",borderRadius:6,padding:"5px 10px",color:"#818cf8",cursor:"pointer",fontSize:11,fontWeight:600}}>⬆️ Restaurar</button>
          <span style={{fontSize:11,color:"#475569",paddingLeft:6,borderLeft:"1px solid #1e1e35"}}>{USERS[user]?.name}</span>
          <button onClick={onLogout} style={{background:"#111120",border:"1px solid #1e1e35",borderRadius:6,padding:"5px 10px",color:"#94a3b8",cursor:"pointer",fontSize:11}}>Sair</button>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────
function Login({onLogin}){
  const [u,setU]=useState(""); const [p,setP]=useState(""); const [err,setErr]=useState("");
  const go=()=>{ if(USERS[u]&&USERS[u].pw===p) onLogin(u); else setErr("Usuário ou senha incorretos."); };
  const VH="#c9a96e", RC="#2a4a8a";
  return(
    <div style={{minHeight:"100vh",background:"#07070e",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui"}}>
      <div style={{width:420,background:"#0c0c14",border:"1px solid #13131f",borderRadius:20,padding:"40px 44px",boxShadow:"0 40px 80px rgba(0,0,0,.6)"}}>
        <div style={{display:"flex",justifyContent:"center",gap:16,marginBottom:28}}>
          <RLogo size={48}/><VLogo size={48}/>
        </div>
        <h1 style={{textAlign:"center",margin:"0 0 4px",fontSize:22,fontWeight:800,color:"#fff"}}>GestorPro</h1>
        <p style={{textAlign:"center",color:"#3a3a5a",fontSize:13,margin:"0 0 28px"}}>Record &amp; Veritas · Sistema Interno</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
          {Object.entries(USERS).map(([id,u])=>(
            <button key={id} onClick={()=>setU(id)} style={{padding:"10px 12px",borderRadius:10,border:`1px solid ${u===id?VH+"66":"#1a1a2a"}`,background:u===id?`${VH}12`:"#111118",color:u===id?"#f5f0e6":"#475569",cursor:"pointer",textAlign:"left",fontSize:13,fontWeight:u===id?700:400}}>
              {USERS[id].name}
            </button>
          ))}
        </div>
        <div style={{height:1,background:"#13131f",marginBottom:16}}/>
        {[["Usuário",u,setU,"text"],["Senha",p,setP,"password"]].map(([lbl,val,set,type])=>(
          <div key={lbl} style={{marginBottom:12}}>
            <label style={{fontSize:10,color:"#3a3a55",display:"block",marginBottom:5,fontWeight:700,letterSpacing:"1px"}}>{lbl.toUpperCase()}</label>
            <input value={val} onChange={e=>set(e.target.value)} type={type} onKeyDown={e=>e.key==="Enter"&&go()} style={{width:"100%",background:"#111118",border:"1px solid #1a1a28",borderRadius:10,padding:"11px 14px",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
          </div>
        ))}
        {err&&<div style={{background:"#2a0a0a",border:"1px solid #5a1a1a",borderRadius:8,padding:"8px 14px",marginBottom:12,color:"#f87171",fontSize:13}}>⚠️ {err}</div>}
        <button onClick={go} style={{width:"100%",background:`linear-gradient(135deg,${VH},#8f775f)`,border:"none",borderRadius:12,padding:"13px",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",marginTop:4}}>Entrar →</button>
      </div>
    </div>
  );
}

function Toast({toast}){const ok=toast.type==="ok";return(<div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:ok?"#0a2a0f":"#2a0a0a",border:`1px solid ${ok?"#4ade80":"#f87171"}`,color:ok?"#4ade80":"#f87171",padding:"11px 24px",borderRadius:12,fontSize:13,fontWeight:600,zIndex:9999,whiteSpace:"nowrap",boxShadow:"0 8px 32px rgba(0,0,0,.4)"}}>{toast.msg}</div>);}

// ─── RECORD DASHBOARD ─────────────────────────────────────────
function RecordDashboard({clients,agenda,brand,setMod}){
  const ac=brand.c; const today=todayStr();
  const todayEvts=agenda.filter(e=>e.date===today&&!e.done);
  const pendingOnboarding=clients.filter(c=>{ const done=STAGES.filter(s=>c.stages?.[s.id]?.done).length; return done<STAGES.length; });
  const nextMeetings=agenda.filter(e=>e.date>=today&&e.type==="reuniao").sort((a,b)=>a.date>b.date?1:-1).slice(0,5);
  return(
    <div>
      <div style={{marginBottom:24}}>
        <h2 style={{margin:"0 0 4px",fontSize:22,fontWeight:800,color:"#fff"}}>Bom dia! 👋</h2>
        <p style={{margin:0,color:"#475569",fontSize:14}}>{new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
        {[
          {label:"Clientes Ativos",value:clients.length,icon:"👥",color:"#6366f1",click:()=>setMod("clientes")},
          {label:"Onboarding em andamento",value:pendingOnboarding.length,icon:"🔄",color:"#f59e0b",click:()=>setMod("clientes")},
          {label:"Eventos hoje",value:todayEvts.length,icon:"📅",color:ac,click:()=>setMod("agenda")},
        ].map(card=>(
          <div key={card.label} onClick={card.click} style={{background:"#0f0f1c",border:`1px solid ${card.color}33`,borderRadius:14,padding:"20px 18px",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor=card.color} onMouseLeave={e=>e.currentTarget.style.borderColor=card.color+"33"}>
            <div style={{fontSize:28,marginBottom:8}}>{card.icon}</div>
            <div style={{fontSize:32,fontWeight:800,color:card.color}}>{card.value}</div>
            <div style={{fontSize:13,color:"#64748b",marginTop:4}}>{card.label}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:14,padding:18}}>
          <p style={{margin:"0 0 14px",fontWeight:700,color:"#fff",fontSize:14}}>📌 Hoje na agenda</p>
          {todayEvts.length===0?<p style={{color:"#2a2a45",fontSize:13}}>Nenhum evento hoje.</p>:todayEvts.map(e=>(
            <div key={e.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #1a1a2e"}}>
              <span style={{fontSize:16}}>{e.type==="reuniao"?"🤝":e.type==="tarefa"?"✅":"🔔"}</span>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{e.title}</div>{e.time&&<div style={{fontSize:11,color:"#64748b"}}>{e.time}</div>}</div>
              {e.type==="reuniao"&&<button onClick={()=>openCalendar(e.title,e.date,e.time,e.notes||"")} style={{background:"none",border:"none",color:ac,cursor:"pointer",fontSize:12}}>📅</button>}
            </div>
          ))}
        </div>
        <div style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:14,padding:18}}>
          <p style={{margin:"0 0 14px",fontWeight:700,color:"#fff",fontSize:14}}>🔄 Onboarding em andamento</p>
          {pendingOnboarding.length===0?<p style={{color:"#2a2a45",fontSize:13}}>Todos os clientes finalizados! 🎉</p>:pendingOnboarding.slice(0,6).map(c=>{
            const done=STAGES.filter(s=>c.stages?.[s.id]?.done).length;
            const pct=Math.round(done/STAGES.length*100);
            return(<div key={c.id} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,color:"#e2e8f0",fontWeight:600}}>{c.name}</span><span style={{fontSize:11,color:"#64748b"}}>{pct}%</span></div>
              <div style={{background:"#1a1a2e",borderRadius:20,height:4}}><div style={{background:ac,height:"100%",width:`${pct}%`,borderRadius:20,transition:"width .3s"}}/></div>
            </div>);
          })}
        </div>
      </div>
    </div>
  );
}

// ─── CLIENTES TAB (RECORD) ────────────────────────────────────
function ClientesTab({clients,allClients,onSave,brand,co,agenda,onSaveAgenda}){
  const [sel,setSel]=useState(null); const [showAdd,setShowAdd]=useState(false);
  const [search,setSearch]=useState(""); const ac=brand.c;
  const filtered=clients.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));
  const addClient=form=>{
    const docs=(form.type==="transfer"?DOCS_TRANSFER:DOCS_CONSTITUTION).map(d=>({...d,done:false}));
    onSave([...allClients,{id:uid(),co,name:form.name,type:form.type,regime:form.regime,cnpj:form.cnpj,phone:form.phone,email:form.email,since:todayStr(),stages:{},docs}]);
    setShowAdd(false);
  };
  const updateStage=(cid,sid,patch)=>onSave(allClients.map(c=>c.id===cid?{...c,stages:{...c.stages,[sid]:{...c.stages[sid],...patch}}}:c));
  const updateDocs=(cid,docs)=>onSave(allClients.map(c=>c.id===cid?{...c,docs}:c));
  const updateClient=(cid,patch)=>onSave(allClients.map(c=>c.id===cid?{...c,...patch}:c));
  const delClient=cid=>{ if(window.confirm("Remover cliente?")) onSave(allClients.filter(c=>c.id!==cid)); setSel(null); };
  const selC=clients.find(c=>c.id===sel);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#fff"}}>Clientes — Onboarding</h2><p style={{margin:"4px 0 0",color:"#475569",fontSize:13}}>{clients.length} cliente(s) cadastrado(s)</p></div>
        <Btn ac={ac} onClick={()=>setShowAdd(true)}>+ Novo Cliente</Btn>
      </div>
      {showAdd&&<Modal title="Novo Cliente" onClose={()=>setShowAdd(false)} wide><AddClientForm onSave={addClient} ac={ac}/></Modal>}
      {sel&&selC?(
        <ClientDetail client={selC} onBack={()=>setSel(null)} onUpdateStage={updateStage} onUpdateDocs={updateDocs} onUpdateClient={updateClient} onDelete={delClient} ac={ac} brand={brand} agenda={agenda} onSaveAgenda={onSaveAgenda}/>
      ):(
        <div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Buscar cliente..." style={{width:"100%",background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:10,padding:"10px 14px",color:"#fff",fontSize:14,marginBottom:16,boxSizing:"border-box",outline:"none"}}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
            {filtered.length===0&&<Empty text="Nenhum cliente encontrado"/>}
            {filtered.map(c=>{
              const done=STAGES.filter(s=>c.stages?.[s.id]?.done).length;
              const pct=Math.round(done/STAGES.length*100);
              return(
                <div key={c.id} onClick={()=>setSel(c.id)} style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:14,padding:18,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor=ac} onMouseLeave={e=>e.currentTarget.style.borderColor="#1a1a2e"}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                    <div>
                      <div style={{fontWeight:700,color:"#fff",fontSize:15,marginBottom:4}}>{c.name}</div>
                      <span style={{fontSize:11,background:"#1a1a2e",color:"#64748b",padding:"2px 8px",borderRadius:20}}>{c.type==="transfer"?"Transferência":"Constituição"}</span>
                    </div>
                    <span style={{background:pct===100?"#14532d":ac+"22",color:pct===100?"#4ade80":ac,fontSize:13,padding:"4px 10px",borderRadius:20,fontWeight:700,height:"fit-content"}}>{pct}%</span>
                  </div>
                  <div style={{background:"#1a1a2e",borderRadius:20,height:5,overflow:"hidden",marginBottom:12}}><div style={{background:ac,height:"100%",width:`${pct}%`,borderRadius:20,transition:"width .3s"}}/></div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {STAGES.map(s=><span key={s.id} title={s.label} style={{fontSize:16,opacity:c.stages?.[s.id]?.done?1:0.2}}>{s.icon}</span>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function AddClientForm({onSave,ac}){
  const [form,setForm]=useState({name:"",type:"transfer",regime:"",cnpj:"",phone:"",email:""});
  const s=v=>setForm(f=>({...f,...v}));
  return(<div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="Razão Social" style={{gridColumn:"1/-1"}}><Inp value={form.name} onChange={v=>s({name:v})} placeholder="Nome da empresa"/></Field>
      <Field label="Tipo"><Sel value={form.type} onChange={v=>s({type:v})} opts={[["transfer","Transferência de Escritório"],["constitution","Constituição de Empresa"]]}/></Field>
      <Field label="Regime Tributário"><Sel value={form.regime} onChange={v=>s({regime:v})} opts={[["","Selecione..."],...REGIMES.map(r=>[r,r])]}/></Field>
      <Field label="CNPJ"><Inp value={form.cnpj} onChange={v=>s({cnpj:maskCNPJ(v)})} placeholder="00.000.000/0000-00"/></Field>
      <Field label="Telefone"><Inp value={form.phone} onChange={v=>s({phone:maskPhone(v)})} placeholder="(43) 00000-0000"/></Field>
      <Field label="E-mail" style={{gridColumn:"1/-1"}}><Inp value={form.email} onChange={v=>s({email:v})} placeholder="contato@empresa.com"/></Field>
    </div>
    <Btn ac={ac} full onClick={()=>form.name.trim()&&onSave(form)}>Criar Cliente</Btn>
  </div>);
}

// ─── CLIENT DETAIL ────────────────────────────────────────────
function ClientDetail({client,onBack,onUpdateStage,onUpdateDocs,onUpdateClient,onDelete,ac,brand,agenda,onSaveAgenda}){
  const [tab,setTab]=useState("onboarding");
  const done=STAGES.filter(s=>client.stages?.[s.id]?.done).length;
  const pct=Math.round(done/STAGES.length*100);
  return(
    <div>
      <button onClick={onBack} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:14,marginBottom:18,padding:0,display:"flex",alignItems:"center",gap:6}}>← Voltar para clientes</button>
      {/* Header */}
      <div style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:14,padding:20,marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <h2 style={{margin:"0 0 6px",fontSize:20,fontWeight:800,color:"#fff"}}>{client.name}</h2>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <span style={{fontSize:11,background:"#1a1a2e",color:"#94a3b8",padding:"2px 10px",borderRadius:20}}>{client.type==="transfer"?"Transferência":"Constituição"}</span>
              {client.regime&&<span style={{fontSize:11,background:`${ac}22`,color:ac,padding:"2px 10px",borderRadius:20}}>{client.regime}</span>}
              {client.cnpj&&<span style={{fontSize:11,color:"#64748b"}}>{client.cnpj}</span>}
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{background:pct===100?"#14532d":ac+"22",color:pct===100?"#4ade80":ac,fontSize:14,padding:"6px 14px",borderRadius:20,fontWeight:800}}>{pct}% concluído</span>
            <button onClick={()=>onDelete(client.id)} style={{background:"#450a0a",border:"none",borderRadius:8,padding:"6px 12px",color:"#f87171",cursor:"pointer",fontSize:12}}>🗑️</button>
          </div>
        </div>
        <div style={{background:"#1a1a2e",borderRadius:20,height:6,overflow:"hidden",marginTop:14}}><div style={{background:ac,height:"100%",width:`${pct}%`,borderRadius:20,transition:"width .4s"}}/></div>
      </div>
      {/* Tabs */}
      <div style={{display:"flex",gap:2,background:"#0f0f1c",borderRadius:10,padding:4,marginBottom:20,width:"fit-content"}}>
        {[["onboarding","🔄 Onboarding"],["dados","📋 Dados do Cliente"]].map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)} style={{padding:"7px 16px",borderRadius:7,border:"none",cursor:"pointer",fontSize:12,fontWeight:tab===v?700:400,background:tab===v?ac:"transparent",color:tab===v?"#fff":"#64748b"}}>{l}</button>
        ))}
      </div>
      {tab==="onboarding"&&<OnboardingStages client={client} onUpdateStage={onUpdateStage} onUpdateDocs={onUpdateDocs} ac={ac} agenda={agenda} onSaveAgenda={onSaveAgenda}/>}
      {tab==="dados"&&<ClientDados client={client} onUpdate={patch=>onUpdateClient(client.id,patch)} ac={ac}/>}
    </div>
  );
}

function ClientDados({client,onUpdate,ac}){
  const [form,setForm]=useState({name:client.name||"",cnpj:client.cnpj||"",phone:client.phone||"",email:client.email||"",regime:client.regime||"",obs:client.obs||""});
  const s=v=>setForm(f=>({...f,...v}));
  return(<div style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:14,padding:20}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="Razão Social" style={{gridColumn:"1/-1"}}><Inp value={form.name} onChange={v=>s({name:v})}/></Field>
      <Field label="CNPJ"><Inp value={form.cnpj} onChange={v=>s({cnpj:maskCNPJ(v)})}/></Field>
      <Field label="Regime Tributário"><Sel value={form.regime} onChange={v=>s({regime:v})} opts={[["","Selecione..."],...REGIMES.map(r=>[r,r])]}/></Field>
      <Field label="Telefone"><Inp value={form.phone} onChange={v=>s({phone:maskPhone(v)})}/></Field>
      <Field label="E-mail"><Inp value={form.email} onChange={v=>s({email:v})}/></Field>
      <Field label="Observações" style={{gridColumn:"1/-1"}}><textarea value={form.obs} onChange={e=>s({obs:e.target.value})} rows={3} style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"9px 12px",color:"#e2e8f0",fontSize:13,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}}/></Field>
    </div>
    <Btn ac={ac} onClick={()=>onUpdate(form)}>💾 Salvar Dados</Btn>
  </div>);
}

// ─── ONBOARDING STAGES ────────────────────────────────────────
function OnboardingStages({client,onUpdateStage,onUpdateDocs,ac,agenda,onSaveAgenda}){

  // Sincroniza reunião/evento com a Agenda do app automaticamente
  const syncToAgenda=(stageId,date,time,title,type="reuniao")=>{
    if(!date||!onSaveAgenda) return;
    const evId=`stage_${client.id}_${stageId}`;
    const evTitle=`${title} — ${client.name}`;
    const existing=(agenda||[]).filter(e=>e.id!==evId);
    const newEv={id:evId,title:evTitle,date,time:time||"",type,participant:client.name,participantType:"cliente",notes:`Cliente: ${client.name}`,done:false,fromStage:true};
    onSaveAgenda([...existing,newEv]);
  };
  const [open,setOpen]=useState(null);
  const [showPwd,setShowPwd]=useState({});
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {STAGES.map(s=>{
        const stage=client.stages?.[s.id]||{};
        const isOpen=open===s.id;
        return(
          <div key={s.id} style={{background:"#0f0f1c",border:`1px solid ${stage.done?"#1a4a2e":"#1a1a2e"}`,borderRadius:14,overflow:"hidden"}}>
            {/* Stage header */}
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",cursor:"pointer"}} onClick={()=>setOpen(isOpen?null:s.id)}>
              <div onClick={e=>{e.stopPropagation();onUpdateStage(client.id,s.id,{done:!stage.done,doneAt:!stage.done?todayStr():null});}} style={{width:24,height:24,borderRadius:7,border:`2px solid ${stage.done?ac:"#2a2a45"}`,background:stage.done?ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
                {stage.done&&<span style={{color:"#fff",fontSize:13,fontWeight:700}}>✓</span>}
              </div>
              <span style={{fontSize:22}}>{s.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,color:stage.done?"#4ade80":"#fff",fontSize:14,textDecoration:stage.done?"line-through":"none"}}>{s.label}</div>
                <div style={{fontSize:11,color:"#475569"}}>{stage.done?`Concluído em ${fmtDate(stage.doneAt)}`:s.desc}</div>
              </div>
              <span style={{color:"#2a2a45",fontSize:12,transform:isOpen?"rotate(180deg)":"none",display:"inline-block",transition:"transform .2s"}}>▼</span>
            </div>
            {/* Stage content */}
            {isOpen&&(
              <div style={{borderTop:"1px solid #1a1a2e",background:"#0a0a14"}}>
                {/* Documentação */}
                {s.id==="documentacao"&&(
                  <div style={{padding:16}}>
                    <p style={{fontSize:11,fontWeight:700,color:"#64748b",margin:"0 0 12px",letterSpacing:"1px"}}>DOCUMENTOS — {client.type==="transfer"?"Transferência":"Constituição"}</p>
                    {(client.docs||[]).map((doc,i)=>(
                      <div key={doc.id} onClick={()=>{const docs=[...client.docs];docs[i]={...doc,done:!doc.done,doneAt:!doc.done?todayStr():null};onUpdateDocs(client.id,docs);}} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,background:doc.done?"#0a1a0a":"#111120",marginBottom:5,cursor:"pointer",border:`1px solid ${doc.done?"#1a4a2e":"#1a1a2e"}`}}>
                        <div style={{width:18,height:18,borderRadius:5,border:`2px solid ${doc.done?ac:"#2a2a45"}`,background:doc.done?ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          {doc.done&&<span style={{color:"#fff",fontSize:10,fontWeight:700}}>✓</span>}
                        </div>
                        <span style={{fontSize:13,color:doc.done?"#4ade80":"#e2e8f0",textDecoration:doc.done?"line-through":"none",flex:1}}>{doc.label}</span>
                        {doc.done&&<span style={{fontSize:10,color:"#475569"}}>{fmtDate(doc.doneAt)}</span>}
                      </div>
                    ))}
                    <div style={{marginTop:12,padding:"8px 12px",background:"#111120",borderRadius:8,fontSize:12,color:"#64748b"}}>
                      {(client.docs||[]).filter(d=>d.done).length}/{(client.docs||[]).length} documentos recebidos
                    </div>
                    <div style={{marginTop:10}}>
                      <Field label="Observações"><textarea value={stage.notes||""} onChange={e=>onUpdateStage(client.id,s.id,{notes:e.target.value})} rows={2} style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"8px 12px",color:"#e2e8f0",fontSize:13,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}}/></Field>
                    </div>
                  </div>
                )}
                {/* Sistema com acesso (Domínio e Zappy) */}
                {(s.id==="dominio"||s.id==="zappy")&&(
                  <div style={{padding:16}}>
                    <p style={{fontSize:11,fontWeight:700,color:"#64748b",margin:"0 0 12px",letterSpacing:"1px"}}>🔐 DADOS DE ACESSO — {s.label}</p>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      <Field label="URL / Sistema" style={{gridColumn:"1/-1"}}><Inp value={stage.url||""} onChange={v=>onUpdateStage(client.id,s.id,{url:v})} placeholder="https://..."/></Field>
                      <Field label="Usuário / Login"><Inp value={stage.usuario||""} onChange={v=>onUpdateStage(client.id,s.id,{usuario:v})} placeholder="login ou CPF"/></Field>
                      <Field label="Senha">
                        <div style={{position:"relative"}}>
                          <input value={stage.senha||""} onChange={e=>onUpdateStage(client.id,s.id,{senha:e.target.value})} type={showPwd[s.id]?"text":"password"} placeholder="••••••••" style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"9px 40px 9px 12px",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
                          <button onClick={()=>setShowPwd(p=>({...p,[s.id]:!p[s.id]}))} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:16,padding:0}}>{showPwd[s.id]?"🙈":"👁️"}</button>
                        </div>
                      </Field>
                      <Field label="Código / Empresa"><Inp value={stage.codigo||""} onChange={v=>onUpdateStage(client.id,s.id,{codigo:v})} placeholder="Código da empresa no sistema"/></Field>
                      <Field label="Versão / Plano"><Inp value={stage.plano||""} onChange={v=>onUpdateStage(client.id,s.id,{plano:v})} placeholder="Ex: Domínio v8, Plano Pro"/></Field>
                      <Field label="Observações" style={{gridColumn:"1/-1"}}><textarea value={stage.obs||""} onChange={e=>onUpdateStage(client.id,s.id,{obs:e.target.value})} rows={2} style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"8px 12px",color:"#e2e8f0",fontSize:13,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}}/></Field>
                    </div>
                  </div>
                )}
                {/* Reuniões */}
                {(s.id==="reuniao_mes1"||s.id==="reuniao_trimestral"||s.id==="reuniao_semestral")&&(
                  <div style={{padding:16}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      <Field label="Data da Reunião"><Inp type="date" value={stage.date||""} onChange={v=>{const patch={date:v};if(s.id==="reuniao_trimestral"&&v)patch.nextDate=addMonths(v,3);if(s.id==="reuniao_semestral"&&v)patch.nextDate=addMonths(v,6);onUpdateStage(client.id,s.id,patch);if(v)syncToAgenda(s.id,v,stage.time||"",s.label,"reuniao");}}/></Field>
                      <Field label="Horário"><Inp type="time" value={stage.time||""} onChange={v=>onUpdateStage(client.id,s.id,{time:v})}/></Field>
                      <Field label="Participantes" style={{gridColumn:"1/-1"}}><Inp value={stage.attendees||""} onChange={v=>onUpdateStage(client.id,s.id,{attendees:v})} placeholder="Daniela, Marcus, cliente..."/></Field>
                      <Field label="Observações / Pauta" style={{gridColumn:"1/-1"}}><textarea value={stage.notes||""} onChange={e=>onUpdateStage(client.id,s.id,{notes:e.target.value})} rows={2} style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"8px 12px",color:"#e2e8f0",fontSize:13,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}}/></Field>
                    </div>
                    {stage.date&&<button onClick={()=>openCalendar(`${s.label} — ${client.name}`,stage.date,stage.time||"09:00",stage.notes||"")} style={{background:"#0d1f0d",border:"none",borderRadius:8,padding:"8px 14px",color:"#4ade80",cursor:"pointer",fontSize:12,fontWeight:600,marginTop:4}}>📅 Criar no Google Agenda</button>}
                    {stage.nextDate&&<p style={{margin:"8px 0 0",fontSize:12,color:"#8b5cf6"}}>↻ Próxima: {fmtDate(stage.nextDate)}</p>}
                  </div>
                )}
                {/* Jantar e Kit */}
                {(s.id==="jantar"||s.id==="kit")&&(
                  <div style={{padding:16}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      <Field label="Data"><Inp type="date" value={stage.date||""} onChange={v=>{onUpdateStage(client.id,s.id,{date:v});if(v&&s.id==="jantar")syncToAgenda(s.id,v,stage.time||"20:00","Jantar de Boas-vindas","reuniao");}}/></Field>
                      <Field label="Horário"><Inp type="time" value={stage.time||""} onChange={v=>onUpdateStage(client.id,s.id,{time:v})}/></Field>
                      <Field label={s.id==="jantar"?"Local":"Itens do Kit"} style={{gridColumn:"1/-1"}}><Inp value={stage.local||""} onChange={v=>onUpdateStage(client.id,s.id,{local:v})} placeholder={s.id==="jantar"?"Restaurante, endereço...":"Caderno, caneta, folder..."}/></Field>
                      <Field label="Observações" style={{gridColumn:"1/-1"}}><textarea value={stage.notes||""} onChange={e=>onUpdateStage(client.id,s.id,{notes:e.target.value})} rows={2} style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"8px 12px",color:"#e2e8f0",fontSize:13,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}}/></Field>
                    </div>
                    {stage.date&&s.id==="jantar"&&<button onClick={()=>openCalendar(`Jantar de Boas-vindas — ${client.name}`,stage.date,stage.time||"20:00",stage.local||"")} style={{background:"#0d1f0d",border:"none",borderRadius:8,padding:"8px 14px",color:"#4ade80",cursor:"pointer",fontSize:12,fontWeight:600,marginTop:4}}>📅 Criar no Google Agenda</button>}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── AGENDA TAB ───────────────────────────────────────────────
function AgendaTab({agenda,onSave,brand,showToast}){
  const [view,setView]=useState("mes");
  const [showAdd,setShowAdd]=useState(false);
  const [sel,setSel]=useState(null);
  const [calRef,setCalRef]=useState(()=>{ const n=new Date(); return new Date(n.getFullYear(),n.getMonth(),1); });
  const ac=brand.c; const today=todayStr();
  const addEvt=form=>{ onSave([...agenda,{id:uid(),...form,done:false}]); setShowAdd(false); showToast("✅ Evento salvo!"); };
  const delEvt=id=>{ onSave(agenda.filter(e=>e.id!==id)); setSel(null); };
  const toggleDone=id=>onSave(agenda.map(e=>e.id===id?{...e,done:!e.done}:e));
  const y=calRef.getFullYear(),mo=calRef.getMonth(),fd=new Date(y,mo,1).getDay(),dim=new Date(y,mo+1,0).getDate();
  const dayMap={}; agenda.forEach(e=>{ dayMap[e.date]=[...(dayMap[e.date]||[]),e]; });
  const typeColor={reuniao:"#6366f1",tarefa:"#f59e0b",lembrete:"#c9a96e",outro:"#64748b"};
  const upcoming=agenda.filter(e=>e.date>=today&&!e.done).sort((a,b)=>a.date>b.date?1:-1);
  // Semana
  const startOfWeek=()=>{ const d=new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()-d.getDay()); return d; };
  const weekDays=Array.from({length:7},(_,i)=>{ const d=new Date(startOfWeek()); d.setDate(d.getDate()+i); return d.toISOString().slice(0,10); });
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#fff"}}>Agenda</h2><p style={{margin:"4px 0 0",color:"#475569",fontSize:13}}>Eventos do escritório e da equipe</p></div>
        <div style={{display:"flex",gap:8}}>
          <div style={{display:"flex",gap:2,background:"#0f0f1c",borderRadius:8,padding:3}}>
            {[["mes","📅 Mês"],["semana","📆 Semana"],["lista","📋 Lista"]].map(([v,l])=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:"5px 12px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:view===v?700:400,background:view===v?ac:"transparent",color:view===v?"#fff":"#64748b"}}>{l}</button>
            ))}
          </div>
          <Btn ac={ac} onClick={()=>setShowAdd(true)}>+ Evento</Btn>
        </div>
      </div>
      {showAdd&&<Modal title="Novo Evento" onClose={()=>setShowAdd(false)}><AddEventForm onSave={addEvt} ac={ac}/></Modal>}
      {sel&&<Modal title="Evento" onClose={()=>setSel(null)}>
        <div style={{background:"#1a1a2e",borderRadius:10,padding:16,marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <span style={{fontSize:20}}>{sel.type==="reuniao"?"🤝":sel.type==="tarefa"?"✅":"🔔"}</span>
            <div style={{fontWeight:700,color:"#fff",fontSize:17}}>{sel.title}</div>
          </div>
          {sel.participant&&<div style={{marginBottom:6}}><span style={{fontSize:11,background:"#252540",color:"#94a3b8",padding:"2px 8px",borderRadius:20,marginRight:8}}>{sel.participantType==="fornecedor"?"🏢 Fornecedor":sel.participantType==="colaborador"?"👔 Colaborador":sel.participantType==="cliente"?"🧾 Cliente":sel.participantType==="banco"?"🏦 Banco":"👤"}</span><span style={{color:"#e2e8f0",fontSize:14,fontWeight:600}}>{sel.participant}</span></div>}
          <div style={{color:"#64748b",fontSize:13}}>📅 {fmtDate(sel.date)}{sel.time&&<span style={{marginLeft:10}}>🕐 {sel.time}</span>}</div>
          {sel.notes&&<div style={{color:"#94a3b8",fontSize:13,marginTop:8,lineHeight:1.6}}>{sel.notes}</div>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <button onClick={()=>sel.type==="reuniao"?openCalendar(sel.title,sel.date,sel.time,[sel.participant&&`Com: ${sel.participant}`,sel.notes].filter(Boolean).join("\n")):openReminder(sel.title,sel.date,[sel.participant&&`Com: ${sel.participant}`,sel.notes].filter(Boolean).join("\n"))} style={{background:"#0d1f0d",border:"none",borderRadius:8,padding:"10px",color:"#4ade80",fontWeight:600,cursor:"pointer",fontSize:13}}>📅 {sel.type==="reuniao"?"Reunião no Google Cal":"Lembrete no Google Cal"}</button>
          <button onClick={()=>toggleDone(sel.id)} style={{background:sel.done?"#1a2a1a":"#1e3a5f",border:"none",borderRadius:8,padding:"10px",color:sel.done?"#4ade80":"#60a5fa",fontWeight:600,cursor:"pointer",fontSize:13}}>{sel.done?"↩️ Reabrir":"✅ Concluir"}</button>
          <button onClick={()=>delEvt(sel.id)} style={{background:"#450a0a",border:"none",borderRadius:8,padding:"10px",color:"#f87171",fontWeight:600,cursor:"pointer",fontSize:13}}>🗑️ Excluir</button>
          <button onClick={()=>setSel(null)} style={{background:"#1a1a2e",border:"none",borderRadius:8,padding:"10px",color:"#94a3b8",cursor:"pointer",fontSize:13}}>Fechar</button>
        </div>
      </Modal>}
      {/* Visão Mês */}
      {view==="mes"&&(<div style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:14,overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderBottom:"1px solid #1a1a2e",background:"#0c0c18"}}>
          <button onClick={()=>setCalRef(new Date(y,mo-1,1))} style={{background:"#1a1a2e",border:"none",borderRadius:7,padding:"6px 14px",color:"#94a3b8",cursor:"pointer",fontSize:16}}>‹</button>
          <div style={{fontWeight:800,fontSize:17,color:"#fff"}}>{calRef.toLocaleDateString("pt-BR",{month:"long",year:"numeric"}).replace(/^\w/,c=>c.toUpperCase())}</div>
          <button onClick={()=>setCalRef(new Date(y,mo+1,1))} style={{background:"#1a1a2e",border:"none",borderRadius:7,padding:"6px 14px",color:"#94a3b8",cursor:"pointer",fontSize:16}}>›</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:"1px solid #1a1a2e"}}>{WDAYS.map(d=><div key={d} style={{textAlign:"center",padding:"9px 4px",fontSize:11,fontWeight:700,color:"#475569"}}>{d}</div>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
          {Array.from({length:fd}).map((_,i)=><div key={`e${i}`} style={{minHeight:90,borderRight:"1px solid #141420",borderBottom:"1px solid #141420",background:"#09090f"}}/>)}
          {Array.from({length:dim},(_,i)=>i+1).map(d=>{
            const ds=`${y}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
            const evts=dayMap[ds]||[]; const isT=ds===today; const isWE=new Date(ds+"T12:00:00").getDay()%6===0; const isL=(fd+d-1)%7===6;
            return(<div key={d} style={{minHeight:90,borderRight:isL?"none":"1px solid #1a1a2e",borderBottom:"1px solid #1a1a2e",padding:"5px",background:isT?`${ac}14`:isWE?"#0a0a12":"transparent"}}>
              <div style={{display:"flex",justifyContent:"flex-end",marginBottom:3}}><span style={{fontSize:12,fontWeight:isT?800:400,color:isT?"#fff":"#64748b",background:isT?ac:"transparent",width:22,height:22,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center"}}>{d}</span></div>
              {evts.slice(0,3).map((e,i)=><div key={i} onClick={()=>setSel(e)} title={e.title} style={{background:(typeColor[e.type]||"#64748b")+"22",borderLeft:`3px solid ${e.done?"#475569":(typeColor[e.type]||"#64748b")}`,borderRadius:"0 3px 3px 0",padding:"1px 5px",marginBottom:2,fontSize:10,color:e.done?"#475569":(typeColor[e.type]||"#64748b"),fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",cursor:"pointer",textDecoration:e.done?"line-through":"none"}}>{e.title}</div>)}
              {evts.length>3&&<div style={{fontSize:9,color:"#475569",paddingLeft:5}}>+{evts.length-3}</div>}
            </div>);
          })}
        </div>
        <div style={{display:"flex",gap:14,padding:"10px 16px",borderTop:"1px solid #1a1a2e",flexWrap:"wrap"}}>
          {[["#6366f1","Reunião"],["#f59e0b","Tarefa"],["#c9a96e","Lembrete"],["#64748b","Outro"]].map(([c,l])=><div key={l} style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,borderRadius:2,background:c}}/><span style={{fontSize:11,color:"#475569"}}>{l}</span></div>)}
        </div>
      </div>)}
      {/* Visão Semana */}
      {view==="semana"&&(
        <div style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:14,overflow:"hidden"}}>
          <div style={{padding:"12px 18px",borderBottom:"1px solid #1a1a2e",background:"#0c0c18",fontWeight:700,color:"#fff",fontSize:14}}>Semana atual</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
            {weekDays.map(ds=>{
              const d=new Date(ds+"T12:00:00"); const isT=ds===today; const evts=dayMap[ds]||[];
              return(<div key={ds} style={{borderRight:"1px solid #1a1a2e",minHeight:200,padding:"10px 8px",background:isT?`${ac}10`:"transparent"}}>
                <div style={{textAlign:"center",marginBottom:8}}>
                  <div style={{fontSize:11,color:"#64748b",fontWeight:700}}>{WDAYS[d.getDay()]}</div>
                  <div style={{fontSize:20,fontWeight:800,color:isT?"#fff":"#475569",background:isT?ac:"transparent",width:32,height:32,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",margin:"2px auto"}}>{d.getDate()}</div>
                </div>
                {evts.map((e,i)=><div key={i} onClick={()=>setSel(e)} style={{background:(typeColor[e.type]||"#64748b")+"22",borderLeft:`3px solid ${e.done?"#475569":(typeColor[e.type]||"#64748b")}`,borderRadius:"0 5px 5px 0",padding:"4px 7px",marginBottom:4,fontSize:11,color:e.done?"#475569":(typeColor[e.type]||"#64748b"),cursor:"pointer",fontWeight:600,lineHeight:1.3,textDecoration:e.done?"line-through":"none"}}>{e.time&&<div style={{fontSize:10,opacity:0.7}}>{e.time}</div>}{e.title}</div>)}
              </div>);
            })}
          </div>
        </div>
      )}
      {/* Visão Lista */}
      {view==="lista"&&(
        <div>
          {upcoming.length===0&&<Empty text="Nenhum evento próximo"/>}
          {upcoming.map(e=>(
            <div key={e.id} onClick={()=>setSel(e)} style={{display:"flex",alignItems:"center",gap:12,background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:10,padding:"12px 16px",marginBottom:6,cursor:"pointer"}} onMouseEnter={ev=>ev.currentTarget.style.borderColor=ac} onMouseLeave={ev=>ev.currentTarget.style.borderColor="#1a1a2e"}>
              <span style={{fontSize:18}}>{e.type==="reuniao"?"🤝":e.type==="tarefa"?"✅":"🔔"}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,color:"#fff",fontSize:14}}>{e.title}</div>
                <div style={{color:"#64748b",fontSize:12}}>{fmtDate(e.date)}{e.time&&` às ${e.time}`}{e.participant&&<span style={{marginLeft:8,color:"#94a3b8"}}>· {e.participant}</span>}</div>
              </div>
              {daysLeft(e.date)===0&&<span style={{background:"#14532d",color:"#4ade80",fontSize:11,padding:"2px 9px",borderRadius:20,fontWeight:700}}>Hoje</span>}
              {daysLeft(e.date)===1&&<span style={{background:"#2d1a06",color:"#fb923c",fontSize:11,padding:"2px 9px",borderRadius:20,fontWeight:700}}>Amanhã</span>}
              {daysLeft(e.date)>1&&daysLeft(e.date)<=7&&<span style={{background:"#1a1a2e",color:"#94a3b8",fontSize:11,padding:"2px 9px",borderRadius:20}}>{daysLeft(e.date)}d</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddEventForm({onSave,ac}){
  const [form,setForm]=useState({title:"",date:todayStr(),time:"",type:"reuniao",participant:"",participantType:"pessoa",notes:""});
  const s=v=>setForm(f=>({...f,...v}));
  return(<div>
    <Field label="Título do evento"><Inp value={form.title} onChange={v=>s({title:v})} placeholder="Ex: Reunião com fornecedor, Visita banco..."/></Field>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="Data"><Inp type="date" value={form.date} onChange={v=>s({date:v})}/></Field>
      <Field label="Horário"><Inp type="time" value={form.time} onChange={v=>s({time:v})}/></Field>
      <Field label="Tipo"><Sel value={form.type} onChange={v=>s({type:v})} opts={[["reuniao","🤝 Reunião"],["tarefa","✅ Tarefa"],["lembrete","🔔 Lembrete"],["outro","📌 Outro"]]}/></Field>
      <Field label="Tipo de contato"><Sel value={form.participantType} onChange={v=>s({participantType:v})} opts={[["pessoa","👤 Geral"],["colaborador","👔 Colaborador"],["fornecedor","🏢 Fornecedor"],["cliente","🧾 Cliente"],["banco","🏦 Banco"]]}/></Field>
    </div>
    <Field label={`Nome — ${form.participantType==="fornecedor"?"Fornecedor":form.participantType==="colaborador"?"Colaborador":form.participantType==="cliente"?"Cliente":form.participantType==="banco"?"Banco/Instituição":"Participante"}`}><Inp value={form.participant} onChange={v=>s({participant:v})} placeholder="Nome, empresa ou pessoa..."/></Field>
    <Field label="Observações / Pauta"><textarea value={form.notes} onChange={e=>s({notes:e.target.value})} rows={3} placeholder="Pauta, objetivo, detalhes..." style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"9px 12px",color:"#e2e8f0",fontSize:13,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}}/></Field>
    <Btn ac={ac} full onClick={()=>form.title.trim()&&form.date&&onSave(form)}>Salvar Evento</Btn>
  </div>);
}

// ─── VERITAS DASHBOARD ────────────────────────────────────────
function VeritasDashboard({bpo,brand,onSave}){
  const ac=brand.c; const today=todayStr(); const now=new Date(); const dom=now.getDate(); const dow=now.getDay();
  const todayTasks=[];
  bpo.forEach((c,ci)=>{
    (c.tasks||[]).forEach(t=>{
      const due=(t.freq==="daily")||(t.freq==="monthly"&&t.dia===dom)||(t.freq==="weekly"&&t.dia===dow)||(t.freq==="once"&&t.dueDate===today);
      if(due) todayTasks.push({client:c,ci,task:t,done:(c.done||{})[`${t.id}_${today}`]});
    });
  });
  const doneCnt=todayTasks.filter(x=>x.done).length;
  const toggleDone=(cid,tid)=>onSave(bpo.map(c=>{ if(c.id!==cid)return c; const k=`${tid}_${today}`; return{...c,done:{...(c.done||{}),[k]:!(c.done||{})[k]}}; }));
  return(
    <div>
      <div style={{marginBottom:24}}>
        <h2 style={{margin:"0 0 4px",fontSize:22,fontWeight:800,color:"#fff"}}>BPO Financeiro 💰</h2>
        <p style={{margin:0,color:"#475569",fontSize:14}}>{now.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
        {[
          {label:"Clientes BPO",value:bpo.length,icon:"👥",color:"#6366f1"},
          {label:"Tarefas hoje",value:todayTasks.length,icon:"📋",color:ac},
          {label:"Concluídas hoje",value:doneCnt,icon:"✅",color:"#10b981"},
        ].map(card=>(
          <div key={card.label} style={{background:"#0f0f1c",border:`1px solid ${card.color}33`,borderRadius:14,padding:"20px 18px"}}>
            <div style={{fontSize:28,marginBottom:8}}>{card.icon}</div>
            <div style={{fontSize:32,fontWeight:800,color:card.color}}>{card.value}</div>
            <div style={{fontSize:13,color:"#64748b",marginTop:4}}>{card.label}</div>
          </div>
        ))}
      </div>
      {todayTasks.length>0&&(
        <div style={{background:"#0f0f1c",border:`1px solid ${ac}44`,borderRadius:14,padding:18}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <p style={{margin:0,fontWeight:700,color:ac,fontSize:14}}>📋 Tarefas de hoje</p>
            <span style={{background:doneCnt===todayTasks.length?"#14532d":ac+"22",color:doneCnt===todayTasks.length?"#4ade80":ac,fontSize:12,padding:"3px 12px",borderRadius:20,fontWeight:700}}>{doneCnt}/{todayTasks.length} feitas</span>
          </div>
          {todayTasks.map(({client,ci,task,done},i)=>{
            const cc=clientColor(ci); const tc=CAT_COLORS[task.cat]||ac;
            return(<div key={i} style={{display:"flex",alignItems:"center",gap:10,background:"#111120",borderRadius:9,padding:"10px 14px",border:`1px solid ${done?"#1a4a2e":"#1a1a2e"}`,marginBottom:6}}>
              <Chk checked={done} ac={tc} onClick={()=>toggleDone(client.id,task.id)}/>
              <span style={{fontSize:16}}>{task.icon}</span>
              <div style={{flex:1}}>
                <span style={{fontWeight:600,color:done?"#475569":"#fff",textDecoration:done?"line-through":"none",fontSize:14}}>{task.label}</span>
                <span style={{fontSize:12,color:cc,fontWeight:600,marginLeft:8}}>· {client.name}</span>
              </div>
              <span style={{background:tc+"22",color:tc,fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:600}}>{CAT_LABELS[task.cat]||task.cat}</span>
            </div>);
          })}
        </div>
      )}
      {todayTasks.length===0&&<div style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:14,padding:40,textAlign:"center"}}><div style={{fontSize:48,marginBottom:12}}>🎉</div><p style={{color:"#475569",fontSize:15}}>Nenhuma tarefa BPO para hoje!</p></div>}
    </div>
  );
}

// ─── BPO TAB (VERITAS) ────────────────────────────────────────
function BpoTab({bpo,onSave,brand}){
  const [view,setView]=useState("clientes");
  const [showAdd,setShowAdd]=useState(false);
  const [selClient,setSelClient]=useState(null);
  const [cofreId,setCofreId]=useState(null);
  const ac=brand.c; const today=todayStr(); const now=new Date();
  const [calRef,setCalRef]=useState(()=>{ const n=new Date(); return new Date(n.getFullYear(),n.getMonth(),1); });
  const cy=calRef.getFullYear(),cmo=calRef.getMonth(),cdim=new Date(cy,cmo+1,0).getDate(),cfd=new Date(cy,cmo,1).getDay();
  const calMap={};
  bpo.forEach((c,ci)=>{
    (c.tasks||[]).forEach(t=>{
      if(t.freq==="monthly"&&t.dia>=1&&t.dia<=cdim){ const ds=`${cy}-${String(cmo+1).padStart(2,"0")}-${String(t.dia).padStart(2,"0")}`; calMap[ds]=[...(calMap[ds]||[]),{c,ci,t}]; }
      if(t.freq==="weekly"){ for(let d=1;d<=cdim;d++){ if(new Date(cy,cmo,d).getDay()===t.dia){ const ds=`${cy}-${String(cmo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; calMap[ds]=[...(calMap[ds]||[]),{c,ci,t}]; } } }
      if(t.freq==="daily"){ for(let d=1;d<=cdim;d++){ const wd=new Date(cy,cmo,d).getDay(); if(wd>0&&wd<6){ const ds=`${cy}-${String(cmo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; calMap[ds]=[...(calMap[ds]||[]),{c,ci,t}]; } } }
      if(t.freq==="once"&&t.dueDate&&t.dueDate.startsWith(`${cy}-${String(cmo+1).padStart(2,"0")}`)){ calMap[t.dueDate]=[...(calMap[t.dueDate]||[]),{c,ci,t}]; }
    });
  });
  const addClient=form=>onSave([...bpo,{id:uid(),...form,tasks:[],done:{},cofre:{bancos:[],acessos:[]}}]);
  const updateClient=(cid,patch)=>onSave(bpo.map(c=>c.id===cid?{...c,...patch}:c));
  const delClient=cid=>{ if(window.confirm("Remover cliente BPO?")) onSave(bpo.filter(c=>c.id!==cid)); };
  const selObj=bpo.find(c=>c.id===selClient);
  const cofreObj=bpo.find(c=>c.id===cofreId);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#fff"}}>Clientes BPO</h2><p style={{margin:"4px 0 0",color:"#475569",fontSize:13}}>{bpo.length} cliente(s)</p></div>
        <Btn ac={ac} onClick={()=>setShowAdd(true)}>+ Novo Cliente</Btn>
      </div>
      <div style={{display:"flex",gap:4,marginBottom:18,background:"#0f0f1c",borderRadius:9,padding:4,width:"fit-content"}}>
        {[["clientes","👥 Clientes"],["calendario","📅 Calendário"],["todas","📋 Todas as Tarefas"]].map(([v,l])=>(
          <button key={v} onClick={()=>setView(v)} style={{padding:"6px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:view===v?700:400,background:view===v?ac:"transparent",color:view===v?"#fff":"#64748b"}}>{l}</button>
        ))}
      </div>
      {showAdd&&<Modal title="Novo Cliente BPO" onClose={()=>setShowAdd(false)}><AddBpoClientForm onSave={f=>{addClient(f);setShowAdd(false);}} ac={ac}/></Modal>}
      {selClient&&selObj&&<BpoClientDetail client={selObj} clientIdx={bpo.findIndex(c=>c.id===selClient)} onUpdate={p=>{updateClient(selClient,p);setSelClient(null);}} onClose={()=>setSelClient(null)} ac={ac}/>}
      {cofreId&&cofreObj&&<CofreModal client={cofreObj} ac={ac} onUpdate={cofre=>updateClient(cofreId,{cofre})} onClose={()=>setCofreId(null)}/>}
      {view==="clientes"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
          {bpo.length===0&&<Empty text="Nenhum cliente BPO"/>}
          {bpo.map((c,ci)=>{ const cc=clientColor(ci); const cofreN=(c.cofre?.bancos||[]).length+(c.cofre?.acessos||[]).length; return(
            <div key={c.id} style={{background:"#0f0f1c",border:`1px solid ${cc}44`,borderRadius:12,padding:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{width:10,height:10,borderRadius:5,background:cc}}/><div style={{fontWeight:700,color:"#fff",fontSize:15}}>{c.name}</div></div>{c.regime&&<span style={{background:cc+"22",color:cc,fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:600}}>{c.regime}</span>}</div>
                <button onClick={()=>delClient(c.id)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:14}}>🗑️</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
                {[[(c.tasks||[]).length+"","Tarefas"],[(c.tasks||[]).filter(t=>t.freq==="once").length+"","Pontuais"]].map(([n,l])=>(
                  <div key={l} style={{background:"#1a1a2e",borderRadius:8,padding:"8px 6px",textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:cc}}>{n}</div><div style={{fontSize:10,color:"#64748b"}}>{l}</div></div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                <button onClick={()=>setSelClient(c.id)} style={{background:cc+"18",border:`1px solid ${cc}44`,borderRadius:8,padding:"8px",color:cc,cursor:"pointer",fontSize:11,fontWeight:700}}>⚙️ Tarefas</button>
                <button onClick={()=>setCofreId(c.id)} style={{background:"#0a180a",border:"1px solid #1a4a1a",borderRadius:8,padding:"8px",color:"#4ade80",cursor:"pointer",fontSize:11,fontWeight:700}}>🔐 Cofre {cofreN>0&&`(${cofreN})`}</button>
              </div>
            </div>
          );})}
        </div>
      )}
      {view==="calendario"&&(
        <div style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:14,overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderBottom:"1px solid #1a1a2e",background:"#0c0c18"}}>
            <button onClick={()=>setCalRef(new Date(cy,cmo-1,1))} style={{background:"#1a1a2e",border:"none",borderRadius:7,padding:"6px 14px",color:"#94a3b8",cursor:"pointer",fontSize:16}}>‹</button>
            <div style={{fontWeight:800,fontSize:17,color:"#fff"}}>{calRef.toLocaleDateString("pt-BR",{month:"long",year:"numeric"}).replace(/^\w/,c=>c.toUpperCase())}</div>
            <button onClick={()=>setCalRef(new Date(cy,cmo+1,1))} style={{background:"#1a1a2e",border:"none",borderRadius:7,padding:"6px 14px",color:"#94a3b8",cursor:"pointer",fontSize:16}}>›</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:"1px solid #1a1a2e"}}>{WDAYS.map(d=><div key={d} style={{textAlign:"center",padding:"9px 4px",fontSize:11,fontWeight:700,color:"#475569"}}>{d}</div>)}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
            {Array.from({length:cfd}).map((_,i)=><div key={`e${i}`} style={{minHeight:90,borderRight:"1px solid #141420",borderBottom:"1px solid #141420",background:"#09090f"}}/>)}
            {Array.from({length:cdim},(_,i)=>i+1).map(d=>{
              const ds=`${cy}-${String(cmo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
              const evts=calMap[ds]||[]; const isT=ds===today; const isL=(cfd+d-1)%7===6;
              return(<div key={d} style={{minHeight:90,borderRight:isL?"none":"1px solid #1a1a2e",borderBottom:"1px solid #1a1a2e",padding:"5px",background:isT?`${ac}14`:"transparent"}}>
                <div style={{display:"flex",justifyContent:"flex-end",marginBottom:3}}><span style={{fontSize:12,fontWeight:isT?800:400,color:isT?"#fff":"#64748b",background:isT?ac:"transparent",width:22,height:22,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center"}}>{d}</span></div>
                {evts.slice(0,4).map(({c,ci,t},i)=>{ const cc=clientColor(ci); const done=(c.done||{})[`${t.id}_${ds}`]; return(<div key={i} onClick={()=>openReminder(`${t.label} · ${c.name}`,ds,t.desc||"")} title={`${t.label} · ${c.name}`} style={{background:cc+"22",borderLeft:`3px solid ${done?"#4ade80":cc}`,borderRadius:"0 3px 3px 0",padding:"1px 5px",marginBottom:2,fontSize:10,color:done?"#4ade80":cc,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",textDecoration:done?"line-through":"none",cursor:"pointer"}}>{t.icon} {t.label}</div>);})}
                {evts.length>4&&<div style={{fontSize:9,color:"#475569",paddingLeft:5}}>+{evts.length-4}</div>}
              </div>);
            })}
          </div>
          {bpo.length>0&&<div style={{padding:"10px 16px",borderTop:"1px solid #1a1a2e",display:"flex",gap:14,flexWrap:"wrap"}}>{bpo.map((c,ci)=><div key={c.id} style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,borderRadius:2,background:clientColor(ci)}}/><span style={{fontSize:11,color:"#64748b"}}>{c.name}</span></div>)}</div>}
        </div>
      )}
      {view==="todas"&&(
        <div>
          {bpo.every(c=>(c.tasks||[]).length===0)&&<Empty text="Nenhuma tarefa configurada"/>}
          {Object.keys(CAT_COLORS).map(cat=>{
            const items=[]; bpo.forEach((c,ci)=>(c.tasks||[]).filter(t=>t.cat===cat).forEach(t=>items.push({c,ci,t}))); if(!items.length)return null;
            const cc=CAT_COLORS[cat];
            return(<div key={cat} style={{marginBottom:20}}>
              <p style={{fontSize:11,fontWeight:700,color:cc,margin:"0 0 8px",letterSpacing:"0.5px"}}>{CAT_LABELS[cat]?.toUpperCase()}</p>
              {items.map(({c,ci,t},i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,background:"#0f0f1c",border:`1px solid ${cc}22`,borderRadius:9,padding:"10px 14px",marginBottom:5}}>
                  <span style={{fontSize:15}}>{t.icon}</span>
                  <div style={{flex:1}}><span style={{fontWeight:600,color:"#fff",fontSize:14}}>{t.label}</span><span style={{fontSize:12,color:clientColor(ci),fontWeight:600,marginLeft:8}}>· {c.name}</span></div>
                  <span style={{background:"#1a1a2e",color:"#94a3b8",fontSize:11,padding:"2px 8px",borderRadius:20}}>{t.freq==="monthly"?`Dia ${t.dia}`:t.freq==="weekly"?`Toda ${WDAYS[t.dia||1]}`:t.freq==="daily"?"Diário":t.freq==="once"?`📌 ${fmtDate(t.dueDate)}`:"—"}</span>
                </div>
              ))}
            </div>);
          })}
        </div>
      )}
    </div>
  );
}

function AddBpoClientForm({onSave,ac}){
  const [name,setName]=useState(""); const [regime,setRegime]=useState("");
  return(<div>
    <Field label="Nome do Cliente"><Inp value={name} onChange={setName} placeholder="Razão social"/></Field>
    <Field label="Regime Tributário"><Sel value={regime} onChange={setRegime} opts={[["","Selecione..."],...REGIMES.map(r=>[r,r])]}/></Field>
    <Btn ac={ac} full onClick={()=>name.trim()&&onSave({name,regime})}>Criar Cliente</Btn>
  </div>);
}

function BpoClientDetail({client,clientIdx,onUpdate,onClose,ac}){
  const [tasks,setTasks]=useState(()=>(client.tasks||[]).map(t=>({...t,detalhes:t.detalhes||{}})));
  const [showSug,setShowSug]=useState(false);
  const [tab,setTab]=useState("recorrentes");
  const cc=clientColor(clientIdx);
  const recorrentes=tasks.filter(t=>t.freq!=="once");
  const pontuais=tasks.filter(t=>t.freq==="once");
  const delTask=id=>setTasks(ts=>ts.filter(t=>t.id!==id));
  const updFreq=(id,v)=>setTasks(ts=>ts.map(t=>t.id===id?{...t,freq:v}:t));
  const updDia=(id,v)=>setTasks(ts=>ts.map(t=>t.id===id?{...t,dia:v}:t));
  const updDueDate=(id,v)=>setTasks(ts=>ts.map(t=>t.id===id?{...t,dueDate:v}:t));
  const addSug=s=>{ if(!tasks.some(t=>t.id===s.id)) setTasks(ts=>[...ts,{...s,detalhes:{}}]); };
  const addPontual=()=>setTasks(ts=>[...ts,{id:uid(),label:"Nova tarefa",freq:"once",dueDate:todayStr(),cat:"outro",icon:"📌",desc:"",detalhes:{}}]);
  return(<Modal title={`Tarefas — ${client.name}`} onClose={onClose} wide>
    <div style={{display:"flex",gap:4,background:"#0a0a14",borderRadius:8,padding:3,marginBottom:16,width:"fit-content"}}>
      {[["recorrentes",`🔄 Recorrentes (${recorrentes.length})`],["pontuais",`📌 Pontuais (${pontuais.length})`]].map(([v,l])=>(
        <button key={v} onClick={()=>setTab(v)} style={{padding:"6px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:tab===v?700:400,background:tab===v?ac:"transparent",color:tab===v?"#fff":"#64748b"}}>{l}</button>
      ))}
    </div>
    {tab==="recorrentes"&&(<div>
      {recorrentes.length===0&&<p style={{color:"#2a2a45",fontSize:13}}>Nenhuma tarefa recorrente.</p>}
      {recorrentes.map(t=>{
        const tc=CAT_COLORS[t.cat]||"#64748b";
        return(<div key={t.id} style={{background:"#111120",borderRadius:10,border:`1px solid ${tc}33`,marginBottom:8,overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px"}}>
            <span style={{fontSize:16}}>{t.icon}</span>
            <div style={{flex:1}}><span style={{fontWeight:700,color:"#fff",fontSize:14}}>{t.label}</span><span style={{background:tc+"22",color:tc,fontSize:10,padding:"1px 8px",borderRadius:20,marginLeft:8}}>{CAT_LABELS[t.cat]||t.cat}</span></div>
            <button onClick={()=>delTask(t.id)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:18}}>×</button>
          </div>
          <div style={{borderTop:`1px solid ${tc}22`,padding:"10px 14px",background:"#0d0d1a"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:t.freq!=="daily"?10:0}}>
              <span style={{fontSize:11,color:"#64748b",fontWeight:600,width:80}}>Frequência:</span>
              <div style={{display:"flex",gap:5}}>
                {[["monthly","Mensal"],["weekly","Semanal"],["daily","Diário"]].map(([v,l])=>(
                  <button key={v} onClick={()=>updFreq(t.id,v)} style={{padding:"4px 12px",borderRadius:6,border:`1px solid ${t.freq===v?tc:"#252540"}`,background:t.freq===v?tc:"transparent",color:t.freq===v?"#fff":"#475569",cursor:"pointer",fontSize:11,fontWeight:t.freq===v?800:400}}>{l}</button>
                ))}
              </div>
            </div>
            {t.freq==="monthly"&&(<div style={{display:"flex",alignItems:"flex-start",gap:8,marginTop:8}}>
              <span style={{fontSize:11,color:"#64748b",fontWeight:600,width:80,paddingTop:5}}>Dia:</span>
              <div style={{display:"flex",gap:3,flexWrap:"wrap",flex:1}}>{Array.from({length:28},(_,i)=>i+1).map(d=><button key={d} onClick={()=>updDia(t.id,d)} style={{width:32,height:28,borderRadius:5,border:`1px solid ${t.dia===d?tc:"#252540"}`,background:t.dia===d?tc:"transparent",color:t.dia===d?"#fff":"#64748b",cursor:"pointer",fontSize:11,fontWeight:t.dia===d?800:400}}>{d}</button>)}</div>
            </div>)}
            {t.freq==="weekly"&&(<div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
              <span style={{fontSize:11,color:"#64748b",fontWeight:600,width:80}}>Dia:</span>
              <div style={{display:"flex",gap:4}}>{WDAYS.map((d,idx)=><button key={idx} onClick={()=>updDia(t.id,idx)} style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${t.dia===idx?tc:"#252540"}`,background:t.dia===idx?tc:"transparent",color:t.dia===idx?"#fff":"#64748b",cursor:"pointer",fontSize:11,fontWeight:t.dia===idx?800:400}}>{d}</button>)}</div>
            </div>)}
          </div>
        </div>);
      })}
      <button onClick={()=>setShowSug(v=>!v)} style={{width:"100%",background:"#1a1a2e",border:`1px solid ${cc}44`,borderRadius:8,padding:"9px",color:cc,cursor:"pointer",fontSize:12,fontWeight:700,marginTop:4,marginBottom:showSug?10:0}}>{showSug?"▲ Fechar sugestões":"+ Adicionar tarefa sugerida"}</button>
      {showSug&&(<div style={{maxHeight:260,overflowY:"auto",marginBottom:12}}>
        {BPO_SUGESTOES.filter(s=>!tasks.some(t=>t.id===s.id)).map(s=>{ const tc=CAT_COLORS[s.cat]||"#64748b"; return(
          <div key={s.id} onClick={()=>addSug(s)} style={{display:"flex",alignItems:"center",gap:10,background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:8,padding:"8px 12px",cursor:"pointer",marginBottom:4}} onMouseEnter={e=>e.currentTarget.style.borderColor=tc} onMouseLeave={e=>e.currentTarget.style.borderColor="#1a1a2e"}>
            <span>{s.icon}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{s.label}</div><div style={{fontSize:10,color:"#475569"}}>{s.desc}</div></div>
            <span style={{background:tc+"22",color:tc,fontSize:10,padding:"2px 7px",borderRadius:20}}>{CAT_LABELS[s.cat]}</span>
          </div>
        );})}
      </div>)}
    </div>)}
    {tab==="pontuais"&&(<div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
        <button onClick={addPontual} style={{background:ac,border:"none",borderRadius:8,padding:"7px 16px",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700}}>+ Nova tarefa pontual</button>
      </div>
      {pontuais.length===0&&<p style={{color:"#2a2a45",fontSize:13,textAlign:"center",padding:"20px 0"}}>Nenhuma tarefa pontual. Clique em "+ Nova tarefa pontual".</p>}
      {pontuais.map(t=>(
        <div key={t.id} style={{background:"#111120",borderRadius:10,border:"1px solid #252540",marginBottom:8,padding:"12px 14px"}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
            <input value={t.label} onChange={e=>setTasks(ts=>ts.map(x=>x.id===t.id?{...x,label:e.target.value}:x))} style={{flex:1,background:"#1a1a2e",border:"1px solid #252540",borderRadius:7,padding:"7px 10px",color:"#fff",fontSize:13,outline:"none"}} placeholder="Descrição da tarefa..."/>
            <button onClick={()=>delTask(t.id)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:18}}>×</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <Field label="Data prevista"><Inp type="date" value={t.dueDate||""} onChange={v=>updDueDate(t.id,v)}/></Field>
            <Field label="Categoria"><Sel value={t.cat||"outro"} onChange={v=>setTasks(ts=>ts.map(x=>x.id===t.id?{...x,cat:v,icon:Object.keys(CAT_COLORS).includes(v)?t.icon:"📌"}:x))} opts={[...Object.entries(CAT_LABELS).map(([v,l])=>[v,l]),["outro","Outro"]]}/></Field>
          </div>
          {t.dueDate&&<button onClick={()=>openReminder(t.label,t.dueDate,t.desc||"")} style={{background:"#0d1f0d",border:"none",borderRadius:7,padding:"6px 12px",color:"#4ade80",cursor:"pointer",fontSize:11,fontWeight:600,marginTop:4}}>🔔 Criar lembrete no Google</button>}
        </div>
      ))}
    </div>)}
    <div style={{background:`${cc}10`,border:`1px solid ${cc}33`,borderRadius:9,padding:"10px 14px",marginBottom:12,marginTop:8}}>
      <span style={{color:cc,fontSize:12}}>💾 Ao salvar, todas as alterações serão aplicadas.</span>
    </div>
    <Btn ac={ac} full onClick={()=>onUpdate({tasks})}>💾 Salvar Tarefas</Btn>
  </Modal>);
}

function CofreModal({client,ac,onUpdate,onClose}){
  const [cofre,setCofre]=useState({bancos:[],acessos:[],...(client.cofre||{})});
  const [showPwd,setShowPwd]=useState({}); const [tab,setTab]=useState("bancos");
  const uid2=()=>Math.random().toString(36).slice(2,9);
  const addB=()=>setCofre(c=>({...c,bancos:[...c.bancos,{id:uid2(),banco:"",agencia:"",conta:"",tipo:"corrente",pix:"",obs:""}]}));
  const updB=(id,k,v)=>setCofre(c=>({...c,bancos:c.bancos.map(b=>b.id===id?{...b,[k]:v}:b)}));
  const delB=id=>setCofre(c=>({...c,bancos:c.bancos.filter(b=>b.id!==id)}));
  const addA=()=>setCofre(c=>({...c,acessos:[...c.acessos,{id:uid2(),sistema:"",usuario:"",senha:"",url:"",obs:""}]}));
  const updA=(id,k,v)=>setCofre(c=>({...c,acessos:c.acessos.map(a=>a.id===id?{...a,[k]:v}:a)}));
  const delA=id=>setCofre(c=>({...c,acessos:c.acessos.filter(a=>a.id!==id)}));
  return(<Modal title={`🔐 Cofre — ${client.name}`} onClose={()=>{onUpdate(cofre);onClose();}} wide>
    <div style={{background:"#0a0f0a",border:"1px solid #1a3a1a",borderRadius:8,padding:"8px 14px",marginBottom:14,display:"flex",gap:8,alignItems:"center"}}><span>🔒</span><span style={{color:"#4ade80",fontSize:12,fontWeight:600}}>Dados seguros · salvos localmente</span></div>
    <div style={{display:"flex",gap:4,background:"#0f0f1c",borderRadius:8,padding:3,marginBottom:16,width:"fit-content"}}>
      {[["bancos","🏦 Contas"],["acessos","🔑 Senhas"]].map(([v,l])=><button key={v} onClick={()=>setTab(v)} style={{padding:"5px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:tab===v?700:400,background:tab===v?ac:"transparent",color:tab===v?"#fff":"#64748b"}}>{l}</button>)}
    </div>
    {tab==="bancos"&&(<div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}><button onClick={addB} style={{background:"#1a1a2e",border:`1px solid ${ac}44`,borderRadius:7,padding:"5px 12px",color:ac,cursor:"pointer",fontSize:12,fontWeight:600}}>+ Conta</button></div>
      {cofre.bancos.length===0&&<p style={{color:"#2a2a45",fontSize:13,textAlign:"center",padding:"20px 0"}}>Nenhum banco.</p>}
      {cofre.bancos.map(b=>(<div key={b.id} style={{background:"#111120",borderRadius:10,padding:"12px 14px",marginBottom:8,border:`1px solid ${ac}22`}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:ac,fontWeight:700,fontSize:12}}>🏦 {b.banco||"Nova Conta"}</span><button onClick={()=>delB(b.id)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:16}}>×</button></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <Field label="Banco"><Inp value={b.banco} onChange={v=>updB(b.id,"banco",v)} placeholder="Itaú, Nubank..."/></Field>
          <Field label="Tipo"><Sel value={b.tipo} onChange={v=>updB(b.id,"tipo",v)} opts={[["corrente","Corrente"],["poupanca","Poupança"],["pagamento","Pagamento"],["digital","Digital"]]}/></Field>
          <Field label="Agência"><Inp value={b.agencia} onChange={v=>updB(b.id,"agencia",v)}/></Field>
          <Field label="Conta"><Inp value={b.conta} onChange={v=>updB(b.id,"conta",v)}/></Field>
          <Field label="Chave PIX" style={{gridColumn:"1/-1"}}><Inp value={b.pix} onChange={v=>updB(b.id,"pix",v)} placeholder="CNPJ, e-mail, telefone..."/></Field>
          <Field label="Obs." style={{gridColumn:"1/-1"}}><Inp value={b.obs} onChange={v=>updB(b.id,"obs",v)}/></Field>
        </div>
      </div>))}
    </div>)}
    {tab==="acessos"&&(<div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}><button onClick={addA} style={{background:"#1a1a2e",border:`1px solid ${ac}44`,borderRadius:7,padding:"5px 12px",color:ac,cursor:"pointer",fontSize:12,fontWeight:600}}>+ Acesso</button></div>
      {cofre.acessos.length===0&&<p style={{color:"#2a2a45",fontSize:13,textAlign:"center",padding:"20px 0"}}>Nenhum acesso.</p>}
      {cofre.acessos.map(a=>(<div key={a.id} style={{background:"#111120",borderRadius:10,padding:"12px 14px",marginBottom:8,border:"1px solid #1a2a1a"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:"#4ade80",fontWeight:700,fontSize:12}}>🔑 {a.sistema||"Novo Acesso"}</span><button onClick={()=>delA(a.id)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:16}}>×</button></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <Field label="Sistema" style={{gridColumn:"1/-1"}}><Inp value={a.sistema} onChange={v=>updA(a.id,"sistema",v)} placeholder="e-CAC, Omie, banco..."/></Field>
          <Field label="URL"><Inp value={a.url} onChange={v=>updA(a.id,"url",v)} placeholder="https://..."/></Field>
          <Field label="Usuário"><Inp value={a.usuario} onChange={v=>updA(a.id,"usuario",v)}/></Field>
          <Field label="Senha" style={{gridColumn:"1/-1"}}>
            <div style={{position:"relative"}}>
              <input value={a.senha} onChange={e=>updA(a.id,"senha",e.target.value)} type={showPwd[a.id]?"text":"password"} placeholder="••••••••" style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"9px 40px 9px 12px",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
              <button onClick={()=>setShowPwd(s=>({...s,[a.id]:!s[a.id]}))} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:16,padding:0}}>{showPwd[a.id]?"🙈":"👁️"}</button>
            </div>
          </Field>
          <Field label="Obs." style={{gridColumn:"1/-1"}}><Inp value={a.obs} onChange={v=>updA(a.id,"obs",v)}/></Field>
        </div>
      </div>))}
    </div>)}
    <Btn ac={ac} full onClick={()=>{onUpdate(cofre);onClose();}} style={{marginTop:14}}>💾 Salvar Cofre</Btn>
  </Modal>);
}

// ─── DESIGN SYSTEM ────────────────────────────────────────────
function Modal({title,children,onClose,wide}){return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.78)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}}><div style={{background:"#0f0f1c",border:"1px solid #1e1e35",borderRadius:16,padding:24,width:"100%",maxWidth:wide?700:440,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 40px 100px rgba(0,0,0,.6)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><h3 style={{margin:0,fontSize:16,fontWeight:700,color:"#fff"}}>{title}</h3><button onClick={onClose} style={{background:"#1a1a2e",border:"none",borderRadius:6,width:28,height:28,color:"#94a3b8",cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button></div>{children}</div></div>);}
function Field({label,children,style}){return <div style={{marginBottom:12,...style}}><label style={{fontSize:10,color:"#64748b",display:"block",marginBottom:5,fontWeight:700,letterSpacing:"0.5px"}}>{label.toUpperCase()}</label>{children}</div>;}
function Inp({value,onChange,type="text",placeholder=""}){return <input value={value} onChange={e=>onChange(e.target.value)} type={type} placeholder={placeholder} style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"9px 12px",color:"#fff",fontSize:13,outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor="#6366f1"} onBlur={e=>e.target.style.borderColor="#252540"}/>;}
function Sel({value,onChange,opts}){return <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"9px 12px",color:value?"#fff":"#64748b",fontSize:13,outline:"none"}}>{opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>;}
function Btn({children,onClick,ac,full,style}){return <button onClick={onClick} style={{background:ac,border:"none",borderRadius:9,padding:"10px 18px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,width:full?"100%":"auto",...style}}>{children}</button>;}
function Chk({checked,ac,onClick}){return <div onClick={onClick} style={{width:22,height:22,borderRadius:6,border:`2px solid ${checked?ac:"#2a2a45"}`,background:checked?ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all .15s"}}>{checked&&<span style={{color:"#fff",fontSize:12,fontWeight:700}}>✓</span>}</div>;}
function Empty({text}){return <div style={{textAlign:"center",padding:"48px 24px",gridColumn:"1/-1"}}><div style={{fontSize:44,marginBottom:12}}>📭</div><p style={{margin:0,fontSize:14,color:"#475569"}}>{text}</p></div>;}
