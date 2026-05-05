import { useState, useEffect } from "react";

// ─── CONSTANTES ───────────────────────────────────────────────
const USERS = {
  daniela: { pw:"1234", access:["record","veritas"], name:"Daniela", role:"admin" },
  marcus:  { pw:"1234", access:["record"],           name:"Marcus",  role:"partner" },
};
const BRANDS = {
  record:  { name:"Record Assessoria Contábil", short:"Record", c:"#2a4a8a", c2:"#c9a96e", tagline:"Assessoria Contábil · 43 anos" },
  veritas: { name:"Veritas Hub", short:"Veritas", c:"#c9a96e", c2:"#8f775f", tagline:"BPO Financeiro · Segurança e Clareza" },
};

const DOCS_TRANSFER = ["Contrato Social","Última alteração contratual","Cartão CNPJ","Certificado Digital","Procuração (se houver)","Documentos dos sócios (RG/CPF)","Comprovante de endereço empresa","Declarações anteriores (IRPJ/DEFIS)","Extratos bancários recentes","Livro caixa / planilhas financeiras","Folha de pagamento","Certidões negativas"];
const DOCS_CONSTITUTION = ["RG e CPF dos sócios","Comprovante de endereço dos sócios","Comprovante de endereço do futuro estabelecimento","Escolha do nome empresarial","Atividades pretendidas (CNAE)","Capital social definido","Definição de quotas entre sócios"];

const ONBOARDING_STEPS = [
  { id:"documentacao", label:"Documentação", icon:"📋", desc:"Controle de documentos recebidos e pendentes" },
  { id:"dominio",      label:"Cadastro Domínio", icon:"💻", desc:"Sistema contábil — credenciais e status" },
  { id:"zappy",        label:"Zappy Contábil", icon:"📱", desc:"Plataforma cliente — credenciais e acesso" },
  { id:"onboarding",   label:"Reunião de Onboarding", icon:"🤝", desc:"Reunião inicial de apresentação" },
  { id:"mes1",         label:"Reunião 1º Mês", icon:"📅", desc:"Acompanhamento após primeiro mês" },
  { id:"trimestral",   label:"Reunião Trimestral", icon:"🔄", desc:"Reunião de acompanhamento trimestral" },
  { id:"semestral",    label:"Reunião Semestral", icon:"📊", desc:"Reunião semestral de resultados" },
  { id:"jantar",       label:"Jantar de Boas-vindas", icon:"🍽️", desc:"Jantar de confraternização" },
  { id:"kit",          label:"Kit de Boas-vindas", icon:"🎁", desc:"Envio de kit personalizado" },
];

const MTG_TYPES = [
  { id:"onboarding",  label:"Onboarding",   months:0 },
  { id:"mes1",        label:"1º Mês",        months:1 },
  { id:"trimestral",  label:"Trimestral",    months:3 },
  { id:"semestral",   label:"Semestral",     months:6 },
  { id:"livre",       label:"Evento Livre",  months:0 },
  { id:"interno",     label:"Interno",       months:0 },
];

const BPO_CATS = { caixa:"Caixa", pagamentos:"Pagamentos", cobranca:"Cobrança", relatorio:"Relatórios", bancario:"Bancário", rh:"RH", fiscal:"Fiscal", reuniao:"Reunião", pontual:"Pontual" };
const BPO_CAT_COLORS = { caixa:"#10b981", pagamentos:"#f59e0b", cobranca:"#ef4444", relatorio:"#6366f1", bancario:"#3b82f6", rh:"#ec4899", fiscal:"#f97316", reuniao:"#8b5cf6", pontual:"#14b8a6" };
const BPO_SUGESTOES = [
  { id:"saldo_diario",   label:"Verificação de Saldo",         freq:"daily",   dia:null, icon:"💰", cat:"caixa",     desc:"Conferir saldo de todas as contas" },
  { id:"lancamentos",    label:"Registro de Lançamentos",       freq:"daily",   dia:null, icon:"📝", cat:"caixa",     desc:"Lançar entradas e saídas do dia" },
  { id:"contas_pagar",   label:"Contas a Pagar",               freq:"weekly",  dia:3,    icon:"📤", cat:"pagamentos", desc:"Verificar e agendar pagamentos da semana" },
  { id:"contas_receber", label:"Contas a Receber",             freq:"weekly",  dia:3,    icon:"📥", cat:"cobranca",   desc:"Acompanhar cobranças e inadimplências" },
  { id:"fluxo_semanal",  label:"Fluxo de Caixa Semanal",       freq:"weekly",  dia:5,    icon:"📊", cat:"relatorio",  desc:"Relatório semanal de entradas e saídas" },
  { id:"pix_colab",      label:"PIX — Colaboradores",          freq:"weekly",  dia:5,    icon:"💸", cat:"pagamentos", desc:"Processar pagamentos via PIX" },
  { id:"pix_forn",       label:"PIX — Fornecedores",           freq:"weekly",  dia:5,    icon:"💸", cat:"pagamentos", desc:"Processar pagamentos a fornecedores" },
  { id:"iss",            label:"ISS",                          freq:"monthly", dia:10,   icon:"🏛️", cat:"fiscal",     desc:"Pagamento ISS Municipal" },
  { id:"inss",           label:"INSS",                         freq:"monthly", dia:20,   icon:"🏛️", cat:"fiscal",     desc:"Pagamento INSS" },
  { id:"fgts",           label:"FGTS",                         freq:"monthly", dia:20,   icon:"🏛️", cat:"fiscal",     desc:"Recolhimento FGTS" },
  { id:"das",            label:"DAS — Simples Nacional",       freq:"monthly", dia:20,   icon:"📋", cat:"fiscal",     desc:"Guia DAS Simples Nacional" },
  { id:"conciliacao",    label:"Conciliação Bancária",         freq:"monthly", dia:5,    icon:"🏦", cat:"bancario",   desc:"Conferir extrato vs lançamentos" },
  { id:"folha",          label:"Folha de Pagamento",           freq:"monthly", dia:25,   icon:"👥", cat:"rh",         desc:"Processar folha e salários" },
  { id:"dre",            label:"DRE — Demonstrativo",         freq:"monthly", dia:10,   icon:"📈", cat:"relatorio",  desc:"Demonstrativo de resultado" },
  { id:"fluxo_mensal",   label:"Fluxo de Caixa Mensal",       freq:"monthly", dia:5,    icon:"📊", cat:"relatorio",  desc:"Projeção e análise mensal" },
  { id:"relatorio_ger",  label:"Relatório Gerencial",          freq:"monthly", dia:10,   icon:"📋", cat:"relatorio",  desc:"Relatório completo de gestão" },
  { id:"reuniao_men",    label:"Reunião Mensal",               freq:"monthly", dia:15,   icon:"🤝", cat:"reuniao",    desc:"Apresentação de resultados" },
  { id:"inadimplencia",  label:"Relatório de Inadimplência",  freq:"monthly", dia:8,    icon:"⚠️", cat:"cobranca",   desc:"Listar recebimentos em atraso" },
];

const WDAYS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const REGIMES = ["MEI","Simples Nacional","Lucro Presumido","Lucro Real","Imune / Isenta"];
const CLIENT_COLORS = ["#c9a96e","#10b981","#6366f1","#ef4444","#f59e0b","#3b82f6","#ec4899","#8b5cf6","#f97316","#14b8a6"];

// ─── UTILS ────────────────────────────────────────────────────
const uid       = () => Math.random().toString(36).slice(2,9);
const todayStr  = () => new Date().toISOString().slice(0,10);
const fmtDate   = d => d ? new Date(d+"T12:00:00").toLocaleDateString("pt-BR") : "—";
const daysLeft  = d => Math.ceil((new Date(d+"T12:00:00")-Date.now())/86400000);
const addMonths = (d,n) => { const x=new Date(d+"T12:00:00"); x.setMonth(x.getMonth()+n); return x.toISOString().slice(0,10); };
const maskCNPJ  = v => v.replace(/\D/g,"").slice(0,14).replace(/^(\d{2})(\d)/,"$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3").replace(/\.(\d{3})(\d)/,".$1/$2").replace(/(\d{4})(\d)/,"$1-$2");
const maskPhone = v => { const d=v.replace(/\D/g,"").slice(0,11); return d.length<=10?d.replace(/^(\d{2})(\d)/,"($1) $2").replace(/(\d{4})(\d)/,"$1-$2"):d.replace(/^(\d{2})(\d)/,"($1) $2").replace(/(\d{5})(\d)/,"$1-$2"); };
const clientColor = i => CLIENT_COLORS[i % CLIENT_COLORS.length];

const DB = {
  set:  (k,v)   => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} },
  load: async (k,def) => { try { const r=localStorage.getItem(k); if(r) return JSON.parse(r); } catch(e){} return def; }
};

// Google Calendar — Reunião (com participantes)
const openCalendar = (title,date,time,notes) => {
  const d=date||todayStr(), t=time||"09:00";
  const fmt = x=>x.toISOString().replace(/[-:]/g,"").split(".")[0]+"Z";
  const s=new Date(`${d}T${t}:00`), e=new Date(s.getTime()+3600000);
  const p=new URLSearchParams({action:"TEMPLATE",text:title,dates:`${fmt(s)}/${fmt(e)}`,details:notes||"",add:"danimcustodiof@gmail.com,mvmcustodio@gmail.com"});
  window.open(`https://calendar.google.com/calendar/u/0/r/eventedit?${p}`,"_blank");
};
// Google Calendar — Lembrete simples (dia inteiro, sem Meet)
const openReminder = (title,date,notes) => {
  const d=(date||todayStr()).replace(/-/g,"");
  const next=new Date((date||todayStr())+"T12:00:00"); next.setDate(next.getDate()+1);
  const d2=next.toISOString().slice(0,10).replace(/-/g,"");
  const p=new URLSearchParams({action:"TEMPLATE",text:"🔔 "+title,dates:`${d}/${d2}`,details:notes||""});
  window.open(`https://calendar.google.com/calendar/u/0/r/eventedit?${p}`,"_blank");
};

// ─── APP ROOT ─────────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState(null);
  const [co,setCo]=useState(null);
  const [mod,setMod]=useState("clientes");
  const [toast,setToast]=useState(null);
  const [ready,setReady]=useState(false);
  const [clients,setClients]=useState([]);
  const [meetings,setMeetings]=useState([]);
  const [agenda,setAgenda]=useState([]);
  const [bpo,setBpo]=useState([]);

  useEffect(()=>{
    (async()=>{
      const [c,m,a,b]=await Promise.all([DB.load("gp2_clients",[]),DB.load("gp2_meetings",[]),DB.load("gp2_agenda",[]),DB.load("gp2_bpo",[])]);
      setClients(c); setMeetings(m); setAgenda(a); setBpo(b); setReady(true);
    })();
  },[]);

  const showToast=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),2800);};

  const save=(key,val)=>{
    if(key==="clients"){setClients(val);DB.set("gp2_clients",val);}
    else if(key==="meetings"){setMeetings(val);DB.set("gp2_meetings",val);}
    else if(key==="agenda"){setAgenda(val);DB.set("gp2_agenda",val);}
    else if(key==="bpo"){setBpo(val);DB.set("gp2_bpo",val);}
    showToast("✅ Salvo!");
  };

  if(!ready) return <Loading/>;
  if(!user)  return <Login onLogin={(u)=>{setUser(u);const a=USERS[u].access[0];setCo(a);setMod(a==="veritas"?"bpo":"clientes");}}/>;

  const brand=BRANDS[co];
  const acc=USERS[user].access;
  const coClients=clients.filter(c=>c.co===co);

  const doExport=()=>{
    const json=JSON.stringify({clients,meetings,agenda,bpo},null,2);
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([json],{type:"application/json"}));
    a.download=`gestorpro_backup_${todayStr()}.json`; a.click();
  };
  const doImport=()=>{
    const inp=document.createElement("input"); inp.type="file"; inp.accept=".json";
    inp.onchange=e=>{
      const f=e.target.files[0]; if(!f) return;
      const r=new FileReader();
      r.onload=ev=>{
        try{
          const d=JSON.parse(ev.target.result);
          if(d.clients){setClients(d.clients);DB.set("gp2_clients",d.clients);}
          if(d.meetings){setMeetings(d.meetings);DB.set("gp2_meetings",d.meetings);}
          if(d.agenda){setAgenda(d.agenda);DB.set("gp2_agenda",d.agenda);}
          if(d.bpo){setBpo(d.bpo);DB.set("gp2_bpo",d.bpo);}
          showToast("✅ Dados restaurados!");
        }catch{showToast("❌ Arquivo inválido","err");}
      };
      r.readAsText(f);
    };
    inp.click();
  };

  return(
    <div style={{background:"#080810",minHeight:"100vh",color:"#e2e8f0",fontFamily:"system-ui,sans-serif"}}>
      <TopBar user={user} co={co} setCo={v=>{setCo(v);setMod(v==="veritas"?"bpo":"clientes");}} acc={acc} mod={mod} setMod={setMod} brand={brand} onLogout={()=>{setUser(null);setCo(null);}} onExport={doExport} onImport={doImport}/>
      <BrandBanner brand={brand} co={co}/>
      {toast&&<Toast toast={toast}/>}
      <TodayBar agenda={agenda} bpo={bpo} brand={brand}/>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"24px 16px"}}>
        {co==="record"&&mod==="clientes"  &&<ClientesTab  clients={coClients} allClients={clients} co={co} onSave={v=>save("clients",v)} brand={brand}/>}
        {co==="record"&&mod==="reunioes"  &&<ReunioesTab  clients={coClients} allMeetings={meetings} co={co} onSave={v=>save("meetings",v)} brand={brand}/>}
        {co==="record"&&mod==="agenda"    &&<AgendaTab    agenda={agenda} onSave={v=>save("agenda",v)} brand={brand}/>}
        {co==="veritas"&&mod==="bpo"      &&<BpoTab       bpo={bpo} onSave={v=>save("bpo",v)} brand={brand}/>}
        {co==="veritas"&&mod==="agenda"   &&<AgendaTab    agenda={agenda} onSave={v=>save("agenda",v)} brand={brand}/>}
      </div>
    </div>
  );
}

// ─── LOADING ──────────────────────────────────────────────────
function Loading(){return(<div style={{background:"#080810",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12,fontFamily:"system-ui"}}><div style={{width:40,height:40,border:"3px solid #c9a96e33",borderTop:"3px solid #c9a96e",borderRadius:"50%",animation:"spin .8s linear infinite"}}/><p style={{color:"#475569",fontSize:13}}>Carregando GestorPro...</p><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>);}

// ─── LOGOS ────────────────────────────────────────────────────
function VLogo({s=36}){return(<svg width={s} height={s} viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#9b7d5c"/><defs><linearGradient id="gv"><stop offset="0%" stopColor="#e4ce90"/><stop offset="100%" stopColor="#a07840"/></linearGradient></defs><path d="M27 25C14 12 9 20 17 28C21 32 35 48 50 76" stroke="url(#gv)" strokeWidth="4" fill="none" strokeLinecap="round"/><path d="M50 76C62 50 70 33 76 23C80 15 87 11 81 18" stroke="url(#gv)" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>);}
function RLogo({s=36}){return(<svg width={s} height={s} viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#152844"/><defs><linearGradient id="gr"><stop offset="0%" stopColor="#eedba8"/><stop offset="100%" stopColor="#9a7a3a"/></linearGradient></defs><line x1="25" y1="20" x2="25" y2="80" stroke="white" strokeWidth="7" strokeLinecap="round"/><path d="M25 20C25 20 63 20 63 38C63 56 25 56 25 56" stroke="white" strokeWidth="7" fill="none" strokeLinecap="round"/><line x1="37" y1="56" x2="68" y2="80" stroke="white" strokeWidth="7" strokeLinecap="round"/><path d="M31 24L57 24L44 41Z" fill="url(#gr)"/><path d="M44 41L31 55L57 55Z" fill="url(#gr)" opacity=".85"/></svg>);}

// ─── LOGIN ────────────────────────────────────────────────────
function Login({onLogin}){
  const [u,setU]=useState(""); const [p,setP]=useState(""); const [err,setErr]=useState("");
  const go=()=>{ if(USERS[u]&&USERS[u].pw===p) onLogin(u); else setErr("Usuário ou senha incorretos."); };
  const VH="#c9a96e",RC="#2a4a8a";
  return(<div style={{minHeight:"100vh",background:"#07070e",display:"flex",fontFamily:"system-ui",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:"-10%",left:"-5%",width:500,height:500,borderRadius:"50%",background:`radial-gradient(circle,${VH}15,transparent 70%)`,pointerEvents:"none"}}/>
    <div style={{position:"absolute",bottom:"-10%",right:"-5%",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${RC}15,transparent 70%)`,pointerEvents:"none"}}/>
    <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"60px 64px"}}>
      <div style={{marginBottom:40}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:14,background:`${VH}12`,border:`1px solid ${VH}44`,borderRadius:14,padding:"14px 20px",marginBottom:14}}><VLogo s={52}/><div><div style={{fontSize:22,fontWeight:800,color:"#fefff0"}}>Veritas Hub</div><div style={{fontSize:10,letterSpacing:"5px",color:VH,textTransform:"uppercase"}}>BPO Financeiro</div></div></div>
        <p style={{color:"#6a5a4a",fontSize:13,margin:0}}>Segurança, clareza e estratégia financeira.</p>
      </div>
      <div style={{height:1,background:`linear-gradient(to right,${VH}22,${RC}22)`,marginBottom:40}}/>
      <div>
        <div style={{display:"inline-flex",alignItems:"center",gap:14,background:`${RC}15`,border:`1px solid ${RC}44`,borderRadius:14,padding:"14px 20px",marginBottom:14}}><RLogo s={52}/><div><div style={{fontSize:22,fontWeight:800,color:"#eef2ff"}}>Record</div><div style={{fontSize:10,letterSpacing:"4px",color:VH,textTransform:"uppercase"}}>Assessoria Contábil</div></div></div>
        <p style={{color:"#3a4a6a",fontSize:13,margin:0}}>Confiança e excelência há mais de 43 anos.</p>
      </div>
    </div>
    <div style={{width:420,background:"#0c0c14",borderLeft:"1px solid #13131f",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 48px"}}>
      <div style={{width:"100%"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28}}>
          <div style={{width:4,height:32,borderRadius:2,background:`linear-gradient(to bottom,${VH},${RC})`}}/>
          <div><h1 style={{margin:0,fontSize:20,fontWeight:800,color:"#fff"}}>Acesso GestorPro</h1><p style={{margin:0,color:"#3a3a5a",fontSize:12,marginTop:2}}>Plataforma interna Record & Veritas</p></div>
        </div>
        <p style={{fontSize:10,color:"#2a2a45",fontWeight:700,letterSpacing:"1.5px",margin:"0 0 8px"}}>ACESSO RÁPIDO</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:18}}>
          {[["daniela","Daniela","Admin"],["marcus","Marcus","Record"]].map(([id,nome,role])=>(
            <button key={id} onClick={()=>{setU(id);setP("1234");}} style={{padding:"10px 12px",borderRadius:10,border:`1px solid ${u===id?VH+"66":"#1a1a2a"}`,background:u===id?`${VH}12`:"#111118",color:u===id?"#f5f0e6":"#475569",cursor:"pointer",textAlign:"left"}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{nome}</div>
              <div style={{fontSize:10,color:"#475569"}}>{role}</div>
            </button>
          ))}
        </div>
        <div style={{height:1,background:"#13131f",marginBottom:14}}/>
        {[["Usuário",u,setU,"text","👤"],["Senha",p,setP,"password","🔒"]].map(([lbl,val,set,type,icon])=>(
          <div key={lbl} style={{marginBottom:12}}>
            <label style={{fontSize:10,color:"#3a3a55",display:"block",marginBottom:5,fontWeight:700,letterSpacing:"1px"}}>{lbl.toUpperCase()}</label>
            <div style={{position:"relative"}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",opacity:0.4}}>{icon}</span><input value={val} onChange={e=>set(e.target.value)} type={type} onKeyDown={e=>e.key==="Enter"&&go()} style={{width:"100%",background:"#111118",border:"1px solid #1a1a28",borderRadius:10,padding:"11px 14px 11px 38px",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
          </div>
        ))}
        {err&&<div style={{background:"#2a0a0a",border:"1px solid #5a1a1a",borderRadius:8,padding:"8px 14px",marginBottom:12,color:"#f87171",fontSize:13}}>⚠️ {err}</div>}
        <button onClick={go} style={{width:"100%",background:`linear-gradient(135deg,${VH},#8f775f)`,border:"none",borderRadius:12,padding:"13px",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",marginTop:4}}>Entrar →</button>
      </div>
    </div>
  </div>);
}

// ─── TOP BAR ──────────────────────────────────────────────────
function TopBar({user,co,setCo,acc,mod,setMod,brand,onLogout,onExport,onImport}){
  const mods=co==="veritas"
    ?[{id:"bpo",label:"💰 BPO"},{id:"agenda",label:"🗓️ Agenda"}]
    :[{id:"clientes",label:"🧩 Clientes"},{id:"reunioes",label:"📅 Reuniões"},{id:"agenda",label:"🗓️ Agenda"}];
  const ac=brand?.c||"#c9a96e";
  return(<div style={{background:"#0c0c18",borderBottom:"1px solid #171728",padding:"0 20px",position:"sticky",top:0,zIndex:100}}>
    <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",gap:10,height:52}}>
      <span style={{fontWeight:800,fontSize:13,color:"#fff",whiteSpace:"nowrap"}}>⚡ GestorPro</span>
      {acc.length>1&&<div style={{display:"flex",gap:2,background:"#111120",borderRadius:8,padding:3}}>{acc.map(a=><button key={a} onClick={()=>setCo(a)} style={{padding:"3px 12px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:co===a?700:400,background:co===a?BRANDS[a].c:"transparent",color:co===a?"#fff":"#64748b"}}>{BRANDS[a].short}</button>)}</div>}
      <nav style={{display:"flex",gap:1,flex:1}}>{mods.map(m=><button key={m.id} onClick={()=>setMod(m.id)} style={{padding:"5px 12px",borderRadius:7,border:"none",cursor:"pointer",fontSize:12,fontWeight:mod===m.id?600:400,background:mod===m.id?"#1a1a2e":"transparent",color:mod===m.id?ac:"#64748b",whiteSpace:"nowrap"}}>{m.label}</button>)}</nav>
      <div style={{display:"flex",alignItems:"center",gap:5}}>
        <button onClick={onExport} title="Exportar backup" style={{background:"#0a1a0a",border:"1px solid #1a4a1a",borderRadius:6,padding:"4px 9px",color:"#4ade80",cursor:"pointer",fontSize:11,fontWeight:600}}>⬇️ Backup</button>
        <button onClick={onImport} title="Importar backup" style={{background:"#0a0a1a",border:"1px solid #1a1a4a",borderRadius:6,padding:"4px 9px",color:"#818cf8",cursor:"pointer",fontSize:11,fontWeight:600}}>⬆️ Restaurar</button>
        <span style={{fontSize:11,color:"#64748b",marginLeft:4}}>{USERS[user]?.name}</span>
        <button onClick={onLogout} style={{background:"#111120",border:"1px solid #1e1e35",borderRadius:6,padding:"4px 9px",color:"#94a3b8",cursor:"pointer",fontSize:11}}>Sair</button>
      </div>
    </div>
  </div>);
}

function BrandBanner({brand,co}){return(<div style={{background:`linear-gradient(135deg,${brand.c}20,${brand.c2||brand.c}10)`,borderBottom:`1px solid ${brand.c}33`,padding:"10px 20px"}}><div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",gap:12}}>{co==="veritas"?<VLogo s={38}/>:<RLogo s={38}/>}<div><div style={{fontWeight:800,fontSize:16,color:"#fff"}}>{brand.name}</div><div style={{fontSize:11,color:`${brand.c}cc`}}>{brand.tagline}</div></div></div></div>);}
function Toast({toast}){const ok=toast.type==="ok";return(<div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:ok?"#0a2a0f":"#2a0a0a",border:`1px solid ${ok?"#4ade80":"#f87171"}`,color:ok?"#4ade80":"#f87171",padding:"10px 22px",borderRadius:12,fontSize:13,fontWeight:600,zIndex:9999,whiteSpace:"nowrap"}}>{toast.msg}</div>);}

// ─── TODAY BAR ────────────────────────────────────────────────
function TodayBar({agenda,bpo,brand}){
  const ac=brand?.c||"#c9a96e";
  const today=todayStr(); const now=new Date(); const dom=now.getDate(); const dow=now.getDay();
  const [dismissed,setDismissed]=useState([]);
  const items=[];
  (agenda||[]).forEach(ev=>{
    const d=daysLeft(ev.date);
    if(d>=0&&d<=7) items.push({id:"ag_"+ev.id,title:ev.title,date:ev.date,time:ev.time,daysLeft:d,evType:ev.type,notes:ev.notes});
  });
  (bpo||[]).forEach((c)=>{
    (c.tasks||[]).forEach(t=>{
      const due=(t.freq==="daily")||(t.freq==="monthly"&&t.dia===dom)||(t.freq==="weekly"&&t.dia===dow)||(t.freq==="pontual"&&t.date===today);
      if(due&&!(c.done||{})[`${t.id}_${today}`]) items.push({id:`bpo_${c.id}_${t.id}`,title:t.label,client:c.name,daysLeft:0,type:"bpo",icon:t.icon||"📌"});
    });
  });
  const vis=items.filter(x=>!dismissed.includes(x.id));
  if(!vis.length) return null;
  const todayI=vis.filter(x=>x.daysLeft===0);
  const upcoming=vis.filter(x=>x.daysLeft>0).sort((a,b)=>a.daysLeft-b.daysLeft);
  return(<div style={{maxWidth:1200,margin:"12px auto 0",padding:"0 16px"}}>
    {todayI.length>0&&<div style={{background:"#1a0808",border:"1px solid #7f1d1d",borderRadius:12,padding:"12px 16px",marginBottom:8}}>
      <p style={{color:"#f87171",fontWeight:700,fontSize:12,margin:"0 0 8px"}}>🔴 HOJE — {todayI.length} item(s)</p>
      {todayI.map(r=><div key={r.id} style={{display:"flex",alignItems:"center",gap:10,background:"#0f0505",borderRadius:8,padding:"8px 12px",marginBottom:5}}>
        <span>{r.icon||"📅"}</span>
        <div style={{flex:1}}><span style={{color:"#fca5a5",fontWeight:600,fontSize:13}}>{r.title}</span>{r.client&&<span style={{color:"#64748b",fontSize:12,marginLeft:8}}>· {r.client}</span>}</div>
        {r.evType==="reuniao"?<button onClick={()=>openCalendar(r.title,r.date,r.time,r.notes||"")} style={{...btnSm,"#0d1f0d":1,background:"#0d1f0d",color:"#4ade80"}}>📅 Cal</button>:<button onClick={()=>openReminder(r.title,r.date,r.notes||"")} style={{...btnSm,background:"#0d1f0d",color:"#4ade80"}}>🔔 Lembrete</button>}
        <button onClick={()=>setDismissed(d=>[...d,r.id])} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:18}}>×</button>
      </div>)}
    </div>}
    {upcoming.length>0&&<div style={{background:"#0f1a0f",border:`1px solid ${ac}44`,borderRadius:12,padding:"12px 16px",marginBottom:8}}>
      <p style={{color:ac,fontWeight:700,fontSize:12,margin:"0 0 8px"}}>🔔 PRÓXIMOS — {upcoming.length} evento(s)</p>
      {upcoming.map(r=>{const bc=r.daysLeft===1?"#f97316":r.daysLeft<=3?"#eab308":ac;return(<div key={r.id} style={{display:"flex",alignItems:"center",gap:10,background:"#0a1a0a",borderRadius:8,padding:"8px 12px",marginBottom:5}}>
        <span style={{background:bc+"22",color:bc,fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:800,whiteSpace:"nowrap"}}>{r.daysLeft===1?"Amanhã":`${r.daysLeft}d`}</span>
        <div style={{flex:1}}><span style={{color:"#e2e8f0",fontWeight:600,fontSize:13}}>{r.title}</span><span style={{color:"#64748b",fontSize:12,marginLeft:8}}>· {fmtDate(r.date)}{r.time&&` às ${r.time}`}</span></div>
        {r.evType==="reuniao"?<button onClick={()=>openCalendar(r.title,r.date,r.time,"")} style={{...btnSm,background:"#0d1f0d",color:"#4ade80"}}>📅 Cal</button>:<button onClick={()=>openReminder(r.title,r.date,"")} style={{...btnSm,background:"#0d1f0d",color:"#4ade80"}}>🔔 Lembrete</button>}
        <button onClick={()=>setDismissed(d=>[...d,r.id])} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:18}}>×</button>
      </div>);})}
    </div>}
  </div>);
}
const btnSm={border:"none",borderRadius:6,padding:"4px 9px",cursor:"pointer",fontSize:11,fontWeight:600};

// ─── CLIENTES TAB (RECORD) ─────────────────────────────────────
function ClientesTab({clients,allClients,co,onSave,brand}){
  const [sel,setSel]=useState(null); const [showAdd,setShowAdd]=useState(false); const ac=brand.c;
  const add=form=>{ onSave([...allClients,{id:uid(),co,...form,since:todayStr(),steps:{},docs:{received:[],pending:[]},sistemas:{dominio:{user:"",pass:"",obs:""},zappy:{user:"",pass:"",obs:""}},boas_vindas:{jantar:false,kit:false,obs:""}}]); setShowAdd(false); };
  const upd=(cid,patch)=>onSave(allClients.map(c=>c.id===cid?{...c,...patch}:c));
  const del=cid=>{if(window.confirm("Remover cliente?"))onSave(allClients.filter(c=>c.id!==cid));};
  const selC=clients.find(c=>c.id===sel);
  const progress=c=>{const tot=ONBOARDING_STEPS.length;const done=ONBOARDING_STEPS.filter(s=>c.steps?.[s.id]?.done).length;return{done,tot,pct:Math.round(done/tot*100)};};
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <div><h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#fff"}}>Clientes — Onboarding</h2><p style={{margin:"4px 0 0",color:"#475569",fontSize:13}}>{brand.name} · {clients.length} cliente(s)</p></div>
      <Btn ac={ac} onClick={()=>setShowAdd(true)}>+ Novo Cliente</Btn>
    </div>
    {showAdd&&<Modal title="Novo Cliente" onClose={()=>setShowAdd(false)}><AddClientForm onSave={add} ac={ac}/></Modal>}
    {sel&&selC?(
      <ClientDetail client={selC} onBack={()=>setSel(null)} onUpdate={patch=>upd(sel,patch)} ac={ac}/>
    ):(
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
        {clients.length===0&&<Empty text="Nenhum cliente ainda. Clique em '+ Novo Cliente'."/>}
        {clients.map(c=>{const{done,tot,pct}=progress(c); return(
          <div key={c.id} onClick={()=>setSel(c.id)} style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:14,padding:18,cursor:"pointer",transition:"border-color .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=ac} onMouseLeave={e=>e.currentTarget.style.borderColor="#1a1a2e"}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div><div style={{fontWeight:700,color:"#fff",fontSize:16,marginBottom:4}}>{c.name}</div><span style={{background:c.type==="transfer"?"#1e3a5f22":"#14532d22",color:c.type==="transfer"?"#60a5fa":"#4ade80",fontSize:11,padding:"2px 10px",borderRadius:20,fontWeight:600}}>{c.type==="transfer"?"🔄 Transferência":"🆕 Constituição"}</span></div>
              <button onClick={e=>{e.stopPropagation();del(c.id);}} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:14}}>🗑️</button>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:"#64748b"}}>Onboarding</span><span style={{fontSize:12,fontWeight:700,color:pct===100?"#4ade80":"#94a3b8"}}>{done}/{tot}</span></div>
              <div style={{background:"#1a1a2e",borderRadius:20,height:6,overflow:"hidden"}}><div style={{background:pct===100?"#4ade80":ac,height:"100%",width:`${pct}%`,borderRadius:20,transition:"width .3s"}}/></div>
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{ONBOARDING_STEPS.map(s=><span key={s.id} title={s.label} style={{fontSize:16,opacity:c.steps?.[s.id]?.done?1:0.2}}>{s.icon}</span>)}</div>
            <div style={{marginTop:10,fontSize:11,color:"#475569"}}>Desde {fmtDate(c.since)}</div>
          </div>
        );})}
      </div>
    )}
  </div>);
}

function AddClientForm({onSave,ac}){
  const [form,setForm]=useState({name:"",type:"transfer",cnpj:"",regime:"",responsavel:""});
  return(<div>
    <Field label="Razão Social / Nome"><Inp value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="Razão social"/></Field>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="Tipo"><Sel value={form.type} onChange={v=>setForm(f=>({...f,type:v}))} opts={[["transfer","🔄 Transferência"],["constitution","🆕 Constituição"]]}/></Field>
      <Field label="CNPJ"><Inp value={form.cnpj} onChange={v=>setForm(f=>({...f,cnpj:maskCNPJ(v)}))} placeholder="00.000.000/0000-00"/></Field>
      <Field label="Regime Tributário"><Sel value={form.regime} onChange={v=>setForm(f=>({...f,regime:v}))} opts={[["","Selecione..."],...REGIMES.map(r=>[r,r])]}/></Field>
      <Field label="Responsável / Contato"><Inp value={form.responsavel} onChange={v=>setForm(f=>({...f,responsavel:v}))} placeholder="Nome do sócio responsável"/></Field>
    </div>
    <Btn ac={ac} full onClick={()=>form.name.trim()&&onSave(form)}>Cadastrar Cliente</Btn>
  </div>);
}

// ─── CLIENT DETAIL ────────────────────────────────────────────
function ClientDetail({client,onBack,onUpdate,ac}){
  const [tab,setTab]=useState("checklist");
  const tabs=[{id:"checklist",label:"✅ Checklist"},{id:"docs",label:"📋 Documentos"},{id:"sistemas",label:"💻 Sistemas"},{id:"boas_vindas",label:"🎁 Boas-vindas"}];
  const done=ONBOARDING_STEPS.filter(s=>client.steps?.[s.id]?.done).length;
  const pct=Math.round(done/ONBOARDING_STEPS.length*100);
  return(<div>
    <button onClick={onBack} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:14,marginBottom:16,padding:0}}>← Voltar</button>
    <div style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:14,padding:20,marginBottom:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <h2 style={{margin:"0 0 4px",fontSize:20,fontWeight:800,color:"#fff"}}>{client.name}</h2>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <span style={{background:client.type==="transfer"?"#1e3a5f22":"#14532d22",color:client.type==="transfer"?"#60a5fa":"#4ade80",fontSize:11,padding:"2px 10px",borderRadius:20,fontWeight:600}}>{client.type==="transfer"?"🔄 Transferência":"🆕 Constituição"}</span>
            {client.cnpj&&<span style={{background:"#1a1a2e",color:"#64748b",fontSize:11,padding:"2px 10px",borderRadius:20}}>{client.cnpj}</span>}
            {client.regime&&<span style={{background:"#1a1a2e",color:"#94a3b8",fontSize:11,padding:"2px 10px",borderRadius:20}}>{client.regime}</span>}
          </div>
        </div>
        <span style={{background:pct===100?"#14532d":"#1a1a2e",color:pct===100?"#4ade80":"#94a3b8",fontSize:14,padding:"4px 14px",borderRadius:20,fontWeight:700}}>{pct}%</span>
      </div>
      <div style={{background:"#1a1a2e",borderRadius:20,height:7,overflow:"hidden",marginTop:14}}><div style={{background:pct===100?"#4ade80":ac,height:"100%",width:`${pct}%`,borderRadius:20,transition:"width .3s"}}/></div>
    </div>
    <div style={{display:"flex",gap:4,background:"#0f0f1c",borderRadius:10,padding:4,marginBottom:18,width:"fit-content"}}>
      {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"6px 14px",borderRadius:7,border:"none",cursor:"pointer",fontSize:12,fontWeight:tab===t.id?700:400,background:tab===t.id?ac:"transparent",color:tab===t.id?"#fff":"#64748b"}}>{t.label}</button>)}
    </div>
    {tab==="checklist"&&<ChecklistTab client={client} onUpdate={onUpdate} ac={ac}/>}
    {tab==="docs"&&<DocsTab client={client} onUpdate={onUpdate} ac={ac}/>}
    {tab==="sistemas"&&<SistemasTab client={client} onUpdate={onUpdate} ac={ac}/>}
    {tab==="boas_vindas"&&<BoasVindasTab client={client} onUpdate={onUpdate} ac={ac}/>}
  </div>);
}

function ChecklistTab({client,onUpdate,ac}){
  const [exp,setExp]=useState(null);
  const toggleDone=sid=>{ const steps={...(client.steps||{})}; steps[sid]={...steps[sid],done:!steps[sid]?.done,doneAt:!steps[sid]?.done?todayStr():null}; onUpdate({steps}); };
  const updStep=(sid,k,v)=>{ const steps={...(client.steps||{})}; steps[sid]={...steps[sid],[k]:v}; onUpdate({steps}); };
  return(<div style={{display:"flex",flexDirection:"column",gap:8}}>
    {ONBOARDING_STEPS.map(s=>{
      const step=client.steps?.[s.id]||{}; const open=exp===s.id;
      return(<div key={s.id} style={{background:"#0f0f1c",border:`1px solid ${step.done?"#1a4a2e":"#1a1a2e"}`,borderRadius:12,overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",cursor:"pointer"}} onClick={()=>setExp(open?null:s.id)}>
          <div onClick={e=>{e.stopPropagation();toggleDone(s.id);}} style={{width:22,height:22,borderRadius:6,border:`2px solid ${step.done?ac:"#2a2a45"}`,background:step.done?ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>{step.done&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}</div>
          <span style={{fontSize:20}}>{s.icon}</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,color:step.done?"#4ade80":"#e2e8f0",fontSize:14,textDecoration:step.done?"line-through":"none"}}>{s.label}</div>
            <div style={{fontSize:11,color:"#475569"}}>{step.done?`Concluído em ${fmtDate(step.doneAt)}`:s.desc}</div>
          </div>
          {step.done&&<span style={{background:"#14532d",color:"#4ade80",fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700}}>✓ OK</span>}
          <span style={{color:"#2a2a45",fontSize:12,transform:open?"rotate(180deg)":"none",display:"inline-block",transition:"transform .2s"}}>▼</span>
        </div>
        {open&&<div style={{borderTop:"1px solid #1a1a2e",padding:"14px 16px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <Field label="Data"><Inp type="date" value={step.date||""} onChange={v=>updStep(s.id,"date",v)}/></Field>
            <Field label="Responsável"><Inp value={step.responsible||""} onChange={v=>updStep(s.id,"responsible",v)} placeholder="Quem executou"/></Field>
          </div>
          <Field label="Observações"><Textarea value={step.notes||""} onChange={v=>updStep(s.id,"notes",v)} placeholder="Detalhes, anotações..."/></Field>
          {(s.id==="onboarding"||s.id==="mes1"||s.id==="trimestral"||s.id==="semestral")&&(
            <button onClick={()=>openCalendar(`${s.label} — ${client.name}`,step.date||todayStr(),"09:00",step.notes||"")} style={{marginTop:8,background:"#0d1f0d",border:"none",borderRadius:7,padding:"7px 14px",color:"#4ade80",cursor:"pointer",fontSize:12,fontWeight:600}}>📅 Abrir no Google Agenda</button>
          )}
        </div>}
      </div>);
    })}
  </div>);
}

function DocsTab({client,onUpdate,ac}){
  const docs=client.docs||{received:[],pending:[]};
  const lista=client.type==="transfer"?DOCS_TRANSFER:DOCS_CONSTITUTION;
  const toggle=(doc)=>{
    const recv=[...(docs.received||[])];
    const idx=recv.indexOf(doc);
    if(idx>=0) recv.splice(idx,1); else recv.push(doc);
    onUpdate({docs:{...docs,received:recv}});
  };
  const addPending=()=>{
    const nome=prompt("Nome do documento pendente:"); if(!nome?.trim()) return;
    onUpdate({docs:{...docs,pending:[...(docs.pending||[]),{nome:nome.trim(),obs:"",prazo:""}]}});
  };
  const recvCount=(docs.received||[]).length;
  return(<div>
    <div style={{background:`${ac}10`,border:`1px solid ${ac}33`,borderRadius:10,padding:"10px 16px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{color:ac,fontWeight:700,fontSize:13}}>📋 Documentos recebidos: {recvCount}/{lista.length}</span>
      <div style={{background:"#1a1a2e",borderRadius:20,height:8,width:120,overflow:"hidden"}}><div style={{background:ac,height:"100%",width:`${Math.round(recvCount/lista.length*100)}%`,borderRadius:20}}/></div>
    </div>
    <p style={{fontSize:11,fontWeight:700,color:"#64748b",margin:"0 0 10px"}}>LISTA DE DOCUMENTOS — {client.type==="transfer"?"TRANSFERÊNCIA":"CONSTITUIÇÃO"}</p>
    <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
      {lista.map(doc=>{
        const recv=(docs.received||[]).includes(doc);
        return(<div key={doc} onClick={()=>toggle(doc)} style={{display:"flex",alignItems:"center",gap:12,background:"#0f0f1c",border:`1px solid ${recv?"#1a4a2e":"#1a1a2e"}`,borderRadius:9,padding:"10px 14px",cursor:"pointer"}}>
          <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${recv?ac:"#2a2a45"}`,background:recv?ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{recv&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}</div>
          <span style={{fontSize:13,color:recv?"#4ade80":"#e2e8f0",textDecoration:recv?"line-through":"none"}}>{doc}</span>
          {recv&&<span style={{marginLeft:"auto",background:"#14532d",color:"#4ade80",fontSize:10,padding:"1px 8px",borderRadius:20,fontWeight:600}}>Recebido</span>}
        </div>);
      })}
    </div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <p style={{fontSize:11,fontWeight:700,color:"#64748b",margin:0}}>PENDÊNCIAS ADICIONAIS</p>
      <button onClick={addPending} style={{background:"#1a1a2e",border:`1px solid ${ac}44`,borderRadius:6,padding:"4px 12px",color:ac,cursor:"pointer",fontSize:11,fontWeight:600}}>+ Adicionar</button>
    </div>
    {(docs.pending||[]).length===0&&<p style={{color:"#2a2a45",fontSize:12,textAlign:"center",padding:"12px 0"}}>Nenhuma pendência adicional.</p>}
    {(docs.pending||[]).map((p,i)=>(
      <div key={i} style={{background:"#0f0f1c",border:"1px solid #2a1a1a",borderRadius:9,padding:"10px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:14}}>⚠️</span><span style={{color:"#fca5a5",fontSize:13,flex:1}}>{p.nome}</span>
        <button onClick={()=>{const pend=[...docs.pending];pend.splice(i,1);onUpdate({docs:{...docs,pending:pend}});}} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:16}}>×</button>
      </div>
    ))}
  </div>);
}

function SistemasTab({client,onUpdate,ac}){
  const sis=client.sistemas||{dominio:{user:"",pass:"",obs:""},zappy:{user:"",pass:"",obs:""}};
  const upd=(sys,k,v)=>onUpdate({sistemas:{...sis,[sys]:{...sis[sys],[k]:v}}});
  const [showPwd,setShowPwd]=useState({});
  const sistemas=[{id:"dominio",label:"💻 Sistema Domínio",desc:"Plataforma contábil principal",color:"#3b82f6"},{id:"zappy",label:"📱 Zappy Contábil",desc:"Portal do cliente",color:"#10b981"}];
  return(<div>
    <div style={{background:"#0a0f0a",border:"1px solid #1a3a1a",borderRadius:8,padding:"8px 14px",marginBottom:16,display:"flex",gap:8,alignItems:"center"}}><span>🔒</span><span style={{color:"#4ade80",fontSize:12,fontWeight:600}}>Dados armazenados com segurança · uso interno apenas</span></div>
    {sistemas.map(({id,label,desc,color})=>(
      <div key={id} style={{background:"#0f0f1c",border:`1px solid ${color}33`,borderRadius:12,padding:18,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <span style={{background:color+"22",color,fontSize:12,padding:"3px 10px",borderRadius:20,fontWeight:700}}>{label}</span>
          <span style={{fontSize:11,color:"#475569"}}>{desc}</span>
          {sis[id]?.user&&sis[id]?.pass&&<span style={{marginLeft:"auto",background:"#14532d",color:"#4ade80",fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:600}}>✓ Configurado</span>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Field label="Usuário / Login"><Inp value={sis[id]?.user||""} onChange={v=>upd(id,"user",v)} placeholder="Login do sistema"/></Field>
          <Field label="Senha">
            <div style={{position:"relative"}}>
              <input value={sis[id]?.pass||""} onChange={e=>upd(id,"pass",e.target.value)} type={showPwd[id]?"text":"password"} placeholder="••••••••" style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"9px 40px 9px 12px",color:"#fff",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
              <button onClick={()=>setShowPwd(s=>({...s,[id]:!s[id]}))} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:15,padding:0}}>{showPwd[id]?"🙈":"👁️"}</button>
            </div>
          </Field>
          <Field label="Observações" style={{gridColumn:"1/-1"}}><Textarea value={sis[id]?.obs||""} onChange={v=>upd(id,"obs",v)} placeholder="Token, URL de acesso, observações..."/></Field>
        </div>
      </div>
    ))}
  </div>);
}

function BoasVindasTab({client,onUpdate,ac}){
  const bv=client.boas_vindas||{jantar:false,kit:false,obs:""};
  const upd=(k,v)=>onUpdate({boas_vindas:{...bv,[k]:v}});
  return(<div>
    <p style={{fontSize:11,fontWeight:700,color:"#64748b",margin:"0 0 14px"}}>BOAS-VINDAS — marque o que foi realizado</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}}>
      {[{id:"jantar",icon:"🍽️",label:"Jantar de Boas-vindas",desc:"Jantar de confraternização com o cliente"},{id:"kit",icon:"🎁",label:"Kit de Boas-vindas",desc:"Envio de kit personalizado para o cliente"}].map(({id,icon,label,desc})=>(
        <div key={id} onClick={()=>upd(id,!bv[id])} style={{background:bv[id]?"#0a2a1a":"#0f0f1c",border:`2px solid ${bv[id]?ac:"#1a1a2e"}`,borderRadius:14,padding:18,cursor:"pointer",textAlign:"center",transition:"all .15s"}}>
          <div style={{fontSize:36,marginBottom:8}}>{icon}</div>
          <div style={{fontWeight:700,color:bv[id]?"#4ade80":"#fff",fontSize:14,marginBottom:4}}>{label}</div>
          <div style={{fontSize:11,color:"#475569"}}>{desc}</div>
          {bv[id]&&<div style={{marginTop:10,background:"#14532d",color:"#4ade80",fontSize:11,padding:"3px 12px",borderRadius:20,fontWeight:700,display:"inline-block"}}>✓ Realizado</div>}
        </div>
      ))}
    </div>
    <Field label="Observações / Detalhes"><Textarea value={bv.obs||""} onChange={v=>upd("obs",v)} placeholder="Data do jantar, itens do kit, notas..."/></Field>
  </div>);
}

// ─── REUNIÕES TAB (RECORD) ─────────────────────────────────────
function ReunioesTab({clients,allMeetings,co,onSave,brand}){
  const [showNew,setShowNew]=useState(false); const [ataId,setAtaId]=useState(null); const ac=brand.c;
  const meetings=allMeetings.filter(m=>m.co===co);
  const upcoming=meetings.filter(m=>m.nextDate&&daysLeft(m.nextDate)<=30&&daysLeft(m.nextDate)>=0).sort((a,b)=>a.nextDate>b.nextDate?1:-1);
  const add=form=>{ const t=MTG_TYPES.find(x=>x.id===form.type); onSave([...allMeetings,{id:uid(),co,...form,nextDate:t?.months>0?addMonths(form.date,t.months):null,ata:null}]); setShowNew(false); };
  const del=mid=>{if(window.confirm("Remover?"))onSave(allMeetings.filter(m=>m.id!==mid));};
  const ataM=allMeetings.find(m=>m.id===ataId);
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <div><h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#fff"}}>Reuniões & Eventos</h2><p style={{margin:"4px 0 0",color:"#475569",fontSize:13}}>Com clientes ou eventos livres do escritório</p></div>
      <Btn ac={ac} onClick={()=>setShowNew(true)}>+ Nova Reunião</Btn>
    </div>
    {upcoming.length>0&&(<div style={{background:"#110d1e",border:"1px solid #3b1f5e",borderRadius:12,padding:14,marginBottom:20}}>
      <p style={{margin:"0 0 10px",color:"#c084fc",fontWeight:700,fontSize:12}}>⏰ REUNIÕES PARA AGENDAR EM BREVE</p>
      {upcoming.map(m=>{const c=clients.find(x=>x.id===m.clientId);const d=daysLeft(m.nextDate);return(
        <div key={m.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#0f0a1a",borderRadius:8,padding:"8px 12px",marginBottom:5}}>
          <span style={{color:"#e2e8f0",fontSize:13}}>{c?.name||m.clientName||"Evento"} · {MTG_TYPES.find(t=>t.id===m.type)?.label} · {fmtDate(m.nextDate)}</span>
          <span style={{background:d<=7?"#450a0a":"#2d1a06",color:d<=7?"#f87171":"#fb923c",padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:700}}>{d===0?"Hoje!":d===1?"Amanhã":`${d}d`}</span>
        </div>
      );})}
    </div>)}
    {showNew&&<Modal title="Nova Reunião / Evento" onClose={()=>setShowNew(false)} wide><NewMeetingForm clients={clients} onSave={add} ac={ac}/></Modal>}
    {ataM&&<Modal title={`Ata — ${clients.find(c=>c.id===ataM.clientId)?.name||ataM.clientName||"Evento"}`} onClose={()=>setAtaId(null)} wide><AtaEditor meeting={ataM} clients={clients} onSave={ata=>{onSave(allMeetings.map(m=>m.id===ataId?{...m,ata}:m));setAtaId(null);}} ac={ac}/></Modal>}
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {meetings.length===0&&<Empty text="Nenhuma reunião registrada"/>}
      {[...meetings].sort((a,b)=>b.date>a.date?1:-1).map(m=>{
        const c=clients.find(x=>x.id===m.clientId); const t=MTG_TYPES.find(x=>x.id===m.type);
        const nome=c?.name||m.clientName||"Evento livre";
        return(<div key={m.id} style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:12,padding:"14px 16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontWeight:600,color:"#fff",fontSize:15}}>{nome}</div>
              <div style={{color:"#64748b",fontSize:13,marginTop:2}}>{t?.label} · {fmtDate(m.date)}{m.attendees&&<span style={{color:"#94a3b8",marginLeft:8}}>· {m.attendees}</span>}{m.nextDate&&<span style={{color:"#a855f7",marginLeft:10}}>↻ {fmtDate(m.nextDate)}</span>}</div>
            </div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>openCalendar(`${t?.label||"Reunião"}: ${nome}`,m.date,m.time||"09:00",m.agenda||"")} style={{background:"#0d1f0d",border:"none",borderRadius:7,padding:"6px 10px",color:"#4ade80",cursor:"pointer",fontSize:12,fontWeight:600}}>📅 Cal</button>
              {m.ata?<button onClick={()=>setAtaId(m.id)} style={{background:"#14532d",border:"none",borderRadius:7,padding:"6px 10px",color:"#4ade80",cursor:"pointer",fontSize:12,fontWeight:600}}>📄 Ata</button>:<button onClick={()=>setAtaId(m.id)} style={{background:"#1e3a5f",border:"none",borderRadius:7,padding:"6px 10px",color:"#60a5fa",cursor:"pointer",fontSize:12,fontWeight:600}}>✨ Gerar Ata</button>}
              <button onClick={()=>del(m.id)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:16}}>🗑️</button>
            </div>
          </div>
        </div>);
      })}
    </div>
  </div>);
}

function NewMeetingForm({clients,onSave,ac}){
  const [form,setForm]=useState({clientId:"",clientName:"",type:"trimestral",date:todayStr(),time:"09:00",attendees:"",agenda:""});
  return(<div>
    <div style={{background:"#1a1a2e",borderRadius:8,padding:"9px 14px",marginBottom:14,fontSize:12,color:"#64748b"}}>💡 <strong style={{color:"#94a3b8"}}>Cliente é opcional.</strong> Você pode criar eventos livres do escritório ou da Veritas sem vincular a um cliente.</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="Cliente (opcional)" style={{gridColumn:"1/-1"}}><Sel value={form.clientId} onChange={v=>setForm(f=>({...f,clientId:v}))} opts={[["","— Sem cliente (evento livre) —"],...clients.map(c=>[c.id,c.name])]}/></Field>
      {!form.clientId&&<Field label="Quem / Descrição" style={{gridColumn:"1/-1"}}><Inp value={form.clientName} onChange={v=>setForm(f=>({...f,clientName:v}))} placeholder="Ex: Reunião interna, Visita banco, Fornecedor ABC..."/></Field>}
      <Field label="Tipo"><Sel value={form.type} onChange={v=>setForm(f=>({...f,type:v}))} opts={MTG_TYPES.map(t=>[t.id,t.label])}/></Field>
      <Field label="Data"><Inp type="date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))}/></Field>
      <Field label="Horário"><Inp type="time" value={form.time} onChange={v=>setForm(f=>({...f,time:v}))}/></Field>
      <Field label="Participantes"><Inp value={form.attendees} onChange={v=>setForm(f=>({...f,attendees:v}))} placeholder="Daniela, Marcus..."/></Field>
    </div>
    <Field label="Pauta / Observações"><Textarea value={form.agenda} onChange={v=>setForm(f=>({...f,agenda:v}))} placeholder="Pontos a discutir..."/></Field>
    <Btn ac={ac} full onClick={()=>form.date&&(form.clientId||form.clientName.trim())&&onSave(form)}>Salvar</Btn>
  </div>);
}

function AtaEditor({meeting,clients,onSave,ac}){
  const [ata,setAta]=useState(meeting.ata||""); const [loading,setLoading]=useState(false);
  const client=clients.find(c=>c.id===meeting.clientId);
  const ti=MTG_TYPES.find(t=>t.id===meeting.type);
  const nome=client?.name||meeting.clientName||"Evento";
  const generate=async()=>{
    setLoading(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,messages:[{role:"user",content:`Gere uma ata de reunião profissional em português:\nCliente/Evento: ${nome}\nTipo: ${ti?.label}\nData: ${fmtDate(meeting.date)}\nParticipantes: ${meeting.attendees||"—"}\nPauta: ${meeting.agenda||"—"}\nFormato: Cabeçalho, Participantes, Pontos numerados, Encaminhamentos com responsáveis, Próxima reunião, Assinaturas.`}]})});
      const d=await res.json(); setAta(d.content?.[0]?.text||"Erro ao gerar.");
    }catch{setAta("Erro ao conectar.");}
    setLoading(false);
  };
  return(<div>
    <div style={{display:"flex",gap:8,marginBottom:12}}>
      <button onClick={generate} disabled={loading} style={{background:loading?"#1a1a2e":ac,border:"none",borderRadius:8,padding:"8px 14px",color:"#fff",cursor:loading?"not-allowed":"pointer",fontSize:13,fontWeight:600,opacity:loading?0.6:1}}>{loading?"⏳ Gerando...":"✨ Gerar com IA"}</button>
      {ata&&<button onClick={()=>navigator.clipboard?.writeText(ata)} style={{background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"8px 12px",color:"#94a3b8",cursor:"pointer",fontSize:13}}>📋 Copiar</button>}
    </div>
    <textarea value={ata} onChange={e=>setAta(e.target.value)} rows={16} placeholder="Clique em 'Gerar com IA' ou escreva manualmente..." style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:10,padding:"12px",color:"#e2e8f0",fontSize:13,resize:"vertical",fontFamily:"Georgia,serif",lineHeight:1.7,boxSizing:"border-box"}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
      <button onClick={()=>onSave(ata)} style={{background:"#14532d",border:"none",borderRadius:8,padding:"11px",color:"#4ade80",fontWeight:700,cursor:"pointer",fontSize:13}}>💾 Salvar</button>
      <button onClick={()=>{const w=window.open("","_blank");if(w){w.document.write(`<html><body style="font-family:Georgia;padding:60px;max-width:760px;margin:auto"><pre style="white-space:pre-wrap;font-family:inherit">${ata}</pre></body></html>`);w.document.close();w.print();}}} style={{background:"#1e3a5f",border:"none",borderRadius:8,padding:"11px",color:"#60a5fa",fontWeight:700,cursor:"pointer",fontSize:13}}>🖨️ Imprimir</button>
    </div>
  </div>);
}

// ─── AGENDA TAB ───────────────────────────────────────────────
function AgendaTab({agenda,onSave,brand}){
  const [view,setView]=useState("month"); const [showAdd,setShowAdd]=useState(false); const [sel,setSel]=useState(null);
  const [calRef,setCalRef]=useState(()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth(),1);});
  const ac=brand.c; const today=todayStr();
  const add=form=>{onSave([...agenda,{id:uid(),...form}]);setShowAdd(false);};
  const del=id=>{onSave(agenda.filter(e=>e.id!==id));setSel(null);};
  const y=calRef.getFullYear(),mo=calRef.getMonth(),fd=new Date(y,mo,1).getDay(),dim=new Date(y,mo+1,0).getDate();
  const dayMap={}; agenda.forEach(e=>{dayMap[e.date]=[...(dayMap[e.date]||[]),e];});
  const typeColor={reuniao:"#6366f1",tarefa:"#f59e0b",lembrete:"#c9a96e",outro:"#64748b"};

  // Week view
  const [weekRef,setWeekRef]=useState(()=>{const n=new Date();n.setDate(n.getDate()-n.getDay());return n;});
  const weekDays=Array.from({length:7},(_,i)=>{const d=new Date(weekRef);d.setDate(d.getDate()+i);return d;});

  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div><h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#fff"}}>Agenda</h2><p style={{margin:"4px 0 0",color:"#475569",fontSize:13}}>Eventos, reuniões e lembretes</p></div>
      <div style={{display:"flex",gap:8}}>
        <div style={{display:"flex",gap:2,background:"#0f0f1c",borderRadius:8,padding:3}}>
          {[["month","📅 Mês"],["week","📆 Semana"],["list","📋 Lista"]].map(([v,l])=><button key={v} onClick={()=>setView(v)} style={{padding:"5px 11px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:view===v?700:400,background:view===v?ac:"transparent",color:view===v?"#fff":"#64748b"}}>{l}</button>)}
        </div>
        <Btn ac={ac} onClick={()=>setShowAdd(true)}>+ Evento</Btn>
      </div>
    </div>
    {showAdd&&<Modal title="Novo Evento" onClose={()=>setShowAdd(false)}><AddEventForm onSave={add} ac={ac}/></Modal>}
    {sel&&<Modal title="Evento" onClose={()=>setSel(null)}>
      <div style={{background:"#1a1a2e",borderRadius:10,padding:16,marginBottom:14}}>
        <div style={{fontWeight:700,color:"#fff",fontSize:17,marginBottom:8}}>{sel.title}</div>
        {sel.participant&&<div style={{fontSize:13,color:"#94a3b8",marginBottom:4}}>👤 {sel.participant}</div>}
        <div style={{color:"#64748b",fontSize:13}}>📅 {fmtDate(sel.date)}{sel.time&&<span style={{marginLeft:8}}>🕐 {sel.time}</span>}</div>
        {sel.notes&&<div style={{color:"#94a3b8",fontSize:13,marginTop:8}}>{sel.notes}</div>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <button onClick={()=>sel.type==="reuniao"?openCalendar(sel.title,sel.date,sel.time,sel.notes):openReminder(sel.title,sel.date,sel.notes)} style={{background:"#0d1f0d",border:"none",borderRadius:8,padding:"10px",color:"#4ade80",fontWeight:600,cursor:"pointer",fontSize:13}}>{sel.type==="reuniao"?"📅 Google Cal — Reunião":"🔔 Google Cal — Lembrete"}</button>
        <button onClick={()=>{window.open(`mailto:danimcustodiof@gmail.com,mvmcustodio@gmail.com?subject=${encodeURIComponent("[GestorPro] "+sel.title)}&body=${encodeURIComponent(sel.title+"\nData: "+fmtDate(sel.date))}`);}} style={{background:"#1e3a5f",border:"none",borderRadius:8,padding:"10px",color:"#60a5fa",fontWeight:600,cursor:"pointer",fontSize:13}}>✉️ E-mail</button>
        <button onClick={()=>del(sel.id)} style={{background:"#450a0a",border:"none",borderRadius:8,padding:"10px",color:"#f87171",fontWeight:600,cursor:"pointer",fontSize:13}}>🗑️ Excluir</button>
        <button onClick={()=>setSel(null)} style={{background:"#1a1a2e",border:"none",borderRadius:8,padding:"10px",color:"#94a3b8",cursor:"pointer",fontSize:13}}>Fechar</button>
      </div>
    </Modal>}

    {view==="month"&&<div style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:14,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderBottom:"1px solid #1a1a2e",background:"#0c0c18"}}>
        <button onClick={()=>setCalRef(new Date(y,mo-1,1))} style={{background:"#1a1a2e",border:"none",borderRadius:7,padding:"6px 14px",color:"#94a3b8",cursor:"pointer",fontSize:16}}>‹</button>
        <div style={{textAlign:"center"}}><div style={{fontWeight:800,fontSize:17,color:"#fff"}}>{calRef.toLocaleDateString("pt-BR",{month:"long",year:"numeric"}).replace(/^\w/,c=>c.toUpperCase())}</div><div style={{fontSize:11,color:"#475569",marginTop:2}}>{agenda.filter(e=>{const d=new Date(e.date+"T12:00:00");return d.getMonth()===mo&&d.getFullYear()===y;}).length} evento(s)</div></div>
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
            {evts.slice(0,3).map((e,i)=>{const cc=typeColor[e.type]||"#6366f1";return(<div key={i} onClick={()=>setSel(e)} title={e.title} style={{background:cc+"22",borderLeft:`3px solid ${cc}`,borderRadius:"0 3px 3px 0",padding:"1px 5px",marginBottom:2,fontSize:10,color:cc,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",cursor:"pointer"}}>{e.title}</div>);})}
            {evts.length>3&&<div style={{fontSize:9,color:"#475569",paddingLeft:5}}>+{evts.length-3}</div>}
          </div>);
        })}
      </div>
    </div>}

    {view==="week"&&<div style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:14,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderBottom:"1px solid #1a1a2e",background:"#0c0c18"}}>
        <button onClick={()=>{const d=new Date(weekRef);d.setDate(d.getDate()-7);setWeekRef(new Date(d));}} style={{background:"#1a1a2e",border:"none",borderRadius:7,padding:"6px 14px",color:"#94a3b8",cursor:"pointer",fontSize:16}}>‹</button>
        <div style={{fontWeight:800,fontSize:16,color:"#fff"}}>{fmtDate(weekDays[0].toISOString().slice(0,10))} — {fmtDate(weekDays[6].toISOString().slice(0,10))}</div>
        <button onClick={()=>{const d=new Date(weekRef);d.setDate(d.getDate()+7);setWeekRef(new Date(d));}} style={{background:"#1a1a2e",border:"none",borderRadius:7,padding:"6px 14px",color:"#94a3b8",cursor:"pointer",fontSize:16}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
        {weekDays.map((d,i)=>{
          const ds=d.toISOString().slice(0,10); const evts=dayMap[ds]||[]; const isT=ds===today; const isWE=i===0||i===6;
          return(<div key={i} style={{minHeight:160,borderRight:i<6?"1px solid #1a1a2e":"none",padding:"8px 6px",background:isT?`${ac}14`:isWE?"#0a0a12":"transparent"}}>
            <div style={{textAlign:"center",marginBottom:8}}>
              <div style={{fontSize:11,color:"#475569",fontWeight:600}}>{WDAYS[i]}</div>
              <div style={{fontSize:18,fontWeight:isT?800:400,color:isT?"#fff":"#64748b",background:isT?ac:"transparent",width:32,height:32,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",margin:"2px auto"}}>{d.getDate()}</div>
            </div>
            {evts.map((e,j)=>{const cc=typeColor[e.type]||"#6366f1";return(<div key={j} onClick={()=>setSel(e)} style={{background:cc+"22",borderLeft:`3px solid ${cc}`,borderRadius:"0 4px 4px 0",padding:"3px 6px",marginBottom:3,fontSize:11,color:cc,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.time&&<span style={{marginRight:4}}>{e.time}</span>}{e.title}</div>);})}
          </div>);
        })}
      </div>
    </div>}

    {view==="list"&&<div>
      {agenda.length===0&&<Empty text="Nenhum evento na agenda"/>}
      {[...agenda].filter(e=>e.date>=today).sort((a,b)=>a.date>b.date?1:-1).map(e=>(
        <div key={e.id} onClick={()=>setSel(e)} style={{display:"flex",alignItems:"center",gap:12,background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:10,padding:"12px 14px",marginBottom:6,cursor:"pointer"}} onMouseEnter={ev=>ev.currentTarget.style.borderColor=ac} onMouseLeave={ev=>ev.currentTarget.style.borderColor="#1a1a2e"}>
          <div style={{width:8,height:8,borderRadius:4,background:typeColor[e.type]||"#6366f1",flexShrink:0}}/>
          <div style={{flex:1}}><div style={{fontWeight:600,color:"#fff",fontSize:14}}>{e.title}</div><div style={{color:"#64748b",fontSize:12}}>{fmtDate(e.date)}{e.time&&` às ${e.time}`}{e.participant&&<span style={{color:"#94a3b8",marginLeft:8}}>· {e.participant}</span>}</div></div>
          {daysLeft(e.date)===0&&<span style={{background:"#14532d",color:"#4ade80",fontSize:11,padding:"2px 9px",borderRadius:20,fontWeight:700}}>Hoje</span>}
          {daysLeft(e.date)===1&&<span style={{background:"#2d1a06",color:"#fb923c",fontSize:11,padding:"2px 9px",borderRadius:20,fontWeight:700}}>Amanhã</span>}
        </div>
      ))}
    </div>}
  </div>);
}

function AddEventForm({onSave,ac}){
  const [form,setForm]=useState({title:"",date:todayStr(),time:"",type:"reuniao",participant:"",participantType:"pessoa",notes:""});
  return(<div>
    <Field label="Título do evento"><Inp value={form.title} onChange={v=>setForm(f=>({...f,title:v}))} placeholder="Ex: Reunião com cliente, Visita banco..."/></Field>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="Data"><Inp type="date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))}/></Field>
      <Field label="Horário"><Inp type="time" value={form.time} onChange={v=>setForm(f=>({...f,time:v}))}/></Field>
      <Field label="Tipo"><Sel value={form.type} onChange={v=>setForm(f=>({...f,type:v}))} opts={[["reuniao","🤝 Reunião"],["tarefa","✅ Tarefa"],["lembrete","🔔 Lembrete"],["outro","📌 Outro"]]}/></Field>
      <Field label="Tipo de pessoa"><Sel value={form.participantType} onChange={v=>setForm(f=>({...f,participantType:v}))} opts={[["pessoa","👤 Pessoa/Geral"],["colaborador","👔 Colaborador"],["fornecedor","🏢 Fornecedor"],["cliente","🧾 Cliente"],["banco","🏦 Banco"]]}/></Field>
    </div>
    <Field label={`Nome — ${form.participantType==="colaborador"?"Colaborador":form.participantType==="fornecedor"?"Fornecedor":form.participantType==="cliente"?"Cliente":form.participantType==="banco"?"Banco":"Participante"}`}><Inp value={form.participant} onChange={v=>setForm(f=>({...f,participant:v}))} placeholder="Nome, empresa ou pessoa..."/></Field>
    <Field label="Observações"><Textarea value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))} placeholder="Pauta, detalhes, objetivo..."/></Field>
    <Btn ac={ac} full onClick={()=>form.title.trim()&&form.date&&onSave(form)}>Salvar Evento</Btn>
  </div>);
}

// ─── BPO TAB (VERITAS) ───────────────────────────────────────
function BpoTab({bpo,onSave,brand}){
  const [view,setView]=useState("hoje"); const [showAdd,setShowAdd]=useState(false); const [selId,setSelId]=useState(null);
  const ac=brand.c; const today=todayStr(); const now=new Date(); const dom=now.getDate(); const dow=now.getDay();

  const add=form=>onSave([...bpo,{id:uid(),...form,done:{},tasks:[]}]);
  const upd=(cid,patch)=>onSave(bpo.map(c=>c.id===cid?{...c,...patch}:c));
  const del=cid=>{if(window.confirm("Remover cliente?"))onSave(bpo.filter(c=>c.id!==cid));};
  const toggleDone=(cid,tid)=>onSave(bpo.map(c=>{if(c.id!==cid)return c;const k=`${tid}_${today}`;return{...c,done:{...(c.done||{}),[k]:!(c.done||{})[k]}};}));

  const todayTasks=[];
  bpo.forEach((c,ci)=>{(c.tasks||[]).forEach(t=>{
    const due=(t.freq==="daily")||(t.freq==="monthly"&&t.dia===dom)||(t.freq==="weekly"&&t.dia===dow)||(t.freq==="pontual"&&t.date===today);
    if(due) todayTasks.push({client:c,ci,task:t,done:(c.done||{})[`${t.id}_${today}`]});
  });});
  const doneCnt=todayTasks.filter(x=>x.done).length;

  const [calRef,setCalRef]=useState(()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth(),1);});
  const cy=calRef.getFullYear(),cmo=calRef.getMonth(),cdim=new Date(cy,cmo+1,0).getDate(),cfd=new Date(cy,cmo,1).getDay();
  const calMap={};
  bpo.forEach((c,ci)=>{(c.tasks||[]).forEach(t=>{
    if(t.freq==="monthly"&&t.dia>=1&&t.dia<=cdim){const ds=`${cy}-${String(cmo+1).padStart(2,"0")}-${String(t.dia).padStart(2,"0")}`;calMap[ds]=[...(calMap[ds]||[]),{c,ci,t}];}
    if(t.freq==="weekly"){for(let d=1;d<=cdim;d++){if(new Date(cy,cmo,d).getDay()===t.dia){const ds=`${cy}-${String(cmo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;calMap[ds]=[...(calMap[ds]||[]),{c,ci,t}];}}}
    if(t.freq==="daily"){for(let d=1;d<=cdim;d++){const wd=new Date(cy,cmo,d).getDay();if(wd>0&&wd<6){const ds=`${cy}-${String(cmo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;calMap[ds]=[...(calMap[ds]||[]),{c,ci,t}];}}}
    if(t.freq==="pontual"&&t.date){const d=new Date(t.date+"T12:00:00");if(d.getFullYear()===cy&&d.getMonth()===cmo){calMap[t.date]=[...(calMap[t.date]||[]),{c,ci,t}];}}
  });});

  const selClient=bpo.find(c=>c.id===selId);

  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div><h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#fff"}}>BPO Financeiro</h2><p style={{margin:"4px 0 0",color:"#475569",fontSize:13}}>{brand.name} · {bpo.length} cliente(s)</p></div>
      <Btn ac={ac} onClick={()=>setShowAdd(true)}>+ Novo Cliente</Btn>
    </div>

    {showAdd&&<Modal title="Novo Cliente BPO" onClose={()=>setShowAdd(false)}><AddBpoClientForm onSave={form=>{add(form);setShowAdd(false);}} ac={ac}/></Modal>}
    {selId&&selClient&&<Modal title={`Tarefas — ${selClient.name}`} onClose={()=>setSelId(null)} wide><BpoClientEditor client={selClient} clientIdx={bpo.findIndex(c=>c.id===selId)} onSave={patch=>{upd(selId,patch);setSelId(null);}} ac={ac}/></Modal>}

    <div style={{display:"flex",gap:4,marginBottom:18,background:"#0f0f1c",borderRadius:9,padding:4,width:"fit-content"}}>
      {[["hoje","📋 Hoje"],["calendario","📅 Calendário"],["clientes","👥 Clientes"]].map(([v,l])=>(
        <button key={v} onClick={()=>setView(v)} style={{padding:"6px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:view===v?700:400,background:view===v?ac:"transparent",color:view===v?"#fff":"#64748b"}}>{l}</button>
      ))}
    </div>

    {view==="hoje"&&<div>
      <div style={{background:`${ac}10`,border:`1px solid ${ac}44`,borderRadius:12,padding:"13px 16px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{color:ac,fontWeight:700,fontSize:12}}>📅 {now.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</span>
          <span style={{background:doneCnt===todayTasks.length&&todayTasks.length>0?"#14532d":ac+"22",color:doneCnt===todayTasks.length&&todayTasks.length>0?"#4ade80":ac,fontSize:11,padding:"2px 10px",borderRadius:20,fontWeight:700}}>{doneCnt}/{todayTasks.length} concluídas</span>
        </div>
        {todayTasks.length===0&&<p style={{color:"#475569",fontSize:13,margin:0,textAlign:"center",padding:"8px 0"}}>Nenhuma tarefa para hoje 🎉</p>}
        {todayTasks.map(({client,ci,task,done},i)=>{const cc=clientColor(ci);const tc=BPO_CAT_COLORS[task.cat]||ac;return(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:"#0f0f1c",borderRadius:8,padding:"9px 12px",border:`1px solid ${done?"#1a4a2e":"#1a1a2e"}`,marginBottom:5}}>
            <Chk checked={done} ac={tc} onClick={()=>toggleDone(client.id,task.id)}/>
            <span style={{fontSize:15}}>{task.icon||"📌"}</span>
            <div style={{flex:1}}>
              <span style={{fontWeight:600,color:done?"#475569":"#fff",textDecoration:done?"line-through":"none",fontSize:14}}>{task.label}</span>
              <span style={{fontSize:12,color:cc,fontWeight:600,marginLeft:8}}>· {client.name}</span>
              {task.notes&&<span style={{fontSize:11,color:"#64748b",marginLeft:8}}>· {task.notes}</span>}
            </div>
            <span style={{background:tc+"22",color:tc,fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:600}}>{BPO_CATS[task.cat]||task.cat}</span>
            {task.freq==="pontual"&&<span style={{background:"#14b8a622",color:"#14b8a6",fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:600}}>Pontual</span>}
          </div>
        );})}
      </div>
    </div>}

    {view==="calendario"&&<div style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:14,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderBottom:"1px solid #1a1a2e",background:"#0c0c18"}}>
        <button onClick={()=>setCalRef(new Date(cy,cmo-1,1))} style={{background:"#1a1a2e",border:"none",borderRadius:7,padding:"6px 14px",color:"#94a3b8",cursor:"pointer",fontSize:16}}>‹</button>
        <div style={{textAlign:"center"}}><div style={{fontWeight:800,fontSize:17,color:"#fff"}}>{calRef.toLocaleDateString("pt-BR",{month:"long",year:"numeric"}).replace(/^\w/,c=>c.toUpperCase())}</div><div style={{fontSize:11,color:"#475569",marginTop:2}}>{Object.values(calMap).reduce((a,b)=>a+b.length,0)} tarefa(s)</div></div>
        <button onClick={()=>setCalRef(new Date(cy,cmo+1,1))} style={{background:"#1a1a2e",border:"none",borderRadius:7,padding:"6px 14px",color:"#94a3b8",cursor:"pointer",fontSize:16}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:"1px solid #1a1a2e"}}>{WDAYS.map(d=><div key={d} style={{textAlign:"center",padding:"9px 4px",fontSize:11,fontWeight:700,color:"#475569"}}>{d}</div>)}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
        {Array.from({length:cfd}).map((_,i)=><div key={`e${i}`} style={{minHeight:90,borderRight:"1px solid #141420",borderBottom:"1px solid #141420",background:"#09090f"}}/>)}
        {Array.from({length:cdim},(_,i)=>i+1).map(d=>{
          const ds=`${cy}-${String(cmo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          const evts=calMap[ds]||[]; const isT=ds===today; const isWE=new Date(ds+"T12:00:00").getDay()%6===0; const isL=(cfd+d-1)%7===6;
          return(<div key={d} style={{minHeight:90,borderRight:isL?"none":"1px solid #1a1a2e",borderBottom:"1px solid #1a1a2e",padding:"5px",background:isT?`${ac}14`:isWE?"#0a0a12":"transparent"}}>
            <div style={{display:"flex",justifyContent:"flex-end",marginBottom:3}}><span style={{fontSize:12,fontWeight:isT?800:400,color:isT?"#fff":"#64748b",background:isT?ac:"transparent",width:22,height:22,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center"}}>{d}</span></div>
            {evts.slice(0,4).map(({c,ci,t},i)=>{const cc=clientColor(ci);const done=(c.done||{})[`${t.id}_${ds}`];return(<div key={i} title={`${t.label} · ${c.name}`} style={{background:cc+"22",borderLeft:`3px solid ${done?"#4ade80":cc}`,borderRadius:"0 3px 3px 0",padding:"1px 5px",marginBottom:2,fontSize:10,color:done?"#4ade80":cc,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",textDecoration:done?"line-through":"none"}}>{t.icon||"📌"} {t.label}</div>);})}
            {evts.length>4&&<div style={{fontSize:9,color:"#475569",paddingLeft:5}}>+{evts.length-4}</div>}
          </div>);
        })}
      </div>
      {bpo.length>0&&<div style={{padding:"10px 16px",borderTop:"1px solid #1a1a2e",display:"flex",gap:14,flexWrap:"wrap"}}>{bpo.map((c,ci)=><div key={c.id} style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,borderRadius:2,background:clientColor(ci)}}/><span style={{fontSize:11,color:"#64748b"}}>{c.name}</span></div>)}</div>}
    </div>}

    {view==="clientes"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
      {bpo.length===0&&<Empty text="Nenhum cliente BPO"/>}
      {bpo.map((c,ci)=>{const cc=clientColor(ci);const recQtd=(c.tasks||[]).filter(t=>t.freq!=="pontual").length;const ptQtd=(c.tasks||[]).filter(t=>t.freq==="pontual").length;return(
        <div key={c.id} style={{background:"#0f0f1c",border:`1px solid ${cc}44`,borderRadius:12,padding:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{width:10,height:10,borderRadius:5,background:cc}}/><div style={{fontWeight:700,color:"#fff",fontSize:15}}>{c.name}</div></div>{c.regime&&<span style={{background:cc+"22",color:cc,fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:600}}>{c.regime}</span>}</div>
            <button onClick={()=>del(c.id)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:14}}>🗑️</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
            {[[recQtd+"","Recorrentes"],[ptQtd+"","Pontuais"]].map(([n,l])=>(
              <div key={l} style={{background:"#1a1a2e",borderRadius:8,padding:"8px 6px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:cc}}>{n}</div><div style={{fontSize:10,color:"#64748b"}}>{l}</div></div>
            ))}
          </div>
          <button onClick={()=>setSelId(c.id)} style={{width:"100%",background:cc+"18",border:`1px solid ${cc}44`,borderRadius:8,padding:"8px",color:cc,cursor:"pointer",fontSize:12,fontWeight:700}}>⚙️ Gerenciar Tarefas</button>
        </div>
      );})}
    </div>}
  </div>);
}

function AddBpoClientForm({onSave,ac}){
  const [form,setForm]=useState({name:"",regime:""});
  return(<div>
    <Field label="Nome do Cliente"><Inp value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="Razão social"/></Field>
    <Field label="Regime Tributário"><Sel value={form.regime} onChange={v=>setForm(f=>({...f,regime:v}))} opts={[["","Selecione..."],...REGIMES.map(r=>[r,r])]}/></Field>
    <Btn ac={ac} full onClick={()=>form.name.trim()&&onSave(form)}>Criar Cliente</Btn>
  </div>);
}

function BpoClientEditor({client,clientIdx,onSave,ac}){
  const [tasks,setTasks]=useState(()=>(client.tasks||[]).map(t=>({...t})));
  const [showSug,setShowSug]=useState(false); const [newTask,setNewTask]=useState(null);
  const cc=clientColor(clientIdx);

  const del=id=>setTasks(ts=>ts.filter(t=>t.id!==id));
  const upd=(id,patch)=>setTasks(ts=>ts.map(t=>t.id===id?{...t,...patch}:t));
  const addSug=s=>{if(!tasks.some(t=>t.id===s.id))setTasks(ts=>[...ts,{...s,detalhes:{}}]);};

  const blankTask={id:uid(),label:"",freq:"pontual",date:todayStr(),dia:1,cat:"pontual",icon:"📌",notes:""};

  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
      <span style={{width:10,height:10,borderRadius:5,background:cc}}/>
      <span style={{color:cc,fontWeight:700,fontSize:14}}>{client.name}</span>
      {client.regime&&<span style={{background:cc+"22",color:cc,fontSize:10,padding:"2px 8px",borderRadius:20}}>{client.regime}</span>}
    </div>

    <div style={{display:"flex",gap:8,marginBottom:14}}>
      <button onClick={()=>setNewTask({...blankTask,id:uid(),freq:"pontual"})} style={{background:"#14b8a622",border:"1px solid #14b8a644",borderRadius:7,padding:"6px 12px",color:"#14b8a6",cursor:"pointer",fontSize:12,fontWeight:600}}>+ Tarefa Pontual</button>
      <button onClick={()=>setNewTask({...blankTask,id:uid(),freq:"monthly",dia:1})} style={{background:`${cc}22`,border:`1px solid ${cc}44`,borderRadius:7,padding:"6px 12px",color:cc,cursor:"pointer",fontSize:12,fontWeight:600}}>+ Tarefa Recorrente</button>
      <button onClick={()=>setShowSug(v=>!v)} style={{background:"#1a1a2e",border:"1px solid #252540",borderRadius:7,padding:"6px 12px",color:"#94a3b8",cursor:"pointer",fontSize:12,fontWeight:600}}>📋 Sugestões</button>
    </div>

    {newTask&&<div style={{background:"#111120",border:`1px solid ${cc}44`,borderRadius:10,padding:16,marginBottom:12}}>
      <p style={{fontSize:11,fontWeight:700,color:cc,margin:"0 0 12px"}}>NOVA TAREFA {newTask.freq==="pontual"?"PONTUAL":"RECORRENTE"}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <Field label="Nome da tarefa" style={{gridColumn:"1/-1"}}><Inp value={newTask.label} onChange={v=>setNewTask(t=>({...t,label:v}))} placeholder="Ex: Enviar relatório, Pagar fornecedor..."/></Field>
        <Field label="Categoria"><Sel value={newTask.cat} onChange={v=>setNewTask(t=>({...t,cat:v}))} opts={Object.entries(BPO_CATS).map(([k,v])=>[k,v])}/></Field>
        <Field label="Ícone"><Inp value={newTask.icon} onChange={v=>setNewTask(t=>({...t,icon:v}))} placeholder="📌"/></Field>
        {newTask.freq==="pontual"?(
          <Field label="Data da tarefa"><Inp type="date" value={newTask.date||todayStr()} onChange={v=>setNewTask(t=>({...t,date:v}))}/></Field>
        ):(
          <>
            <Field label="Frequência"><Sel value={newTask.freq} onChange={v=>setNewTask(t=>({...t,freq:v}))} opts={[["monthly","Mensal"],["weekly","Semanal"],["daily","Diário"]]}/></Field>
            {newTask.freq==="monthly"&&<Field label="Dia do mês"><Inp type="number" value={newTask.dia||1} onChange={v=>setNewTask(t=>({...t,dia:parseInt(v)||1}))}/></Field>}
            {newTask.freq==="weekly"&&<Field label="Dia da semana"><Sel value={newTask.dia||1} onChange={v=>setNewTask(t=>({...t,dia:parseInt(v)}))} opts={WDAYS.map((d,i)=>[i,d])}/></Field>}
          </>
        )}
        <Field label="Observações" style={{gridColumn:"1/-1"}}><Textarea value={newTask.notes||""} onChange={v=>setNewTask(t=>({...t,notes:v}))} placeholder="Detalhes da tarefa..."/></Field>
      </div>
      <div style={{display:"flex",gap:8,marginTop:8}}>
        <button onClick={()=>{if(newTask.label.trim()){setTasks(ts=>[...ts,newTask]);setNewTask(null);}}} style={{background:cc,border:"none",borderRadius:7,padding:"7px 16px",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700}}>✓ Adicionar</button>
        <button onClick={()=>setNewTask(null)} style={{background:"#1a1a2e",border:"none",borderRadius:7,padding:"7px 16px",color:"#94a3b8",cursor:"pointer",fontSize:12}}>Cancelar</button>
      </div>
    </div>}

    {showSug&&<div style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:10,padding:12,marginBottom:12,maxHeight:240,overflowY:"auto"}}>
      <p style={{fontSize:11,fontWeight:700,color:"#64748b",margin:"0 0 8px"}}>TAREFAS SUGERIDAS</p>
      {BPO_SUGESTOES.filter(s=>!tasks.some(t=>t.id===s.id)).map(s=>{const tc=BPO_CAT_COLORS[s.cat]||"#64748b";return(
        <div key={s.id} onClick={()=>addSug(s)} style={{display:"flex",alignItems:"center",gap:10,borderRadius:8,padding:"7px 10px",cursor:"pointer",marginBottom:3}} onMouseEnter={e=>e.currentTarget.style.background="#1a1a2e"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <span style={{fontSize:14}}>{s.icon}</span>
          <div style={{flex:1}}><div style={{fontWeight:600,color:"#e2e8f0",fontSize:13}}>{s.label}</div><div style={{fontSize:10,color:"#475569"}}>{s.desc}</div></div>
          <span style={{background:tc+"22",color:tc,fontSize:10,padding:"2px 7px",borderRadius:20,fontWeight:600}}>{BPO_CATS[s.cat]}</span>
        </div>
      );})}
    </div>}

    <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14,maxHeight:400,overflowY:"auto"}}>
      {tasks.length===0&&<p style={{color:"#2a2a45",fontSize:13,textAlign:"center",padding:"20px 0"}}>Nenhuma tarefa. Adicione acima.</p>}
      {tasks.map(t=>{const tc=BPO_CAT_COLORS[t.cat]||"#64748b";return(
        <div key={t.id} style={{background:"#111120",border:`1px solid ${tc}33`,borderRadius:9,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:15}}>{t.icon||"📌"}</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,color:"#fff",fontSize:13}}>{t.label}</div>
            <div style={{fontSize:11,color:"#475569"}}>{t.freq==="pontual"?`📌 Pontual · ${fmtDate(t.date)}`:t.freq==="monthly"?`🔄 Mensal · dia ${t.dia}`:t.freq==="weekly"?`📆 Semanal · ${WDAYS[t.dia||1]}`:"📋 Diário"}</div>
          </div>
          <span style={{background:tc+"22",color:tc,fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:600}}>{BPO_CATS[t.cat]||t.cat}</span>
          <button onClick={()=>del(t.id)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:16}}>×</button>
        </div>
      );})}
    </div>
    <Btn ac={ac} full onClick={()=>onSave({tasks})}>💾 Salvar Tarefas</Btn>
  </div>);
}

// ─── DESIGN SYSTEM ────────────────────────────────────────────
function Modal({title,children,onClose,wide}){return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.82)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}}><div style={{background:"#0f0f1c",border:"1px solid #1e1e35",borderRadius:16,padding:24,width:"100%",maxWidth:wide?700:440,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 40px 100px rgba(0,0,0,.6)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><h3 style={{margin:0,fontSize:16,fontWeight:700,color:"#fff"}}>{title}</h3><button onClick={onClose} style={{background:"#1a1a2e",border:"none",borderRadius:6,width:28,height:28,color:"#94a3b8",cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button></div>{children}</div></div>);}
function Field({label,children,style}){return<div style={{marginBottom:12,...style}}><label style={{fontSize:10,color:"#64748b",display:"block",marginBottom:5,fontWeight:700,letterSpacing:"0.5px"}}>{label.toUpperCase()}</label>{children}</div>;}
function Inp({value,onChange,type="text",placeholder=""}){return<input value={value} onChange={e=>onChange(e.target.value)} type={type} placeholder={placeholder} style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"9px 12px",color:"#fff",fontSize:13,outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor="#6366f1"} onBlur={e=>e.target.style.borderColor="#252540"}/>;}
function Sel({value,onChange,opts}){return<select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"9px 12px",color:value?"#fff":"#64748b",fontSize:13,outline:"none"}}>{opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>;}
function Textarea({value,onChange,placeholder=""}){return<textarea value={value} onChange={e=>onChange(e.target.value)} rows={2} placeholder={placeholder} style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"8px 12px",color:"#e2e8f0",fontSize:13,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit",outline:"none"}}/>;}
function Btn({children,onClick,ac,full,style}){return<button onClick={onClick} style={{background:ac,border:"none",borderRadius:9,padding:"10px 16px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,width:full?"100%":"auto",...style}}>{children}</button>;}
function Chk({checked,ac,onClick}){return<div onClick={onClick} style={{width:22,height:22,borderRadius:6,border:`2px solid ${checked?ac:"#2a2a45"}`,background:checked?ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>{checked&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}</div>;}
function Empty({text}){return<div style={{textAlign:"center",padding:"48px 24px",gridColumn:"1/-1"}}><div style={{fontSize:40,marginBottom:10}}>📭</div><p style={{margin:0,fontSize:14,color:"#475569"}}>{text}</p></div>;}
