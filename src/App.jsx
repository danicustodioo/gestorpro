import { useState, useEffect } from "react";

const USERS = {
  daniela: { pw:"1234", access:["record","veritas"], name:"Daniela", role:"admin",   color:"#c9a96e" },
  marcus:  { pw:"1234", access:["record"],           name:"Marcus",  role:"partner", color:"#2a4a8a" },
  record:  { pw:"1234", access:["record"],           name:"Equipe Record",  role:"team", color:"#6366f1" },
  veritas: { pw:"1234", access:["veritas"],          name:"Equipe Veritas", role:"team", color:"#9333ea" },
};
const BRANDS = {
  record:  { name:"Record Assessoria Contábil", short:"Record", c:"#2a4a8a", c2:"#c9a96e", tagline:"Assessoria Contábil · 43 anos" },
  veritas: { name:"Veritas Hub", short:"Veritas", c:"#c9a96e", c2:"#8f775f", tagline:"BPO Financeiro · Segurança e Clareza" },
};
const STEPS = [
  { id:"cadastro",    label:"Cadastro",              icon:"📝" },
  { id:"info_equipe", label:"Info para Equipe",      icon:"👥" },
  { id:"onboarding",  label:"Reunião de Onboarding", icon:"🤝" },
  { id:"mes1",        label:"Reunião 1º Mês",        icon:"📅" },
  { id:"trimestral",  label:"Reunião Trimestral",    icon:"🔄" },
  { id:"jantar",      label:"Jantar de Boas-vindas", icon:"🍽️" },
];
const MTG_TYPES = [
  { id:"trimestral", label:"Trimestral", months:3 },
  { id:"semestral",  label:"Semestral",  months:6 },
  { id:"onboarding", label:"Onboarding", months:0 },
  { id:"mes1",       label:"1º Mês",     months:1 },
  { id:"outro",      label:"Outro",      months:0 },
];
const BPO_SUGESTOES = [
  { id:"saldo_diario",    label:"Verificação de Saldo",          freq:"daily",   dia:null, icon:"💰", cat:"caixa",     desc:"Conferir saldo de todas as contas bancárias" },
  { id:"lancamentos",     label:"Registro de Lançamentos",        freq:"daily",   dia:null, icon:"📝", cat:"caixa",     desc:"Lançar entradas e saídas do dia" },
  { id:"contas_pagar",    label:"Contas a Pagar",                freq:"weekly",  dia:3,    icon:"📤", cat:"pagamentos", desc:"Verificar e agendar pagamentos da semana" },
  { id:"contas_receber",  label:"Contas a Receber / Cobranças",  freq:"weekly",  dia:3,    icon:"📥", cat:"cobranca",   desc:"Acompanhar cobranças e inadimplências" },
  { id:"fluxo_semanal",   label:"Fluxo de Caixa Semanal",        freq:"weekly",  dia:5,    icon:"📊", cat:"relatorio",  desc:"Relatório semanal de entradas e saídas" },
  { id:"pix_colaborador", label:"PIX — Pagamento Colaboradores", freq:"weekly",  dia:5,    icon:"💸", cat:"pagamentos", desc:"Processar pagamentos de colaboradores via PIX" },
  { id:"pix_fornecedor",  label:"PIX — Pagamento Fornecedores",  freq:"weekly",  dia:5,    icon:"💸", cat:"pagamentos", desc:"Processar pagamentos a fornecedores via PIX" },
  { id:"iss",             label:"ISS",                           freq:"monthly", dia:10,   icon:"🏛️", cat:"fiscal",     desc:"Pagamento ISS Municipal" },
  { id:"inss",            label:"INSS",                          freq:"monthly", dia:20,   icon:"🏛️", cat:"fiscal",     desc:"Pagamento INSS" },
  { id:"fgts",            label:"FGTS",                          freq:"monthly", dia:20,   icon:"🏛️", cat:"fiscal",     desc:"Recolhimento FGTS" },
  { id:"ir_retido",       label:"IR Retido na Fonte",            freq:"monthly", dia:20,   icon:"🏛️", cat:"fiscal",     desc:"Pagamento IRRF" },
  { id:"das",             label:"DAS — Simples Nacional",        freq:"monthly", dia:20,   icon:"📋", cat:"fiscal",     desc:"Guia DAS Simples Nacional" },
  { id:"conciliacao",     label:"Conciliação Bancária",          freq:"monthly", dia:5,    icon:"🏦", cat:"bancario",   desc:"Conferir extrato bancário vs lançamentos" },
  { id:"folha",           label:"Folha de Pagamento",            freq:"monthly", dia:25,   icon:"👥", cat:"rh",         desc:"Processar folha e transferências de salário" },
  { id:"dre",             label:"DRE — Demonstrativo",          freq:"monthly", dia:10,   icon:"📈", cat:"relatorio",  desc:"Demonstrativo de resultado do mês anterior" },
  { id:"fluxo_mensal",    label:"Fluxo de Caixa Mensal",        freq:"monthly", dia:5,    icon:"📊", cat:"relatorio",  desc:"Projeção e análise mensal de caixa" },
  { id:"relatorio_ger",   label:"Relatório Gerencial",           freq:"monthly", dia:10,   icon:"📋", cat:"relatorio",  desc:"Relatório completo de gestão para o cliente" },
  { id:"reuniao_men",     label:"Reunião Mensal com Cliente",    freq:"monthly", dia:15,   icon:"🤝", cat:"reuniao",    desc:"Apresentação de resultados e alinhamentos" },
  { id:"budget",          label:"Revisão de Budget/Orçamento",  freq:"monthly", dia:20,   icon:"🎯", cat:"relatorio",  desc:"Revisão do planejamento orçamentário" },
  { id:"inadimplencia",   label:"Relatório de Inadimplência",   freq:"monthly", dia:8,    icon:"⚠️", cat:"cobranca",   desc:"Listar clientes/recebimentos em atraso" },
];
const CAT_COLORS = { caixa:"#10b981", pagamentos:"#f59e0b", cobranca:"#ef4444", relatorio:"#6366f1", bancario:"#3b82f6", rh:"#ec4899", fiscal:"#f97316", reuniao:"#8b5cf6" };
const CAT_LABELS = { caixa:"Caixa", pagamentos:"Pagamentos", cobranca:"Cobrança", relatorio:"Relatórios", bancario:"Bancário", rh:"RH", fiscal:"Fiscal", reuniao:"Reunião" };
const CLIENT_COLORS = ["#c9a96e","#10b981","#6366f1","#ef4444","#f59e0b","#3b82f6","#ec4899","#8b5cf6","#f97316","#14b8a6"];
const WDAYS   = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const REGIMES = ["MEI","Simples Nacional","Lucro Presumido","Lucro Real","Imune / Isenta"];

const uid        = () => Math.random().toString(36).slice(2,9);
const todayStr   = () => new Date().toISOString().slice(0,10);
const fmtDate    = d => d ? new Date(d+"T12:00:00").toLocaleDateString("pt-BR") : "—";
const daysLeft   = d => Math.ceil((new Date(d+"T12:00:00")-Date.now())/86400000);
const addMonths  = (d,n) => { const x=new Date(d+"T12:00:00"); x.setMonth(x.getMonth()+n); return x.toISOString().slice(0,10); };
const maskCNPJ   = v => v.replace(/\D/g,"").slice(0,14).replace(/^(\d{2})(\d)/,"$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3").replace(/\.(\d{3})(\d)/,".$1/$2").replace(/(\d{4})(\d)/,"$1-$2");
const maskPhone  = v => { const d=v.replace(/\D/g,"").slice(0,11); return d.length<=10?d.replace(/^(\d{2})(\d)/,"($1) $2").replace(/(\d{4})(\d)/,"$1-$2"):d.replace(/^(\d{2})(\d)/,"($1) $2").replace(/(\d{5})(\d)/,"$1-$2"); };
const clientColor = i => CLIENT_COLORS[i%CLIENT_COLORS.length];
const isPagamento = t => ["pix_colaborador","pix_fornecedor","contas_pagar","folha"].includes(t.id)||t.cat==="pagamentos"||t.cat==="rh";

// Storage usando window.storage (artifact-safe, sem localStorage)
const DB = {
  set: (k,v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} },
  load: async (k,def) => {
    try { const r = localStorage.getItem(k); if(r) return JSON.parse(r); } catch(e){}
    return def;
  }
};

const migrateBpo = data => {
  if (!Array.isArray(data)) return [];
  return data.map(c=>({ id:c.id||uid(), name:c.name||"", regime:c.regime||"",
    tasks:(c.tasks||[]).map(t=>({ ...t, dia:t.dia??t.day??t.weekday??null, freq:t.freq||"monthly", cat:t.cat||"outro", icon:t.icon||"📌", desc:t.desc||"", detalhes:t.detalhes||{} })),
    done:c.done||{}, cofre:c.cofre||{bancos:[],acessos:[]} }));
};

// Reuniões: abre com participantes e link de meet
const openCalendar = (title,date,time,notes) => {
  const d=date||todayStr(), t=time||"09:00";
  const fmt = x=>x.toISOString().replace(/[-:]/g,"").split(".")[0]+"Z";
  const s=new Date(`${d}T${t}:00`), e=new Date(s.getTime()+3600000);
  const p=new URLSearchParams({action:"TEMPLATE",text:title,dates:`${fmt(s)}/${fmt(e)}`,details:notes||"",add:"danimcustodiof@gmail.com,mvmcustodio@gmail.com"});
  window.open(`https://calendar.google.com/calendar/u/0/r/eventedit?${p}`,"_blank");
};
// Tarefas/lembretes: evento dia-inteiro (sem horário = Google NÃO adiciona Meet)
const openReminder = (title,date,notes) => {
  const d=(date||todayStr()).replace(/-/g,"");
  // Formato YYYYMMDD = dia inteiro, sem videoconferência automática
  const nextDay = new Date(date||todayStr()+"T12:00:00");
  nextDay.setDate(nextDay.getDate()+1);
  const d2=nextDay.toISOString().slice(0,10).replace(/-/g,"");
  const p=new URLSearchParams({action:"TEMPLATE",text:"🔔 "+title,dates:`${d}/${d2}`,details:notes||""});
  window.open(`https://calendar.google.com/calendar/u/0/r/eventedit?${p}`,"_blank");
};

const syncBpoToAgenda = (bpoClients, agendaAtual) => {
  const base = (agendaAtual||[]).filter(e=>!e.bpoRef);
  const novos = [];
  const now = new Date(); now.setHours(0,0,0,0);
  bpoClients.forEach((c,ci)=>{
    (c.tasks||[]).forEach(t=>{
      for(let m=0;m<=3;m++){
        const mb=new Date(now.getFullYear(),now.getMonth()+m,1);
        const dim=new Date(mb.getFullYear(),mb.getMonth()+1,0).getDate();
        const dates=[];
        if(t.freq==="monthly"&&t.dia>=1&&t.dia<=dim){ const x=new Date(mb.getFullYear(),mb.getMonth(),t.dia); if(x>=now) dates.push(x.toISOString().slice(0,10)); }
        if(t.freq==="weekly"){ for(let d=1;d<=dim;d++){ if(new Date(mb.getFullYear(),mb.getMonth(),d).getDay()===t.dia){ const x=new Date(mb.getFullYear(),mb.getMonth(),d); if(x>=now) dates.push(x.toISOString().slice(0,10)); } } }
        if(t.freq==="daily"&&m===0) dates.push(now.toISOString().slice(0,10));
        dates.forEach(date=>{ novos.push({id:`bpo_${c.id}_${t.id}_${date}`,title:`${t.icon} ${t.label} · ${c.name}`,date,time:"",type:"lembrete",notes:t.desc||"",bpoRef:{clientId:c.id,taskId:t.id},clientIdx:ci}); });
      }
    });
  });
  return [...base,...novos];
};

export default function App(){
  const [user,setUser]=useState(null); const [co,setCo]=useState(null); const [mod,setMod]=useState("onboarding");
  const [toast,setToast]=useState(null); const [ready,setReady]=useState(false);
  const [clients,setClients]=useState([]); const [meetings,setMeetings]=useState([]);
  const [bpo,setBpo]=useState([]); const [agenda,setAgenda]=useState([]);

  useEffect(()=>{
    (async()=>{
      const [c,m,b,a]=await Promise.all([DB.load("gp_clients",[]),DB.load("gp_meetings",[]),DB.load("gp_bpo",[]),DB.load("gp_agenda",[])]);
      setClients(c||[]); setMeetings(m||[]); setBpo(migrateBpo(b)); setAgenda(a||[]); setReady(true);
    })();
  },[]);

  const showToast=(msg,type="ok")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),2500); };

  const save=(key,val)=>{
    ({clients:setClients,meetings:setMeetings,bpo:setBpo,agenda:setAgenda})[key]?.(val);
    DB.set("gp_"+key,val);
    if(key!=="agenda") showToast("✅ Salvo!");
  };

  const saveBpo=val=>{ setBpo(val); DB.set("gp_bpo",val); const na=syncBpoToAgenda(val,agenda); setAgenda(na); DB.set("gp_agenda",na); showToast("✅ Salvo e agenda sincronizada!"); };

  if(!ready) return(
    <div style={{background:"#080810",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12,fontFamily:"system-ui"}}>
      <div style={{width:40,height:40,border:"3px solid #c9a96e33",borderTop:"3px solid #c9a96e",borderRadius:"50%",animation:"spin .8s linear infinite"}}/><p style={{color:"#475569",fontSize:13}}>Carregando...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if(!user) return <Login onLogin={u=>{ setUser(u); const a=USERS[u].access[0]; setCo(a); setMod(a==="veritas"?"bpo":"onboarding"); }}/>;

  const brand=BRANDS[co]; const acc=USERS[user].access; const coClients=clients.filter(c=>c.co===co);

  return(
    <div style={{background:"#080810",minHeight:"100vh",color:"#e2e8f0",fontFamily:"system-ui,sans-serif"}}>
      <TopBar user={user} co={co} setCo={v=>{setCo(v);setMod(v==="veritas"?"bpo":"onboarding");}} acc={acc} mod={mod} setMod={setMod} brand={brand} onLogout={()=>{setUser(null);setCo(null);}}
        exportData={{clients,meetings,bpo,agenda}}
        onImport={d=>{ if(d.clients){setClients(d.clients);DB.set("gp_clients",d.clients);} if(d.meetings){setMeetings(d.meetings);DB.set("gp_meetings",d.meetings);} if(d.bpo){const mb=migrateBpo(d.bpo);setBpo(mb);DB.set("gp_bpo",mb);} if(d.agenda){setAgenda(d.agenda);DB.set("gp_agenda",d.agenda);} showToast("✅ Dados importados com sucesso!"); }}
        showToast={showToast}/>
      <BrandBanner brand={brand} co={co}/>
      {toast&&<Toast toast={toast}/>}
      <RemindersBar agenda={agenda} bpo={bpo} brand={brand}/>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 16px"}}>
        {mod==="onboarding"&&co==="record"&&<OnboardingTab co={co} clients={coClients} allClients={clients} onSave={v=>save("clients",v)} brand={brand}/>}
        {mod==="meetings"  &&co==="record"&&<MeetingsTab   co={co} clients={coClients} allMeetings={meetings} onSave={v=>save("meetings",v)} brand={brand}/>}
        {mod==="agenda"    &&<AgendaTab agenda={agenda} onSave={v=>save("agenda",v)} brand={brand} user={user}/>}
        {mod==="bpo"       &&co==="veritas"&&<BpoTab bpo={bpo} onSave={saveBpo} brand={brand}/>}
      </div>
    </div>
  );
}

function VLogo({size=40}){return(<svg width={size} height={size} viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#9b7d5c"/><defs><linearGradient id="gv"><stop offset="0%" stopColor="#e4ce90"/><stop offset="100%" stopColor="#a07840"/></linearGradient></defs><path d="M27 25 C14 12 9 20 17 28 C21 32 35 48 50 76" stroke="url(#gv)" strokeWidth="4" fill="none" strokeLinecap="round"/><path d="M50 76 C62 50 70 33 76 23 C80 15 87 11 81 18 C77 23 74 19 78 13" stroke="url(#gv)" strokeWidth="1.8" fill="none" strokeLinecap="round"/></svg>);}
function RLogo({size=40}){return(<svg width={size} height={size} viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#152844"/><defs><linearGradient id="gr"><stop offset="0%" stopColor="#eedba8"/><stop offset="100%" stopColor="#9a7a3a"/></linearGradient></defs><line x1="25" y1="20" x2="25" y2="80" stroke="white" strokeWidth="7" strokeLinecap="round"/><path d="M25 20 C25 20 63 20 63 38 C63 56 25 56 25 56" stroke="white" strokeWidth="7" fill="none" strokeLinecap="round"/><line x1="37" y1="56" x2="68" y2="80" stroke="white" strokeWidth="7" strokeLinecap="round"/><path d="M31 24 L57 24 L44 41 Z" fill="url(#gr)"/><path d="M44 41 L31 55 L57 55 Z" fill="url(#gr)" opacity=".85"/></svg>);}
function LogoBadge({co,size=36}){ return co==="veritas"?<VLogo size={size}/>:<RLogo size={size}/>; }

function Login({onLogin}){
  const [u,setU]=useState(""); const [p,setP]=useState(""); const [err,setErr]=useState("");
  const go=()=>{ if(USERS[u]&&USERS[u].pw===p) onLogin(u); else setErr("Usuário ou senha incorretos."); };
  const VH="#c9a96e",RC="#2a4a8a",VB="#8f775f";
  return(
    <div style={{minHeight:"100vh",background:"#07070e",display:"flex",fontFamily:"system-ui",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:"-10%",left:"-5%",width:500,height:500,borderRadius:"50%",background:`radial-gradient(circle,${VH}15,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"-10%",right:"-5%",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${RC}15,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"60px 64px",position:"relative"}}>
        <div style={{position:"absolute",top:0,right:0,bottom:0,width:1,background:`linear-gradient(to bottom,transparent,${VH}55,transparent)`}}/>
        <div style={{marginBottom:48}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:14,background:`${VH}12`,border:`1px solid ${VH}44`,borderRadius:14,padding:"14px 20px",marginBottom:14}}><VLogo size={52}/><div><div style={{fontSize:24,fontWeight:800,color:"#fefff0"}}>Veritas</div><div style={{fontSize:11,letterSpacing:"6px",color:VH,textTransform:"uppercase"}}>HUB</div></div></div>
          <p style={{color:"#6a5a4a",fontSize:13,margin:0,maxWidth:280,lineHeight:1.8}}>BPO Financeiro · Segurança, clareza e estratégia para crescimento sustentável.</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:48}}>
          <div style={{flex:1,height:1,background:`linear-gradient(to right,${VH}22,transparent)`}}/><span style={{color:"#252535",fontSize:12}}>&amp;</span><div style={{flex:1,height:1,background:`linear-gradient(to left,${RC}22,transparent)`}}/>
        </div>
        <div>
          <div style={{display:"inline-flex",alignItems:"center",gap:14,background:`${RC}15`,border:`1px solid ${RC}44`,borderRadius:14,padding:"14px 20px",marginBottom:14}}><RLogo size={52}/><div><div style={{fontSize:24,fontWeight:800,color:"#eef2ff",letterSpacing:"1px",textTransform:"uppercase"}}>Record</div><div style={{fontSize:11,letterSpacing:"4px",color:VH,textTransform:"uppercase"}}>ASSESSORIA CONTÁBIL</div></div></div>
          <p style={{color:"#3a4a6a",fontSize:13,margin:0,maxWidth:280,lineHeight:1.8}}>Confiança e excelência. Há mais de 43 anos em Londrina.</p>
        </div>
      </div>
      <div style={{width:440,background:"#0c0c14",borderLeft:"1px solid #13131f",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 48px"}}>
        <div style={{width:"100%"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28}}>
            <div style={{width:4,height:32,borderRadius:2,background:`linear-gradient(to bottom,${VH},${RC})`}}/>
            <div><h1 style={{margin:0,fontSize:20,fontWeight:800,color:"#fff"}}>Bem-vindo de volta</h1><p style={{margin:0,color:"#3a3a5a",fontSize:13,marginTop:2}}>Plataforma integrada Record &amp; Veritas</p></div>
          </div>
          <p style={{fontSize:10,color:"#2a2a45",fontWeight:700,letterSpacing:"1.5px",margin:"0 0 10px"}}>ACESSO RÁPIDO</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:18}}>
            {[["daniela","Daniela","RC+VH"],["marcus","Marcus","RC"],["record","Record","RC"],["veritas","Veritas","VH"]].map(([id,nome,badge])=>(
              <button key={id} onClick={()=>setU(id)} style={{padding:"10px 12px",borderRadius:10,border:`1px solid ${u===id?VH+"66":"#1a1a2a"}`,background:u===id?`${VH}12`:"#111118",color:u===id?"#f5f0e6":"#475569",cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:24,height:24,borderRadius:6,background:`linear-gradient(135deg,${VH},${RC})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#fff",flexShrink:0}}>{badge}</div>
                <span style={{fontSize:12,fontWeight:u===id?700:400}}>{nome}</span>
              </button>
            ))}
          </div>
          <div style={{height:1,background:"#13131f",marginBottom:14}}/>
          {[["Usuário",u,setU,"text","👤"],["Senha",p,setP,"password","🔒"]].map(([lbl,val,set,type,icon])=>(
            <div key={lbl} style={{marginBottom:12}}>
              <label style={{fontSize:10,color:"#3a3a55",display:"block",marginBottom:5,fontWeight:700,letterSpacing:"1.5px"}}>{lbl.toUpperCase()}</label>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",opacity:0.4}}>{icon}</span>
                <input value={val} onChange={e=>set(e.target.value)} type={type} onKeyDown={e=>e.key==="Enter"&&go()} style={{width:"100%",background:"#111118",border:"1px solid #1a1a28",borderRadius:10,padding:"11px 14px 11px 38px",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
              </div>
            </div>
          ))}
          {err&&<div style={{background:"#2a0a0a",border:"1px solid #5a1a1a",borderRadius:8,padding:"8px 14px",marginBottom:12,color:"#f87171",fontSize:13}}>⚠️ {err}</div>}
          <button onClick={go} style={{width:"100%",background:`linear-gradient(135deg,${VH},${VB})`,border:"none",borderRadius:12,padding:"13px",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",marginTop:4}}>Entrar →</button>
          <p style={{textAlign:"center",color:"#1e1e2e",fontSize:11,marginTop:16}}>Senha padrão: <span style={{fontFamily:"monospace",color:"#2e2e48"}}>1234</span></p>
        </div>
      </div>
    </div>
  );
}

function TopBar({user,co,setCo,acc,mod,setMod,brand,onLogout,exportData,onImport,showToast}){
  const mods=co==="veritas"?[{id:"bpo",label:"💰 BPO Financeiro"},{id:"agenda",label:"🗓️ Agenda"}]:[{id:"onboarding",label:"🧩 Onboarding"},{id:"meetings",label:"📅 Reuniões"},{id:"agenda",label:"🗓️ Agenda"}];
  const ac=brand?.c||"#c9a96e";

  const doExport=()=>{
    const json=JSON.stringify(exportData,null,2);
    const blob=new Blob([json],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url; a.download=`gestorpro_backup_${todayStr()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const doImport=()=>{
    const input=document.createElement("input");
    input.type="file"; input.accept=".json";
    input.onchange=e=>{
      const file=e.target.files[0]; if(!file) return;
      const reader=new FileReader();
      reader.onload=ev=>{ try{ const d=JSON.parse(ev.target.result); onImport(d); }catch(err){ showToast("❌ Arquivo inválido","err"); } };
      reader.readAsText(file);
    };
    input.click();
  };

  return(<div style={{background:"#0c0c18",borderBottom:"1px solid #171728",padding:"0 20px",position:"sticky",top:0,zIndex:100}}>
    <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",gap:12,height:52}}>
      <span style={{fontWeight:800,fontSize:13,color:"#fff",whiteSpace:"nowrap"}}>⚡ GestorPro</span>
      {acc.length>1&&<div style={{display:"flex",gap:2,background:"#111120",borderRadius:8,padding:3}}>{acc.map(a=><button key={a} onClick={()=>setCo(a)} style={{padding:"3px 12px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:co===a?700:400,background:co===a?BRANDS[a].c:"transparent",color:co===a?"#fff":"#64748b"}}>{BRANDS[a].short}</button>)}</div>}
      <nav style={{display:"flex",gap:1,flex:1}}>{mods.map(m=><button key={m.id} onClick={()=>setMod(m.id)} style={{padding:"5px 12px",borderRadius:7,border:"none",cursor:"pointer",fontSize:12,fontWeight:mod===m.id?600:400,background:mod===m.id?"#1a1a2e":"transparent",color:mod===m.id?ac:"#64748b",whiteSpace:"nowrap"}}>{m.label}</button>)}</nav>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <button onClick={doExport} title="Exportar todos os dados como .json" style={{background:"#0a1a0a",border:"1px solid #1a4a1a",borderRadius:6,padding:"4px 10px",color:"#4ade80",cursor:"pointer",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>⬇️ Backup</button>
        <button onClick={doImport} title="Importar dados de um .json exportado anteriormente" style={{background:"#0a0a1a",border:"1px solid #1a1a4a",borderRadius:6,padding:"4px 10px",color:"#818cf8",cursor:"pointer",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>⬆️ Restaurar</button>
        <span style={{fontSize:11,color:"#64748b"}}>{USERS[user]?.name}</span>
        <button onClick={onLogout} style={{background:"#111120",border:"1px solid #1e1e35",borderRadius:6,padding:"4px 10px",color:"#94a3b8",cursor:"pointer",fontSize:11}}>Sair</button>
      </div>
    </div>
  </div>);
}

function BrandBanner({brand,co}){return(<div style={{background:`linear-gradient(135deg,${brand.c}20,${brand.c2||brand.c}10)`,borderBottom:`1px solid ${brand.c}33`,padding:"10px 20px"}}><div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",gap:12}}><LogoBadge co={co} size={40}/><div><div style={{fontWeight:800,fontSize:16,color:"#fff"}}>{brand.name}</div><div style={{fontSize:11,color:`${brand.c}cc`}}>{brand.tagline}</div></div></div></div>);}
function Toast({toast}){const ok=toast.type==="ok";return(<div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:ok?"#0a2a0f":"#2a0a0a",border:`1px solid ${ok?"#4ade80":"#f87171"}`,color:ok?"#4ade80":"#f87171",padding:"11px 24px",borderRadius:12,fontSize:13,fontWeight:600,zIndex:9999,whiteSpace:"nowrap"}}>{toast.msg}</div>);}

// ─── REMINDERS BAR (CORRIGIDO) ────────────────────────────────
// Botão 📅 Cal só aparece para eventos do tipo "reuniao"
// Lembretes e tarefas recorrentes (BPO) não geram link no Google Calendar
function RemindersBar({agenda,bpo,brand}){
  const ac=brand?.c||"#c9a96e"; const now=new Date(); const today=todayStr(); const dom=now.getDate(); const dow=now.getDay();
  const [dismissed,setDismissed]=useState([]);
  const items=[];

  // Eventos de agenda: salva evType (tipo original do evento)
  (agenda||[]).forEach(ev=>{
    const d=daysLeft(ev.date);
    if(d>=0&&d<=7&&!ev.bpoRef)
      items.push({id:"ag_"+ev.id+"_"+d, title:ev.title, date:ev.date, time:ev.time, daysLeft:d, type:"agenda", evType:ev.type});
  });

  // Tarefas BPO recorrentes (sem evType = nunca terão Cal)
  (bpo||[]).forEach((c,ci)=>{
    (c.tasks||[]).forEach(t=>{
      const due=(t.freq==="daily")||(t.freq==="monthly"&&t.dia===dom)||(t.freq==="weekly"&&t.dia===dow);
      if(due&&!(c.done||{})[`${t.id}_${today}`])
        items.push({id:`bpo_${c.id}_${t.id}`, title:t.label, client:c.name, daysLeft:0, type:"bpo", icon:t.icon});
    });
  });

  const visible=items.filter(x=>!dismissed.includes(x.id));
  if(!visible.length) return null;
  const todayI=visible.filter(x=>x.daysLeft===0);
  const upcoming=visible.filter(x=>x.daysLeft>0).sort((a,b)=>a.daysLeft-b.daysLeft);

  return(<div style={{maxWidth:1100,margin:"12px auto 0",padding:"0 16px"}}>
    {todayI.length>0&&(<div style={{background:"#1a0808",border:"1px solid #7f1d1d",borderRadius:12,padding:"12px 16px",marginBottom:8}}>
      <p style={{color:"#f87171",fontWeight:700,fontSize:12,margin:"0 0 8px"}}>🔴 HOJE — {todayI.length} item(s)</p>
      {todayI.map(r=>(<div key={r.id} style={{display:"flex",alignItems:"center",gap:10,background:"#0f0505",borderRadius:8,padding:"8px 12px",marginBottom:5}}>
        <span>{r.icon||"📅"}</span>
        <div style={{flex:1}}>
          <span style={{color:"#fca5a5",fontWeight:600,fontSize:13}}>{r.title}</span>
          {r.client&&<span style={{color:"#64748b",fontSize:12,marginLeft:8}}>· {r.client}</span>}
        </div>
        {/* Reunião: abre com participantes; tarefa/lembrete/BPO: lembrete simples */}
        <button onClick={()=>r.evType==="reuniao"?openCalendar(r.title,r.date,r.time,""):openReminder(r.title,r.date,r.client?`Cliente: ${r.client}`:"")} style={{background:"#0d1f0d",border:"none",borderRadius:6,padding:"4px 9px",color:"#4ade80",cursor:"pointer",fontSize:11,fontWeight:600}}>📅 {r.evType==="reuniao"?"Reunião":"Lembrete"}</button>
        <button onClick={()=>{ window.open(`mailto:danimcustodiof@gmail.com,mvmcustodio@gmail.com?subject=${encodeURIComponent("[GestorPro] HOJE: "+r.title)}&body=${encodeURIComponent(r.title+(r.client?"\nCliente: "+r.client:""))}`); }} style={{background:"#1e3a5f",border:"none",borderRadius:6,padding:"4px 9px",color:"#60a5fa",cursor:"pointer",fontSize:11,fontWeight:600}}>✉️</button>
        <button onClick={()=>setDismissed(d=>[...d,r.id])} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:16}}>×</button>
      </div>))}
    </div>)}
    {upcoming.length>0&&(<div style={{background:"#0f1a0f",border:`1px solid ${ac}44`,borderRadius:12,padding:"12px 16px",marginBottom:8}}>
      <p style={{color:ac,fontWeight:700,fontSize:12,margin:"0 0 8px"}}>🔔 PRÓXIMOS — {upcoming.length} evento(s)</p>
      {upcoming.map(r=>{ const bc=r.daysLeft===1?"#f97316":r.daysLeft<=3?"#eab308":ac; return(
        <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,background:"#0a1a0a",borderRadius:8,padding:"8px 12px",marginBottom:5}}>
          <span style={{background:bc+"22",color:bc,fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:800,whiteSpace:"nowrap"}}>{r.daysLeft===1?"Amanhã":`${r.daysLeft}d`}</span>
          <span>📅</span>
          <div style={{flex:1}}>
            <span style={{color:"#e2e8f0",fontWeight:600,fontSize:13}}>{r.title}</span>
            <span style={{color:"#64748b",fontSize:12,marginLeft:8}}>· {fmtDate(r.date)}{r.time&&` às ${r.time}`}</span>
          </div>
          {/* Reunião: abre com participantes; tarefa/lembrete/BPO: lembrete simples */}
          <button onClick={()=>r.evType==="reuniao"?openCalendar(r.title,r.date,r.time,""):openReminder(r.title,r.date,"")} style={{background:"#0d1f0d",border:"none",borderRadius:6,padding:"4px 9px",color:"#4ade80",cursor:"pointer",fontSize:11,fontWeight:600}}>📅 {r.evType==="reuniao"?"Reunião":"Lembrete"}</button>
          <button onClick={()=>setDismissed(d=>[...d,r.id])} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:16}}>×</button>
        </div>
      );})}
    </div>)}
  </div>);
}

function OnboardingTab({co,clients,allClients,onSave,brand}){
  const [sel,setSel]=useState(null); const [showAdd,setShowAdd]=useState(false); const ac=brand.c;
  const addClient=form=>{ onSave([...allClients,{id:uid(),co,name:form.name,type:form.type,since:todayStr(),steps:{},ficha:{razaoSocial:form.name,cnpj:"",regimeTributario:"",nomeFantasia:"",dataAbertura:"",adminFinanceiro:{nome:"",telefone:"",email:""},proprietarios:[{nome:"",telefone:"",email:""}],contadorAnterior:{nome:"",escritorio:"",telefone:"",email:""}}}]); setShowAdd(false); };
  const updateStep=(cid,sid,p)=>onSave(allClients.map(c=>c.id===cid?{...c,steps:{...c.steps,[sid]:{...c.steps[sid],...p}}}:c));
  const updateFicha=(cid,f)=>onSave(allClients.map(c=>c.id===cid?{...c,ficha:f}:c));
  const delClient=cid=>{ if(window.confirm("Remover?")) onSave(allClients.filter(c=>c.id!==cid)); };
  const selC=clients.find(c=>c.id===sel);
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <div><h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#fff"}}>Onboarding</h2><p style={{margin:"4px 0 0",color:"#475569",fontSize:13}}>{brand.name} · {clients.length} cliente(s)</p></div>
      <Btn ac={ac} onClick={()=>setShowAdd(true)}>+ Novo Cliente</Btn>
    </div>
    {showAdd&&<Modal title="Novo Cliente" onClose={()=>setShowAdd(false)}><AddClientForm onSave={addClient} ac={ac}/></Modal>}
    {!sel?(
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:14}}>
        {clients.length===0&&<Empty text="Nenhum cliente ainda"/>}
        {clients.map(c=>{ const done=STEPS.filter(s=>c.steps[s.id]?.done).length; const pct=Math.round(done/STEPS.length*100); return(
          <div key={c.id} onClick={()=>setSel(c.id)} style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:12,padding:16,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor=ac} onMouseLeave={e=>e.currentTarget.style.borderColor="#1a1a2e"}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div><div style={{fontWeight:700,color:"#fff",fontSize:15}}>{c.name}</div><span style={{fontSize:12,color:"#64748b"}}>{c.type==="transfer"?"Transferência":"Constituição"} · {fmtDate(c.since)}</span></div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                <span style={{background:pct===100?"#14532d":"#1a1a2e",color:pct===100?"#4ade80":"#94a3b8",fontSize:12,padding:"2px 8px",borderRadius:20,fontWeight:700}}>{pct}%</span>
                <button onClick={e=>{e.stopPropagation();delClient(c.id);}} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:13}}>🗑️</button>
              </div>
            </div>
            <div style={{background:"#1a1a2e",borderRadius:20,height:5,overflow:"hidden",marginBottom:10}}><div style={{background:ac,height:"100%",width:`${pct}%`,borderRadius:20}}/></div>
            <div style={{display:"flex",gap:6}}>{STEPS.map(s=><span key={s.id} title={s.label} style={{fontSize:17,opacity:c.steps[s.id]?.done?1:0.2}}>{s.icon}</span>)}</div>
          </div>
        );})}
      </div>
    ):(
      <ClientDetail client={selC} onBack={()=>setSel(null)} onUpdateStep={updateStep} onUpdateFicha={updateFicha} ac={ac}/>
    )}
  </div>);
}
function AddClientForm({onSave,ac}){
  const [form,setForm]=useState({name:"",type:"transfer"});
  return(<div><Field label="Nome / Razão Social"><Inp value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="Razão social"/></Field><Field label="Tipo"><Sel value={form.type} onChange={v=>setForm(f=>({...f,type:v}))} opts={[["transfer","Transferência de Escritório"],["constitution","Constituição de Empresa"]]}/></Field><Btn ac={ac} full onClick={()=>form.name.trim()&&onSave(form)}>Salvar</Btn></div>);
}
function ClientDetail({client,onBack,onUpdateStep,onUpdateFicha,ac}){
  const [exp,setExp]=useState(null); if(!client)return null;
  const done=STEPS.filter(s=>client.steps[s.id]?.done).length;
  return(<div>
    <button onClick={onBack} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:14,marginBottom:18,padding:0}}>← Voltar</button>
    <div style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:12,padding:18,marginBottom:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><h2 style={{margin:"0 0 4px",fontSize:18,fontWeight:800,color:"#fff"}}>{client.name}</h2><p style={{margin:0,color:"#475569",fontSize:13}}>{client.type==="transfer"?"Transferência":"Constituição"}</p></div><span style={{background:done===STEPS.length?"#14532d":"#1a1a2e",color:done===STEPS.length?"#4ade80":"#94a3b8",fontSize:12,padding:"4px 10px",borderRadius:20,fontWeight:700}}>{done}/{STEPS.length}</span></div>
      <div style={{background:"#1a1a2e",borderRadius:20,height:6,overflow:"hidden",marginTop:12}}><div style={{background:ac,height:"100%",width:`${Math.round(done/STEPS.length*100)}%`,borderRadius:20}}/></div>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {STEPS.map(s=>{ const step=client.steps[s.id]||{}; const open=exp===s.id; return(
        <div key={s.id} style={{background:"#0f0f1c",border:`1px solid ${step.done?"#1a4a2e":"#1a1a2e"}`,borderRadius:12,overflow:"hidden"}}>
          <div onClick={()=>setExp(open?null:s.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",cursor:"pointer"}}>
            <div onClick={e=>{e.stopPropagation();onUpdateStep(client.id,s.id,{done:!step.done,doneAt:!step.done?todayStr():null});}} style={{width:22,height:22,borderRadius:6,border:`2px solid ${step.done?ac:"#2a2a45"}`,background:step.done?ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>{step.done&&<span style={{color:"#fff",fontSize:12,fontWeight:700}}>✓</span>}</div>
            <span style={{fontSize:19}}>{s.icon}</span>
            <div style={{flex:1}}><div style={{fontWeight:600,color:step.done?"#4ade80":"#e2e8f0",fontSize:14,textDecoration:step.done?"line-through":"none"}}>{s.label}</div>{step.done&&<div style={{fontSize:11,color:"#475569"}}>Concluído em {fmtDate(step.doneAt)}</div>}</div>
            <span style={{color:"#2a2a45",fontSize:12,transform:open?"rotate(180deg)":"none",display:"inline-block"}}>▼</span>
          </div>
          {open&&<div style={{borderTop:"1px solid #1a1a2e"}}>
            {s.id==="cadastro"?<FichaForm ficha={client.ficha} tipo={client.type} onChange={f=>onUpdateFicha(client.id,f)} ac={ac}/>:(
              <div style={{padding:"12px 16px 14px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}><Field label="Data"><Inp type="date" value={step.date||""} onChange={v=>onUpdateStep(client.id,s.id,{date:v})}/></Field><Field label="Responsável"><Inp value={step.responsible||""} onChange={v=>onUpdateStep(client.id,s.id,{responsible:v})} placeholder="Nome"/></Field></div>
                <Field label="Observações"><textarea value={step.notes||""} onChange={e=>onUpdateStep(client.id,s.id,{notes:e.target.value})} rows={2} style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"8px 12px",color:"#e2e8f0",fontSize:13,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}}/></Field>
              </div>
            )}
          </div>}
        </div>
      );})}
    </div>
  </div>);
}
function FichaForm({ficha,tipo,onChange,ac}){
  const f=ficha||{}; const set=(k,v)=>onChange({...f,[k]:v}); const setN=(k,sk,v)=>onChange({...f,[k]:{...(f[k]||{}),[sk]:v}});
  const setP=(i,sk,v)=>{const ps=[...(f.proprietarios||[{nome:"",telefone:"",email:""}])];ps[i]={...ps[i],[sk]:v};onChange({...f,proprietarios:ps});};
  const s={fontSize:11,fontWeight:700,color:"#64748b",letterSpacing:"1px",margin:"16px 0 10px"};
  return(<div style={{padding:"14px 16px 16px"}}>
    <div style={s}>🏢 DADOS DA EMPRESA</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      <Field label="Razão Social" style={{gridColumn:"1/-1"}}><Inp value={f.razaoSocial||""} onChange={v=>set("razaoSocial",v)}/></Field>
      <Field label="CNPJ"><Inp value={f.cnpj||""} onChange={v=>set("cnpj",maskCNPJ(v))} placeholder="00.000.000/0000-00"/></Field>
      <Field label="Regime"><Sel value={f.regimeTributario||""} onChange={v=>set("regimeTributario",v)} opts={[["","Selecione..."],...REGIMES.map(r=>[r,r])]}/></Field>
      <Field label="Nome Fantasia"><Inp value={f.nomeFantasia||""} onChange={v=>set("nomeFantasia",v)}/></Field>
      <Field label="Data de Abertura"><Inp type="date" value={f.dataAbertura||""} onChange={v=>set("dataAbertura",v)}/></Field>
    </div>
    <div style={s}>👤 ADMINISTRADOR FINANCEIRO</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      <Field label="Nome" style={{gridColumn:"1/-1"}}><Inp value={f.adminFinanceiro?.nome||""} onChange={v=>setN("adminFinanceiro","nome",v)}/></Field>
      <Field label="Telefone"><Inp value={f.adminFinanceiro?.telefone||""} onChange={v=>setN("adminFinanceiro","telefone",maskPhone(v))} placeholder="(00) 00000-0000"/></Field>
      <Field label="E-mail"><Inp value={f.adminFinanceiro?.email||""} onChange={v=>setN("adminFinanceiro","email",v)}/></Field>
    </div>
    <div style={s}>👥 SÓCIOS</div>
    {(f.proprietarios||[{nome:"",telefone:"",email:""}]).map((p,i)=>(
      <div key={i} style={{background:"#111120",borderRadius:8,padding:"10px 12px",marginBottom:8}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <Field label="Nome" style={{gridColumn:"1/-1"}}><Inp value={p.nome||""} onChange={v=>setP(i,"nome",v)}/></Field>
          <Field label="Telefone"><Inp value={p.telefone||""} onChange={v=>setP(i,"telefone",maskPhone(v))} placeholder="(00) 00000-0000"/></Field>
          <Field label="E-mail"><Inp value={p.email||""} onChange={v=>setP(i,"email",v)}/></Field>
        </div>
      </div>
    ))}
    <button onClick={()=>onChange({...f,proprietarios:[...(f.proprietarios||[]),{nome:"",telefone:"",email:""}]})} style={{background:"#1a1a2e",border:`1px solid ${ac}44`,borderRadius:7,padding:"5px 12px",color:ac,cursor:"pointer",fontSize:12,fontWeight:600,marginBottom:12}}>+ Sócio</button>
    {tipo==="transfer"&&(<><div style={s}>🔄 ESCRITÓRIO ANTERIOR</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <Field label="Contador"><Inp value={f.contadorAnterior?.nome||""} onChange={v=>setN("contadorAnterior","nome",v)}/></Field>
        <Field label="Escritório"><Inp value={f.contadorAnterior?.escritorio||""} onChange={v=>setN("contadorAnterior","escritorio",v)}/></Field>
        <Field label="Telefone"><Inp value={f.contadorAnterior?.telefone||""} onChange={v=>setN("contadorAnterior","telefone",maskPhone(v))} placeholder="(00) 00000-0000"/></Field>
        <Field label="E-mail"><Inp value={f.contadorAnterior?.email||""} onChange={v=>setN("contadorAnterior","email",v)}/></Field>
      </div>
    </>)}
    <div style={{background:"#0a1a0f",border:"1px solid #1a4a1a",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#4ade80",marginTop:8}}>💾 Salvo automaticamente.</div>
  </div>);
}

function MeetingsTab({co,clients,allMeetings,onSave,brand}){
  const [showNew,setShowNew]=useState(false); const [ataId,setAtaId]=useState(null); const ac=brand.c;
  const meetings=allMeetings.filter(m=>m.co===co);
  const upcoming=meetings.filter(m=>m.nextDate&&daysLeft(m.nextDate)<=30&&daysLeft(m.nextDate)>=0).sort((a,b)=>a.nextDate>b.nextDate?1:-1);
  const addMeeting=form=>{ const t=MTG_TYPES.find(x=>x.id===form.type); onSave([...allMeetings,{id:uid(),co,clientId:form.clientId||null,clientName:form.clientName||"",type:form.type,date:form.date,attendees:form.attendees,agenda:form.agenda,nextDate:t.months>0?addMonths(form.date,t.months):null,ata:null}]); setShowNew(false); };
  const updateAta=(mid,ata)=>onSave(allMeetings.map(m=>m.id===mid?{...m,ata}:m));
  const delMeeting=mid=>{ if(window.confirm("Remover?")) onSave(allMeetings.filter(m=>m.id!==mid)); };
  const ataM=allMeetings.find(m=>m.id===ataId);
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <div><h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#fff"}}>Reuniões</h2><p style={{margin:"4px 0 0",color:"#475569",fontSize:13}}>{brand.name}</p></div>
      <Btn ac={ac} onClick={()=>setShowNew(true)}>+ Nova Reunião</Btn>
    </div>
    {upcoming.length>0&&(<div style={{background:"#110d1e",border:"1px solid #3b1f5e",borderRadius:12,padding:16,marginBottom:20}}>
      <p style={{margin:"0 0 10px",color:"#c084fc",fontWeight:700,fontSize:12}}>⏰ PARA AGENDAR EM BREVE</p>
      {upcoming.map(m=>{ const c=clients.find(x=>x.id===m.clientId); const d=daysLeft(m.nextDate); return(
        <div key={m.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#0f0a1a",borderRadius:8,padding:"9px 12px",marginBottom:5}}>
          <span style={{color:"#e2e8f0",fontSize:13}}>{c?.name||m.clientName||"Evento livre"} · {MTG_TYPES.find(t=>t.id===m.type)?.label} · {fmtDate(m.nextDate)}</span>
          <span style={{background:d<=7?"#450a0a":"#2d1a06",color:d<=7?"#f87171":"#fb923c",padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:700}}>{d===0?"Hoje!":d===1?"Amanhã":`${d}d`}</span>
        </div>
      );})}
    </div>)}
    {showNew&&<Modal title="Nova Reunião" onClose={()=>setShowNew(false)}><NewMeetingForm clients={clients} onSave={addMeeting} ac={ac}/></Modal>}
    {ataM&&<AtaModal meeting={ataM} clients={clients} onSave={ata=>{updateAta(ataId,ata);setAtaId(null);}} onClose={()=>setAtaId(null)} ac={ac}/>}
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {meetings.length===0&&<Empty text="Nenhuma reunião registrada"/>}
      {[...meetings].sort((a,b)=>b.date>a.date?1:-1).map(m=>{ const c=clients.find(x=>x.id===m.clientId); const t=MTG_TYPES.find(x=>x.id===m.type); return(
        <div key={m.id} style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:12,padding:"14px 16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontWeight:600,color:"#fff",fontSize:15}}>{c?.name||m.clientName||"Evento livre"}</div><div style={{color:"#64748b",fontSize:13}}>{t?.label} · {fmtDate(m.date)}{m.attendees&&<span style={{color:"#94a3b8",marginLeft:8}}>· {m.attendees}</span>}{m.nextDate&&<span style={{color:"#a855f7",marginLeft:10}}>↻ {fmtDate(m.nextDate)}</span>}</div></div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>openCalendar(`Reunião ${t?.label}: ${c?.name||""}`,m.date,"09:00",m.agenda||"")} style={{background:"#0d1f0d",border:"none",borderRadius:7,padding:"6px 10px",color:"#4ade80",cursor:"pointer",fontSize:12,fontWeight:600}}>📅 Cal</button>
              {m.ata?<button onClick={()=>setAtaId(m.id)} style={{background:"#14532d",border:"none",borderRadius:7,padding:"6px 10px",color:"#4ade80",cursor:"pointer",fontSize:12,fontWeight:600}}>📄 Ata</button>:<button onClick={()=>setAtaId(m.id)} style={{background:"#1e3a5f",border:"none",borderRadius:7,padding:"6px 10px",color:"#60a5fa",cursor:"pointer",fontSize:12,fontWeight:600}}>✨ Gerar Ata</button>}
              <button onClick={()=>delMeeting(m.id)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:16}}>🗑️</button>
            </div>
          </div>
        </div>
      );})}
    </div>
  </div>);
}
function NewMeetingForm({clients,onSave,ac}){
  const [form,setForm]=useState({clientId:"",clientName:"",type:"trimestral",date:todayStr(),attendees:"",agenda:""});
  return(<div>
    <div style={{background:"#1a1a2e",borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:12,color:"#64748b"}}>
      💡 Cliente é <strong style={{color:"#94a3b8"}}>opcional</strong>. Você pode adicionar eventos livres da rotina do escritório ou da Veritas sem vincular a um cliente.
    </div>
    <Field label="Cliente (opcional)"><Sel value={form.clientId} onChange={v=>setForm(f=>({...f,clientId:v}))} opts={[["","— Nenhum (evento livre) —"],...clients.map(c=>[c.id,c.name])]}/></Field>
    {!form.clientId&&<Field label="Com quem / Descrição"><Inp value={form.clientName} onChange={v=>setForm(f=>({...f,clientName:v}))} placeholder="Ex: Fornecedor X, Reunião interna, Visita banco..."/></Field>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="Tipo"><Sel value={form.type} onChange={v=>setForm(f=>({...f,type:v}))} opts={MTG_TYPES.map(t=>[t.id,t.label])}/></Field>
      <Field label="Data"><Inp type="date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))}/></Field>
    </div>
    <Field label="Participantes"><Inp value={form.attendees} onChange={v=>setForm(f=>({...f,attendees:v}))} placeholder="Daniela, Marcus, fornecedor..."/></Field>
    <Field label="Pauta / Observações"><textarea value={form.agenda} onChange={e=>setForm(f=>({...f,agenda:e.target.value}))} rows={3} placeholder="Pontos a discutir, objetivo da reunião..." style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"9px 12px",color:"#e2e8f0",fontSize:13,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}}/></Field>
    <Btn ac={ac} full onClick={()=>form.date&&(form.clientId||form.clientName.trim())&&onSave(form)}>Salvar Reunião</Btn>
  </div>);
}
function AtaModal({meeting,clients,onSave,onClose,ac}){
  const [ata,setAta]=useState(meeting.ata||""); const [loading,setLoading]=useState(false);
  const client=clients.find(c=>c.id===meeting.clientId); const ti=MTG_TYPES.find(t=>t.id===meeting.type);
  const nomeEvento=client?.name||meeting.clientName||"Evento livre";
  const generate=async()=>{ setLoading(true); try{ const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Gere uma ata de reunião profissional em português:\nCliente/Evento: ${nomeEvento}\nTipo: ${ti?.label}\nData: ${fmtDate(meeting.date)}\nParticipantes: ${meeting.attendees||"—"}\nPauta: ${meeting.agenda||"—"}\nEstrutura: Cabeçalho, Participantes, Pontos numerados, Encaminhamentos, Próxima reunião, Assinaturas.`}]})}); const d=await res.json(); setAta(d.content?.[0]?.text||"Erro."); }catch(e){setAta("Erro.");} setLoading(false); };
  return(<Modal title={`Ata — ${nomeEvento}`} onClose={onClose} wide><div style={{display:"flex",gap:8,marginBottom:12}}><button onClick={generate} disabled={loading} style={{background:loading?"#1a1a2e":ac,border:"none",borderRadius:8,padding:"8px 14px",color:"#fff",cursor:loading?"not-allowed":"pointer",fontSize:13,fontWeight:600,opacity:loading?0.6:1}}>{loading?"⏳ Gerando...":"✨ Gerar com IA"}</button>{ata&&<button onClick={()=>{try{navigator.clipboard.writeText(ata);}catch(e){}}} style={{background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"8px 12px",color:"#94a3b8",cursor:"pointer",fontSize:13}}>📋 Copiar</button>}</div><textarea value={ata} onChange={e=>setAta(e.target.value)} rows={16} placeholder="Clique em 'Gerar com IA'..." style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:10,padding:"12px",color:"#e2e8f0",fontSize:13,resize:"vertical",fontFamily:"Georgia,serif",lineHeight:1.7,boxSizing:"border-box"}}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}><button onClick={()=>onSave(ata)} style={{background:"#14532d",border:"none",borderRadius:8,padding:"11px",color:"#4ade80",fontWeight:700,cursor:"pointer",fontSize:13}}>💾 Salvar</button><button onClick={()=>{const w=window.open("","_blank");if(w){w.document.write(`<html><body style="font-family:Georgia;padding:60px;max-width:760px;margin:auto"><pre style="white-space:pre-wrap;font-family:inherit">${ata}</pre></body></html>`);w.document.close();w.print();}}} style={{background:"#1e3a5f",border:"none",borderRadius:8,padding:"11px",color:"#60a5fa",fontWeight:700,cursor:"pointer",fontSize:13}}>🖨️ Imprimir</button></div></Modal>);
}

function AgendaTab({agenda,onSave,brand,user}){
  const [view,setView]=useState("calendar"); const [showAdd,setShowAdd]=useState(false); const [sel,setSel]=useState(null);
  const [calRef,setCalRef]=useState(()=>{ const n=new Date(); return new Date(n.getFullYear(),n.getMonth(),1); });
  const ac=brand.c; const now=new Date(); const today=todayStr();
  const upcoming=[...agenda].filter(e=>e.date>=today&&!e.bpoRef).sort((a,b)=>a.date>b.date?1:-1);
  const past=[...agenda].filter(e=>e.date<today&&!e.bpoRef).sort((a,b)=>b.date>a.date?1:-1).slice(0,10);
  const todayEvts=agenda.filter(e=>e.date===today);
  const dayMap={}; agenda.forEach(e=>{ dayMap[e.date]=[...(dayMap[e.date]||[]),e]; });
  const addEvt=form=>{ onSave([...agenda,{id:uid(),...form}]); setShowAdd(false); };
  const delEvt=id=>{ onSave(agenda.filter(e=>e.id!==id)); setSel(null); };
  const y=calRef.getFullYear(),mo=calRef.getMonth(),fd=new Date(y,mo,1).getDay(),dim=new Date(y,mo+1,0).getDate();
  const typeColor={reuniao:"#6366f1",tarefa:"#f59e0b",lembrete:"#c9a96e",outro:"#64748b"};
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div><h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#fff"}}>Agenda</h2><p style={{margin:"4px 0 0",color:"#475569",fontSize:13}}>Daniela &amp; Marcus</p></div>
      <div style={{display:"flex",gap:8}}>
        <div style={{display:"flex",gap:2,background:"#0f0f1c",borderRadius:8,padding:3}}>
          <button onClick={()=>setView("calendar")} style={{padding:"5px 12px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:view==="calendar"?700:400,background:view==="calendar"?ac:"transparent",color:view==="calendar"?"#fff":"#64748b"}}>📅 Calendário</button>
          <button onClick={()=>setView("list")}     style={{padding:"5px 12px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:view==="list"?700:400,    background:view==="list"?ac:"transparent",    color:view==="list"?"#fff":"#64748b"}}>📋 Lista</button>
        </div>
        <Btn ac={ac} onClick={()=>setShowAdd(true)}>+ Evento</Btn>
      </div>
    </div>
    {todayEvts.length>0&&(<div style={{background:`${ac}15`,border:`1px solid ${ac}44`,borderRadius:10,padding:"10px 14px",marginBottom:14}}>
      <p style={{margin:"0 0 8px",color:ac,fontWeight:700,fontSize:11}}>📌 HOJE</p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{todayEvts.map(e=><div key={e.id} onClick={()=>setSel(e)} style={{background:"#0f0f1c",borderRadius:8,padding:"7px 12px",cursor:"pointer",border:`1px solid ${ac}44`,display:"flex",alignItems:"center",gap:8}}>{e.time&&<span style={{color:ac,fontSize:12,fontWeight:700}}>{e.time}</span>}<span style={{color:"#fff",fontSize:13,fontWeight:600}}>{e.title}</span></div>)}</div>
    </div>)}
    {showAdd&&<Modal title="Novo Evento" onClose={()=>setShowAdd(false)}><AddEventForm onSave={addEvt} ac={ac}/></Modal>}
    {sel&&(<Modal title="Evento" onClose={()=>setSel(null)}>
      <div style={{background:"#1a1a2e",borderRadius:10,padding:16,marginBottom:14}}>
        <div style={{fontWeight:700,color:"#fff",fontSize:17,marginBottom:8}}>{sel.title}</div>
        {sel.participant&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><span style={{fontSize:11,background:"#252540",color:"#94a3b8",padding:"2px 8px",borderRadius:20}}>{sel.participantType==="colaborador"?"👔 Colaborador":sel.participantType==="fornecedor"?"🏢 Fornecedor":sel.participantType==="cliente"?"🧾 Cliente":sel.participantType==="banco"?"🏦 Banco":"👤"}</span><span style={{color:"#e2e8f0",fontWeight:600,fontSize:14}}>{sel.participant}</span></div>}
        <div style={{color:"#64748b",fontSize:13}}>📅 {fmtDate(sel.date)}{sel.time&&<span style={{marginLeft:10}}>🕐 {sel.time}</span>}</div>
        {sel.notes&&<div style={{color:"#94a3b8",fontSize:13,marginTop:8}}>{sel.notes}</div>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {/* Reunião: abre com participantes + Meet; tarefa/lembrete: evento dia inteiro sem Meet */}
        <button onClick={()=>sel.type==="reuniao"?openCalendar(sel.title,sel.date,sel.time,[sel.participant&&`Com: ${sel.participant}`,sel.notes].filter(Boolean).join("\n")):openReminder(sel.title,sel.date,[sel.participant&&`Com: ${sel.participant}`,sel.notes].filter(Boolean).join("\n"))} style={{background:"#0d1f0d",border:"none",borderRadius:8,padding:"10px",color:"#4ade80",fontWeight:600,cursor:"pointer",fontSize:13}}>📅 {sel.type==="reuniao"?"Google Cal — Reunião":"Google Cal — Lembrete"}</button>
        <button onClick={()=>{ window.open(`mailto:danimcustodiof@gmail.com,mvmcustodio@gmail.com?subject=${encodeURIComponent("[GestorPro] "+sel.title)}&body=${encodeURIComponent(sel.title+"\nData: "+fmtDate(sel.date)+(sel.time?"\nHorário: "+sel.time:"")+"\n"+(sel.notes||""))}`); }} style={{background:"#1e3a5f",border:"none",borderRadius:8,padding:"10px",color:"#60a5fa",fontWeight:600,cursor:"pointer",fontSize:13}}>✉️ E-mail</button>
        {!sel.bpoRef&&<button onClick={()=>delEvt(sel.id)} style={{background:"#450a0a",border:"none",borderRadius:8,padding:"10px",color:"#f87171",fontWeight:600,cursor:"pointer",fontSize:13}}>🗑️ Excluir</button>}
        <button onClick={()=>setSel(null)} style={{background:"#1a1a2e",border:"none",borderRadius:8,padding:"10px",color:"#94a3b8",cursor:"pointer",fontSize:13}}>Fechar</button>
      </div>
    </Modal>)}
    {view==="calendar"&&(<div style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:14,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderBottom:"1px solid #1a1a2e",background:"#0c0c18"}}>
        <button onClick={()=>setCalRef(new Date(y,mo-1,1))} style={{background:"#1a1a2e",border:"none",borderRadius:7,padding:"6px 14px",color:"#94a3b8",cursor:"pointer",fontSize:16}}>‹</button>
        <div style={{textAlign:"center"}}><div style={{fontWeight:800,fontSize:17,color:"#fff"}}>{calRef.toLocaleDateString("pt-BR",{month:"long",year:"numeric"}).replace(/^\w/,c=>c.toUpperCase())}</div><div style={{fontSize:11,color:"#475569",marginTop:2}}>{agenda.filter(e=>{ const d=new Date(e.date+"T12:00:00"); return d.getMonth()===mo&&d.getFullYear()===y; }).length} evento(s)</div></div>
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
            {evts.slice(0,3).map((e,i)=>{ const cc=e.clientIdx!=null?clientColor(e.clientIdx):(typeColor[e.type]||"#6366f1"); return(<div key={i} onClick={()=>setSel(e)} title={e.title} style={{background:cc+"22",borderLeft:`3px solid ${cc}`,borderRadius:"0 3px 3px 0",padding:"1px 5px",marginBottom:2,fontSize:10,color:cc,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",cursor:"pointer"}}>{e.title}</div>);})}
            {evts.length>3&&<div style={{fontSize:9,color:"#475569",paddingLeft:5}}>+{evts.length-3}</div>}
          </div>);
        })}
      </div>
      <div style={{display:"flex",gap:14,padding:"10px 16px",borderTop:"1px solid #1a1a2e",flexWrap:"wrap"}}>
        {[["#6366f1","Reunião"],["#f59e0b","Tarefa"],["#c9a96e","BPO/Lembrete"],["#64748b","Outro"]].map(([c,l])=><div key={l} style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,borderRadius:2,background:c}}/><span style={{fontSize:11,color:"#475569"}}>{l}</span></div>)}
      </div>
    </div>)}
    {view==="list"&&(<div>
      {upcoming.length===0&&past.length===0&&<Empty text="Nenhum evento na agenda"/>}
      {upcoming.length>0&&<div style={{marginBottom:20}}><p style={{color:"#64748b",fontSize:11,fontWeight:700,letterSpacing:"0.5px",marginBottom:10}}>PRÓXIMOS</p>{upcoming.map(e=><EvRow key={e.id} e={e} ac={ac} onClick={()=>setSel(e)}/>)}</div>}
      {past.length>0&&<div><p style={{color:"#2a2a45",fontSize:11,fontWeight:700,letterSpacing:"0.5px",marginBottom:10}}>ANTERIORES</p>{past.map(e=><EvRow key={e.id} e={e} ac={ac} onClick={()=>setSel(e)} past/>)}</div>}
    </div>)}
  </div>);
}
function EvRow({e,ac,onClick,past}){const d=daysLeft(e.date);return(<div onClick={onClick} style={{display:"flex",alignItems:"center",gap:12,background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:10,padding:"12px 14px",marginBottom:6,cursor:"pointer",opacity:past?0.45:1}} onMouseEnter={ev=>ev.currentTarget.style.borderColor=ac} onMouseLeave={ev=>ev.currentTarget.style.borderColor="#1a1a2e"}><div style={{flex:1}}><div style={{fontWeight:600,color:"#fff",fontSize:14}}>{e.title}</div><div style={{color:"#64748b",fontSize:12}}>{fmtDate(e.date)}{e.time&&` às ${e.time}`}{e.participant&&<span style={{color:"#94a3b8",marginLeft:8}}>· {e.participant}</span>}</div></div>{!past&&d===0&&<span style={{background:"#14532d",color:"#4ade80",fontSize:11,padding:"2px 9px",borderRadius:20,fontWeight:700}}>Hoje</span>}{!past&&d===1&&<span style={{background:"#2d1a06",color:"#fb923c",fontSize:11,padding:"2px 9px",borderRadius:20,fontWeight:700}}>Amanhã</span>}{!past&&d>1&&d<=7&&<span style={{background:"#1a1a2e",color:"#94a3b8",fontSize:11,padding:"2px 9px",borderRadius:20}}>{d}d</span>}</div>);}
function AddEventForm({onSave,ac}){
  const [form,setForm]=useState({title:"",date:todayStr(),time:"",type:"reuniao",participant:"",participantType:"pessoa",notes:""});
  return(<div>
    <Field label="Título"><Inp value={form.title} onChange={v=>setForm(f=>({...f,title:v}))} placeholder="Ex: Reunião com fornecedor, Visita banco..."/></Field>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Field label="Data"><Inp type="date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))}/></Field>
      <Field label="Horário"><Inp type="time" value={form.time} onChange={v=>setForm(f=>({...f,time:v}))}/></Field>
      <Field label="Tipo de evento"><Sel value={form.type} onChange={v=>setForm(f=>({...f,type:v}))} opts={[["reuniao","🤝 Reunião"],["tarefa","✅ Tarefa"],["lembrete","🔔 Lembrete"],["outro","📌 Outro"]]}/></Field>
      <Field label="Tipo de pessoa"><Sel value={form.participantType} onChange={v=>setForm(f=>({...f,participantType:v}))} opts={[["pessoa","👤 Pessoa / Geral"],["colaborador","👔 Colaborador"],["fornecedor","🏢 Fornecedor"],["cliente","🧾 Cliente"],["banco","🏦 Banco / Financeiro"]]}/></Field>
    </div>
    <Field label={`Nome — ${form.participantType==="colaborador"?"Colaborador":form.participantType==="fornecedor"?"Fornecedor":form.participantType==="cliente"?"Cliente":form.participantType==="banco"?"Banco/Financeiro":"Participante / Com quem"}`}><Inp value={form.participant} onChange={v=>setForm(f=>({...f,participant:v}))} placeholder={form.participantType==="fornecedor"?"Ex: Fornecedor ABC Ltda":form.participantType==="colaborador"?"Ex: João Silva":form.participantType==="banco"?"Ex: Gerente Itaú":"Ex: Nome, empresa ou pessoa..."}/></Field>
    <Field label="Observações"><textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2} placeholder="Detalhes, pauta, objetivo..." style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"8px 12px",color:"#e2e8f0",fontSize:13,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}}/></Field>
    <Btn ac={ac} full onClick={()=>form.title.trim()&&form.date&&onSave(form)}>Salvar Evento</Btn>
  </div>);
}

function BpoTab({bpo,onSave,brand}){
  const [view,setView]=useState("calendar"); const [showAdd,setShowAdd]=useState(false);
  const [selClient,setSelClient]=useState(null); const [cofreId,setCofreId]=useState(null);
  const ac=brand.c; const now=new Date(); const today=todayStr(); const dom=now.getDate(); const dow=now.getDay();

  const addClient=(form)=>onSave([...bpo,{id:uid(),...form,done:{},cofre:{bancos:[],acessos:[]}}]);
  const updateClient=(cid,patch)=>onSave(bpo.map(c=>c.id===cid?{...c,...patch}:c));
  const delClient=(cid)=>{ if(window.confirm("Remover cliente?")) onSave(bpo.filter(c=>c.id!==cid)); };
  const toggleDone=(cid,tid)=>onSave(bpo.map(c=>{ if(c.id!==cid)return c; const k=`${tid}_${today}`; return{...c,done:{...(c.done||{}),[k]:!(c.done||{})[k]}}; }));

  const todayTasks=[];
  bpo.forEach((c,ci)=>{ (c.tasks||[]).forEach(t=>{ const due=(t.freq==="daily")||(t.freq==="monthly"&&t.dia===dom)||(t.freq==="weekly"&&t.dia===dow); if(due) todayTasks.push({client:c,ci,task:t,done:(c.done||{})[`${t.id}_${today}`]}); }); });
  const doneCnt=todayTasks.filter(x=>x.done).length;

  const [calRef,setCalRef]=useState(()=>{ const n=new Date(); return new Date(n.getFullYear(),n.getMonth(),1); });
  const cy=calRef.getFullYear(),cmo=calRef.getMonth(),cdim=new Date(cy,cmo+1,0).getDate(),cfd=new Date(cy,cmo,1).getDay();
  const calMap={};
  bpo.forEach((c,ci)=>{ (c.tasks||[]).forEach(t=>{
    if(t.freq==="monthly"&&t.dia>=1&&t.dia<=cdim){ const ds=`${cy}-${String(cmo+1).padStart(2,"0")}-${String(t.dia).padStart(2,"0")}`; calMap[ds]=[...(calMap[ds]||[]),{c,ci,t}]; }
    if(t.freq==="weekly"){ for(let d=1;d<=cdim;d++){ if(new Date(cy,cmo,d).getDay()===t.dia){ const ds=`${cy}-${String(cmo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; calMap[ds]=[...(calMap[ds]||[]),{c,ci,t}]; } } }
    if(t.freq==="daily"){ for(let d=1;d<=cdim;d++){ const wd=new Date(cy,cmo,d).getDay(); if(wd>0&&wd<6){ const ds=`${cy}-${String(cmo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; calMap[ds]=[...(calMap[ds]||[]),{c,ci,t}]; } } }
  }); });

  const selClientObj=bpo.find(c=>c.id===selClient);
  const cofreObj=bpo.find(c=>c.id===cofreId);

  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div><h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#fff"}}>BPO Financeiro</h2><p style={{margin:"4px 0 0",color:"#475569",fontSize:13}}>{brand.name} · {bpo.length} cliente(s)</p></div>
      <Btn ac={ac} onClick={()=>setShowAdd(true)}>+ Novo Cliente</Btn>
    </div>

    {todayTasks.length>0&&(<div style={{background:`${ac}10`,border:`1px solid ${ac}44`,borderRadius:12,padding:"13px 16px",marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{color:ac,fontWeight:700,fontSize:12}}>📅 HOJE — {now.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}</span>
        <span style={{background:doneCnt===todayTasks.length?"#14532d":ac+"22",color:doneCnt===todayTasks.length?"#4ade80":ac,fontSize:11,padding:"2px 10px",borderRadius:20,fontWeight:700}}>{doneCnt}/{todayTasks.length} feitas</span>
      </div>
      {todayTasks.map(({client,ci,task,done},i)=>{ const cc=clientColor(ci); const tc=CAT_COLORS[task.cat]||ac; const det=task.detalhes||{}; return(
        <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:"#0f0f1c",borderRadius:8,padding:"9px 12px",border:`1px solid ${done?"#1a4a2e":"#1a1a2e"}`,marginBottom:5}}>
          <Chk checked={done} ac={tc} onClick={()=>toggleDone(client.id,task.id)}/>
          <span style={{fontSize:15}}>{task.icon}</span>
          <div style={{flex:1}}>
            <span style={{fontWeight:600,color:done?"#475569":"#fff",textDecoration:done?"line-through":"none",fontSize:14}}>{task.label}</span>
            <span style={{fontSize:12,color:cc,fontWeight:600,marginLeft:8}}>· {client.name}</span>
            {det.assunto&&<span style={{fontSize:11,color:"#64748b",marginLeft:8}}>· {det.assunto}</span>}
          </div>
          <span style={{background:tc+"22",color:tc,fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:600}}>{CAT_LABELS[task.cat]}</span>
        </div>
      );})}
    </div>)}

    <div style={{display:"flex",gap:4,marginBottom:18,background:"#0f0f1c",borderRadius:9,padding:4,width:"fit-content"}}>
      {[["calendar","📅 Calendário"],["clients","👥 Clientes"],["tasks_all","📋 Todas Tarefas"]].map(([v,l])=>(
        <button key={v} onClick={()=>setView(v)} style={{padding:"6px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:view===v?700:400,background:view===v?ac:"transparent",color:view===v?"#fff":"#64748b"}}>{l}</button>
      ))}
    </div>

    {showAdd&&<Modal title="Novo Cliente BPO" onClose={()=>setShowAdd(false)} wide><BpoClientForm onSave={form=>{addClient(form);setShowAdd(false);}} ac={ac}/></Modal>}
    {selClient&&selClientObj&&<BpoClientDetail client={selClientObj} clientIdx={bpo.findIndex(c=>c.id===selClient)} onUpdate={patch=>{updateClient(selClient,patch);setSelClient(null);}} onClose={()=>setSelClient(null)} ac={ac}/>}
    {cofreId&&cofreObj&&<CofreModal client={cofreObj} ac={ac} onUpdate={cofre=>updateClient(cofreId,{cofre})} onClose={()=>setCofreId(null)}/>}

    {view==="calendar"&&(<div style={{background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:14,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderBottom:"1px solid #1a1a2e",background:"#0c0c18"}}>
        <button onClick={()=>setCalRef(new Date(cy,cmo-1,1))} style={{background:"#1a1a2e",border:"none",borderRadius:7,padding:"6px 14px",color:"#94a3b8",cursor:"pointer",fontSize:16}}>‹</button>
        <div style={{textAlign:"center"}}><div style={{fontWeight:800,fontSize:17,color:"#fff"}}>{calRef.toLocaleDateString("pt-BR",{month:"long",year:"numeric"}).replace(/^\w/,c=>c.toUpperCase())}</div><div style={{fontSize:11,color:"#475569",marginTop:2}}>{Object.values(calMap).reduce((a,b)=>a+b.length,0)} tarefa(s) · {bpo.length} cliente(s)</div></div>
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
            {evts.slice(0,4).map(({c,ci,t},i)=>{ const cc=clientColor(ci); const done=(c.done||{})[`${t.id}_${ds}`]; return(<div key={i} title={`${t.label} · ${c.name}`} style={{background:cc+"22",borderLeft:`3px solid ${done?"#4ade80":cc}`,borderRadius:"0 3px 3px 0",padding:"1px 5px",marginBottom:2,fontSize:10,color:done?"#4ade80":cc,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",textDecoration:done?"line-through":"none"}}>{t.icon} {t.label}</div>);})}
            {evts.length>4&&<div style={{fontSize:9,color:"#475569",paddingLeft:5}}>+{evts.length-4}</div>}
          </div>);
        })}
      </div>
      {bpo.length>0&&<div style={{padding:"10px 16px",borderTop:"1px solid #1a1a2e",display:"flex",gap:14,flexWrap:"wrap"}}>{bpo.map((c,ci)=><div key={c.id} style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,borderRadius:2,background:clientColor(ci)}}/><span style={{fontSize:11,color:"#64748b"}}>{c.name}</span></div>)}</div>}
    </div>)}

    {view==="clients"&&(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
      {bpo.length===0&&<Empty text="Nenhum cliente BPO"/>}
      {bpo.map((c,ci)=>{ const cc=clientColor(ci); const cofreN=(c.cofre?.bancos||[]).length+(c.cofre?.acessos||[]).length; return(
        <div key={c.id} style={{background:"#0f0f1c",border:`1px solid ${cc}44`,borderRadius:12,padding:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{width:10,height:10,borderRadius:5,background:cc}}/><div style={{fontWeight:700,color:"#fff",fontSize:15}}>{c.name}</div></div>{c.regime&&<span style={{background:cc+"22",color:cc,fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:600}}>{c.regime}</span>}</div>
            <button onClick={()=>delClient(c.id)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:14}}>🗑️</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12}}>
            {[[(c.tasks||[]).length+"","Tarefas"],[(c.tasks||[]).filter(t=>t.freq==="monthly").length+"","Mensais"],[(c.tasks||[]).filter(t=>t.cat==="fiscal").length+"","Fiscais"]].map(([n,l])=>(
              <div key={l} style={{background:"#1a1a2e",borderRadius:8,padding:"8px 6px",textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,color:cc}}>{n}</div><div style={{fontSize:10,color:"#64748b"}}>{l}</div></div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            <button onClick={()=>setSelClient(c.id)} style={{background:cc+"18",border:`1px solid ${cc}44`,borderRadius:8,padding:"8px",color:cc,cursor:"pointer",fontSize:11,fontWeight:700}}>⚙️ Tarefas</button>
            <button onClick={()=>setCofreId(c.id)} style={{background:"#0a180a",border:"1px solid #1a4a1a",borderRadius:8,padding:"8px",color:"#4ade80",cursor:"pointer",fontSize:11,fontWeight:700}}>🔐 Cofre {cofreN>0&&`(${cofreN})`}</button>
          </div>
        </div>
      );})}
    </div>)}

    {view==="tasks_all"&&(<div>
      {["fiscal","caixa","bancario","pagamentos","rh","relatorio","reuniao","cobranca"].map(cat=>{
        const items=[]; bpo.forEach((c,ci)=>{ (c.tasks||[]).filter(t=>t.cat===cat).forEach(t=>items.push({c,ci,t})); }); if(!items.length) return null;
        const cc=CAT_COLORS[cat]||"#64748b";
        return(<div key={cat} style={{marginBottom:20}}><p style={{fontSize:11,fontWeight:700,color:cc,margin:"0 0 8px",letterSpacing:"0.5px"}}>{CAT_LABELS[cat]?.toUpperCase()}</p>
          {items.map(({c,ci,t},i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,background:"#0f0f1c",border:`1px solid ${cc}22`,borderRadius:9,padding:"10px 14px",marginBottom:5}}>
              <span style={{fontSize:15}}>{t.icon}</span>
              <div style={{flex:1}}><span style={{fontWeight:600,color:"#fff",fontSize:14}}>{t.label}</span><span style={{fontSize:12,color:clientColor(ci),fontWeight:600,marginLeft:8}}>· {c.name}</span>{t.detalhes?.assunto&&<span style={{fontSize:11,color:"#64748b",marginLeft:8}}>· {t.detalhes.assunto}</span>}</div>
              <span style={{background:"#1a1a2e",color:"#94a3b8",fontSize:11,padding:"2px 8px",borderRadius:20}}>{t.freq==="monthly"?`Dia ${t.dia}`:t.freq==="weekly"?`Toda ${WDAYS[t.dia||1]}`:t.freq==="daily"?"Diário":"—"}</span>
            </div>
          ))}
        </div>);
      })}
      {bpo.every(c=>(c.tasks||[]).length===0)&&<Empty text="Nenhuma tarefa configurada"/>}
    </div>)}
  </div>);
}

function BpoClientForm({onSave,ac}){
  const [name,setName]=useState(""); const [regime,setRegime]=useState("");
  const [selected,setSelected]=useState(new Set()); const [taskConfig,setTaskConfig]=useState({});
  const getFreq=id=>taskConfig[id]?.freq??BPO_SUGESTOES.find(s=>s.id===id)?.freq??"monthly";
  const getDia=id=>taskConfig[id]?.dia??BPO_SUGESTOES.find(s=>s.id===id)?.dia??1;
  const setTFreq=(id,freq)=>setTaskConfig(c=>({...c,[id]:{...c[id],freq}}));
  const setTDia=(id,dia)=>setTaskConfig(c=>({...c,[id]:{...c[id],dia}}));
  const toggle=id=>setSelected(s=>{ const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n; });
  const toggleCat=cat=>{ const ids=BPO_SUGESTOES.filter(s=>s.cat===cat).map(s=>s.id); const allOn=ids.every(id=>selected.has(id)); setSelected(s=>{ const n=new Set(s); ids.forEach(id=>allOn?n.delete(id):n.add(id)); return n; }); };
  const doSave=()=>{ if(!name.trim())return; const tasks=BPO_SUGESTOES.filter(s=>selected.has(s.id)).map(s=>({...s,freq:getFreq(s.id),dia:getDia(s.id),detalhes:{}})); onSave({name,regime,tasks}); };
  const cats=[...new Set(BPO_SUGESTOES.map(s=>s.cat))];
  return(<div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
      <Field label="Nome do Cliente" style={{gridColumn:"1/-1"}}><Inp value={name} onChange={setName} placeholder="Razão social"/></Field>
      <Field label="Regime Tributário" style={{gridColumn:"1/-1"}}><Sel value={regime} onChange={setRegime} opts={[["","Selecione..."],...REGIMES.map(r=>[r,r])]}/></Field>
    </div>
    <p style={{fontSize:11,fontWeight:700,color:"#64748b",margin:"0 0 4px"}}>TAREFAS SUGERIDAS — selecione e configure</p>
    <p style={{fontSize:11,color:"#475569",margin:"0 0 12px"}}>Escolha frequência e dia para cada tarefa. Serão adicionadas ao calendário automaticamente.</p>
    {cats.map(cat=>{
      const items=BPO_SUGESTOES.filter(s=>s.cat===cat); const allOn=items.every(s=>selected.has(s.id)); const cc=CAT_COLORS[cat]||"#64748b";
      return(<div key={cat} style={{marginBottom:14}}>
        <button onClick={()=>toggleCat(cat)} style={{background:allOn?cc+"22":"#1a1a2e",border:`1px solid ${allOn?cc:"#252540"}`,borderRadius:6,padding:"3px 12px",color:allOn?cc:"#64748b",cursor:"pointer",fontSize:10,fontWeight:700,marginBottom:6}}>{allOn?"✓ ":""}{CAT_LABELS[cat]}</button>
        {items.map(s=>{ const on=selected.has(s.id); const freq=getFreq(s.id); const dia=getDia(s.id); return(
          <div key={s.id} style={{background:on?cc+"10":"#0f0f1c",border:`1px solid ${on?cc+"55":"#1a1a2e"}`,borderRadius:9,marginBottom:5,overflow:"hidden"}}>
            <div onClick={()=>toggle(s.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 13px",cursor:"pointer"}}>
              <Chk checked={on} ac={cc} onClick={()=>{}}/>
              <span style={{fontSize:15}}>{s.icon}</span>
              <div style={{flex:1}}><div style={{fontWeight:600,color:"#fff",fontSize:13}}>{s.label}</div><div style={{fontSize:11,color:"#475569"}}>{s.desc}</div></div>
              <span style={{background:cc+"22",color:cc,fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:600,whiteSpace:"nowrap"}}>{freq==="daily"?"Diário":freq==="weekly"?`Toda ${WDAYS[dia??1]}`:`Dia ${dia}`}</span>
            </div>
            {on&&(<div onClick={e=>e.stopPropagation()} style={{borderTop:`1px solid ${cc}22`,background:"#0d0d1a",padding:"10px 13px 13px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{fontSize:11,color:"#64748b",fontWeight:600,width:80}}>Frequência:</span>
                <div style={{display:"flex",gap:5}}>
                  {[["monthly","Mensal"],["weekly","Semanal"],["daily","Diário"]].map(([v,l])=>(
                    <button key={v} onClick={()=>setTFreq(s.id,v)} style={{padding:"4px 13px",borderRadius:6,border:`1px solid ${freq===v?cc:"#252540"}`,background:freq===v?cc:"transparent",color:freq===v?"#fff":"#475569",cursor:"pointer",fontSize:12,fontWeight:freq===v?800:400}}>{l}</button>
                  ))}
                </div>
              </div>
              {freq==="monthly"&&(<div style={{display:"flex",alignItems:"flex-start",gap:8}}>
                <span style={{fontSize:11,color:"#64748b",fontWeight:600,width:80,paddingTop:6}}>Dia do mês:</span>
                <div style={{display:"flex",gap:3,flexWrap:"wrap",flex:1}}>
                  {Array.from({length:28},(_,i)=>i+1).map(d=>(
                    <button key={d} onClick={()=>setTDia(s.id,d)} style={{width:34,height:30,borderRadius:5,border:`1px solid ${dia===d?cc:"#252540"}`,background:dia===d?cc:"transparent",color:dia===d?"#fff":"#64748b",cursor:"pointer",fontSize:11,fontWeight:dia===d?800:400}}>{d}</button>
                  ))}
                </div>
              </div>)}
              {freq==="weekly"&&(<div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:11,color:"#64748b",fontWeight:600,width:80}}>Dia da semana:</span>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {WDAYS.map((d,idx)=>(
                    <button key={idx} onClick={()=>setTDia(s.id,idx)} style={{padding:"5px 10px",borderRadius:6,border:`1px solid ${dia===idx?cc:"#252540"}`,background:dia===idx?cc:"transparent",color:dia===idx?"#fff":"#64748b",cursor:"pointer",fontSize:12,fontWeight:dia===idx?800:400}}>{d}</button>
                  ))}
                </div>
              </div>)}
              {freq==="daily"&&<span style={{fontSize:11,color:"#475569"}}>Aparece todos os dias úteis.</span>}
            </div>)}
          </div>
        );})}
      </div>);
    })}
    <div style={{background:`${ac}10`,border:`1px solid ${ac}33`,borderRadius:9,padding:"10px 14px",margin:"12px 0",display:"flex",gap:8,alignItems:"center"}}>
      <span>🗓️</span><span style={{color:ac,fontSize:12,fontWeight:600}}>{selected.size} tarefa(s) · sincronizadas no calendário dos próximos 3 meses</span>
    </div>
    <Btn ac={ac} full onClick={doSave}>Criar Cliente e Sincronizar Agenda</Btn>
  </div>);
}

function BpoClientDetail({client,clientIdx,onUpdate,onClose,ac}){
  const [tasks,setTasks]=useState(()=>(client.tasks||[]).map(t=>({...t,detalhes:t.detalhes||{}})));
  const [showSug,setShowSug]=useState(false);
  const [expDet,setExpDet]=useState({});
  const cc=clientColor(clientIdx);

  const delTask=(id)=>setTasks(ts=>ts.filter(t=>t.id!==id));
  const updFreq=(id,v)=>setTasks(ts=>ts.map(t=>t.id===id?{...t,freq:v}:t));
  const updDia=(id,v)=>setTasks(ts=>ts.map(t=>t.id===id?{...t,dia:v}:t));
  const updDet=(id,k,v)=>setTasks(ts=>ts.map(t=>t.id===id?{...t,detalhes:{...t.detalhes,[k]:v}}:t));
  const addDest=(id)=>setTasks(ts=>ts.map(t=>t.id===id?{...t,detalhes:{...t.detalhes,destinatarios:[...(t.detalhes?.destinatarios||[]),{nome:"",tipo:"colaborador",valor:"",banco:"",ref:""}]}}:t));
  const updDest=(tid,i,k,v)=>setTasks(ts=>ts.map(t=>t.id===tid?{...t,detalhes:{...t.detalhes,destinatarios:t.detalhes.destinatarios.map((d,j)=>j===i?{...d,[k]:v}:d)}}:t));
  const delDest=(tid,i)=>setTasks(ts=>ts.map(t=>t.id===tid?{...t,detalhes:{...t.detalhes,destinatarios:t.detalhes.destinatarios.filter((_,j)=>j!==i)}}:t));
  const addSug=(s)=>{ if(!tasks.some(t=>t.id===s.id)) setTasks(ts=>[...ts,{...s,detalhes:{}}]); };

  return(<Modal title={`Tarefas — ${client.name}`} onClose={onClose} wide>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
      <span style={{width:10,height:10,borderRadius:5,background:cc}}/>
      <span style={{color:cc,fontWeight:700,fontSize:13}}>{client.name}</span>
      {client.regime&&<span style={{background:cc+"22",color:cc,fontSize:10,padding:"2px 8px",borderRadius:20}}>{client.regime}</span>}
    </div>
    {tasks.length===0&&<p style={{color:"#2a2a45",fontSize:13,marginBottom:10}}>Nenhuma tarefa.</p>}
    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
      {tasks.map(t=>{
        const tc=CAT_COLORS[t.cat]||"#64748b"; const det=t.detalhes||{}; const open=expDet[t.id];
        const totalDests=(det.destinatarios||[]).reduce((s,d)=>s+(parseFloat(d.valor?.replace(",","."))||0),0);
        return(<div key={t.id} style={{background:"#111120",borderRadius:10,border:`1px solid ${tc}33`,overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px"}}>
            <span style={{fontSize:16}}>{t.icon}</span>
            <div style={{flex:1}}>
              <span style={{fontWeight:700,color:"#fff",fontSize:14}}>{t.label}</span>
              <span style={{background:tc+"22",color:tc,fontSize:10,padding:"1px 8px",borderRadius:20,marginLeft:8,fontWeight:600}}>{CAT_LABELS[t.cat]}</span>
              {det.assunto&&<span style={{color:"#94a3b8",fontSize:11,marginLeft:8}}>· {det.assunto}</span>}
              {totalDests>0&&<span style={{color:"#4ade80",fontSize:11,marginLeft:8,fontWeight:600}}>R$ {totalDests.toFixed(2)}</span>}
            </div>
            <button onClick={()=>setExpDet(e=>({...e,[t.id]:!e[t.id]}))} style={{background:open?tc+"22":"#1a1a2e",border:`1px solid ${open?tc:"#252540"}`,borderRadius:6,padding:"3px 10px",color:open?tc:"#64748b",cursor:"pointer",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>📋 {open?"▲":"Detalhes"}</button>
            <button onClick={()=>delTask(t.id)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:18,lineHeight:1}}>×</button>
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
            {t.freq==="monthly"&&(<div style={{display:"flex",alignItems:"flex-start",gap:8}}>
              <span style={{fontSize:11,color:"#64748b",fontWeight:600,width:80,paddingTop:5}}>Dia do mês:</span>
              <div style={{display:"flex",gap:3,flexWrap:"wrap",flex:1}}>
                {Array.from({length:28},(_,i)=>i+1).map(d=>(
                  <button key={d} onClick={()=>updDia(t.id,d)} style={{width:34,height:30,borderRadius:5,border:`1px solid ${t.dia===d?tc:"#252540"}`,background:t.dia===d?tc:"transparent",color:t.dia===d?"#fff":"#64748b",cursor:"pointer",fontSize:11,fontWeight:t.dia===d?800:400}}>{d}</button>
                ))}
              </div>
            </div>)}
            {t.freq==="weekly"&&(<div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:11,color:"#64748b",fontWeight:600,width:80}}>Dia da semana:</span>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {WDAYS.map((d,idx)=>(
                  <button key={idx} onClick={()=>updDia(t.id,idx)} style={{padding:"5px 10px",borderRadius:6,border:`1px solid ${t.dia===idx?tc:"#252540"}`,background:t.dia===idx?tc:"transparent",color:t.dia===idx?"#fff":"#64748b",cursor:"pointer",fontSize:12,fontWeight:t.dia===idx?800:400}}>{d}</button>
                ))}
              </div>
            </div>)}
            {t.freq==="daily"&&<span style={{fontSize:11,color:"#475569"}}>Aparece todos os dias úteis.</span>}
          </div>
          {open&&(<div style={{borderTop:`1px solid ${tc}44`,padding:"14px 14px 16px",background:"#0a0a14"}}>
            <p style={{fontSize:10,fontWeight:700,color:tc,margin:"0 0 12px",letterSpacing:"1px"}}>📋 DETALHES DA TAREFA</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              <Field label="Assunto / Descrição" style={{gridColumn:"1/-1"}}><Inp value={det.assunto||""} onChange={v=>updDet(t.id,"assunto",v)} placeholder="Ex: Pagamento conta de energia, conciliação Bradesco..."/></Field>
              <Field label="Conta Origem"><Inp value={det.contaOrigem||""} onChange={v=>updDet(t.id,"contaOrigem",v)} placeholder="Ex: Itaú CC 12345-6"/></Field>
              <Field label="Valor Total (R$)"><Inp value={det.valorTotal||""} onChange={v=>updDet(t.id,"valorTotal",v)} placeholder="Ex: 1.500,00"/></Field>
              <Field label="Observações" style={{gridColumn:"1/-1"}}><textarea value={det.obs||""} onChange={e=>updDet(t.id,"obs",e.target.value)} rows={2} placeholder="Notas, prazo, referência..." style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"8px 12px",color:"#e2e8f0",fontSize:12,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit"}}/></Field>
            </div>
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,marginTop:4}}>
                <p style={{fontSize:10,fontWeight:700,color:"#64748b",margin:0}}>{isPagamento(t)?"💸 DESTINATÁRIOS / BENEFICIÁRIOS":"👥 ENVOLVIDOS / PARA QUEM"}</p>
                <button onClick={()=>addDest(t.id)} style={{background:tc+"22",border:`1px solid ${tc}44`,borderRadius:6,padding:"3px 10px",color:tc,cursor:"pointer",fontSize:11,fontWeight:600}}>+ Adicionar</button>
              </div>
              {(!det.destinatarios||det.destinatarios.length===0)&&<p style={{color:"#2a2a45",fontSize:12,textAlign:"center",padding:"8px 0",marginBottom:8}}>{isPagamento(t)?"Nenhum destinatário.":"Nenhum envolvido."} Clique em "+ Adicionar".</p>}
              {(det.destinatarios||[]).map((dest,i)=>(
                <div key={i} style={{background:"#111120",borderRadius:9,padding:"12px 14px",marginBottom:8,border:"1px solid #1a1a2e"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{display:"flex",gap:5}}>
                      {[["colaborador","👤 Colaborador"],["fornecedor","🏢 Fornecedor"],["outro","📌 Outro"]].map(([v,l])=>(
                        <button key={v} onClick={()=>updDest(t.id,i,"tipo",v)} style={{padding:"3px 10px",borderRadius:6,border:`1px solid ${dest.tipo===v?tc:"#252540"}`,background:dest.tipo===v?tc:"transparent",color:dest.tipo===v?"#fff":"#475569",cursor:"pointer",fontSize:10,fontWeight:dest.tipo===v?700:400}}>{l}</button>
                      ))}
                    </div>
                    <button onClick={()=>delDest(t.id,i)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:16}}>×</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <Field label="Nome" style={{gridColumn:"1/-1"}}><Inp value={dest.nome} onChange={v=>updDest(t.id,i,"nome",v)} placeholder={dest.tipo==="colaborador"?"Nome do colaborador":dest.tipo==="fornecedor"?"Nome do fornecedor":"Nome / Descrição"}/></Field>
                    {isPagamento(t)&&<Field label="Valor (R$)"><Inp value={dest.valor} onChange={v=>updDest(t.id,i,"valor",v)} placeholder="0,00"/></Field>}
                    {isPagamento(t)&&<Field label="Banco / PIX"><Inp value={dest.banco} onChange={v=>updDest(t.id,i,"banco",v)} placeholder="PIX CPF 000.000.000-00"/></Field>}
                    <Field label="Referência / Observação" style={{gridColumn:"1/-1"}}><Inp value={dest.ref} onChange={v=>updDest(t.id,i,"ref",v)} placeholder={isPagamento(t)?"Ex: Salário Mar/25, NF 1234...":"Ex: Pauta da reunião, assunto..."}/></Field>
                  </div>
                </div>
              ))}
              {isPagamento(t)&&(det.destinatarios||[]).length>0&&(
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:4}}>
                  <span style={{background:"#14532d22",color:"#4ade80",fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:600}}>Total: R$ {(det.destinatarios||[]).reduce((s,d)=>s+(parseFloat(d.valor?.replace(",","."))||0),0).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>)}
        </div>);
      })}
    </div>
    <button onClick={()=>setShowSug(v=>!v)} style={{width:"100%",background:"#1a1a2e",border:`1px solid ${cc}44`,borderRadius:8,padding:"9px",color:cc,cursor:"pointer",fontSize:12,fontWeight:700,marginBottom:showSug?10:14}}>{showSug?"▲ Fechar sugestões":"+ Adicionar tarefas sugeridas"}</button>
    {showSug&&(<div style={{display:"flex",flexDirection:"column",gap:3,marginBottom:12,maxHeight:260,overflowY:"auto"}}>
      {BPO_SUGESTOES.filter(s=>!tasks.some(t=>t.id===s.id)).map(s=>{ const tc=CAT_COLORS[s.cat]||"#64748b"; return(
        <div key={s.id} onClick={()=>addSug(s)} style={{display:"flex",alignItems:"center",gap:10,background:"#0f0f1c",border:"1px solid #1a1a2e",borderRadius:8,padding:"8px 12px",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor=tc} onMouseLeave={e=>e.currentTarget.style.borderColor="#1a1a2e"}>
          <span style={{fontSize:14}}>{s.icon}</span>
          <div style={{flex:1}}><div style={{fontWeight:600,color:"#e2e8f0",fontSize:13}}>{s.label}</div><div style={{fontSize:10,color:"#475569"}}>{s.desc}</div></div>
          <span style={{background:tc+"22",color:tc,fontSize:10,padding:"2px 7px",borderRadius:20,fontWeight:600}}>{CAT_LABELS[s.cat]}</span>
        </div>
      );})}
    </div>)}
    <div style={{background:`${cc}10`,border:`1px solid ${cc}33`,borderRadius:9,padding:"10px 14px",marginBottom:12}}>
      <span style={{color:cc,fontSize:12}}>🗓️ Ao salvar, as tarefas serão <strong style={{color:"#fff"}}>sincronizadas no calendário</strong> dos próximos 3 meses.</span>
    </div>
    <Btn ac={ac} full onClick={()=>onUpdate({tasks})}>💾 Salvar e Sincronizar Agenda</Btn>
  </Modal>);
}

function CofreModal({client,ac,onUpdate,onClose}){
  const [cofre,setCofre]=useState({bancos:[],acessos:[],...(client.cofre||{})});
  const [showPwd,setShowPwd]=useState({}); const [tab,setTab]=useState("bancos");
  const addB=()=>setCofre(c=>({...c,bancos:[...c.bancos,{id:uid(),banco:"",agencia:"",conta:"",tipo:"corrente",pix:"",obs:""}]}));
  const updB=(id,k,v)=>setCofre(c=>({...c,bancos:c.bancos.map(b=>b.id===id?{...b,[k]:v}:b)}));
  const delB=id=>setCofre(c=>({...c,bancos:c.bancos.filter(b=>b.id!==id)}));
  const addA=()=>setCofre(c=>({...c,acessos:[...c.acessos,{id:uid(),sistema:"",usuario:"",senha:"",url:"",obs:""}]}));
  const updA=(id,k,v)=>setCofre(c=>({...c,acessos:c.acessos.map(a=>a.id===id?{...a,[k]:v}:a)}));
  const delA=id=>setCofre(c=>({...c,acessos:c.acessos.filter(a=>a.id!==id)}));
  return(<Modal title={`🔐 Cofre — ${client.name}`} onClose={()=>{onUpdate(cofre);onClose();}} wide>
    <div style={{background:"#0a0f0a",border:"1px solid #1a3a1a",borderRadius:8,padding:"8px 14px",marginBottom:14,display:"flex",gap:8,alignItems:"center"}}><span>🔒</span><span style={{color:"#4ade80",fontSize:12,fontWeight:600}}>Dados seguros · armazenados localmente</span></div>
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
          <Field label="Agência"><Inp value={b.agencia} onChange={v=>updB(b.id,"agencia",v)} placeholder="0000"/></Field>
          <Field label="Conta"><Inp value={b.conta} onChange={v=>updB(b.id,"conta",v)} placeholder="00000-0"/></Field>
          <Field label="Chave PIX" style={{gridColumn:"1/-1"}}><Inp value={b.pix} onChange={v=>updB(b.id,"pix",v)} placeholder="CNPJ, e-mail, telefone..."/></Field>
          <Field label="Obs." style={{gridColumn:"1/-1"}}><Inp value={b.obs} onChange={v=>updB(b.id,"obs",v)} placeholder="Notas"/></Field>
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
          <Field label="Usuário"><Inp value={a.usuario} onChange={v=>updA(a.id,"usuario",v)} placeholder="login@email.com"/></Field>
          <Field label="Senha" style={{gridColumn:"1/-1"}}>
            <div style={{position:"relative"}}>
              <input value={a.senha} onChange={e=>updA(a.id,"senha",e.target.value)} type={showPwd[a.id]?"text":"password"} placeholder="••••••••" style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"9px 40px 9px 12px",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
              <button onClick={()=>setShowPwd(s=>({...s,[a.id]:!s[a.id]}))} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:16,padding:0}}>{showPwd[a.id]?"🙈":"👁️"}</button>
            </div>
          </Field>
          <Field label="Obs." style={{gridColumn:"1/-1"}}><Inp value={a.obs} onChange={v=>updA(a.id,"obs",v)} placeholder="Token, certificado..."/></Field>
        </div>
      </div>))}
    </div>)}
    <Btn ac={ac} full onClick={()=>{onUpdate(cofre);onClose();}} style={{marginTop:14}}>💾 Salvar Cofre</Btn>
  </Modal>);
}

function Modal({title,children,onClose,wide}){return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.78)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}}><div style={{background:"#0f0f1c",border:"1px solid #1e1e35",borderRadius:16,padding:24,width:"100%",maxWidth:wide?680:420,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 40px 100px rgba(0,0,0,.6)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><h3 style={{margin:0,fontSize:16,fontWeight:700,color:"#fff"}}>{title}</h3><button onClick={onClose} style={{background:"#1a1a2e",border:"none",borderRadius:6,width:28,height:28,color:"#94a3b8",cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button></div>{children}</div></div>);}
function Field({label,children,style}){return <div style={{marginBottom:12,...style}}><label style={{fontSize:10,color:"#64748b",display:"block",marginBottom:4,fontWeight:700,letterSpacing:"0.5px"}}>{label.toUpperCase()}</label>{children}</div>;}
function Inp({value,onChange,type="text",placeholder=""}){return <input value={value} onChange={e=>onChange(e.target.value)} type={type} placeholder={placeholder} style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"9px 12px",color:"#fff",fontSize:13,outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor="#6366f1"} onBlur={e=>e.target.style.borderColor="#252540"}/>;}
function Sel({value,onChange,opts}){return <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",background:"#1a1a2e",border:"1px solid #252540",borderRadius:8,padding:"9px 12px",color:value?"#fff":"#64748b",fontSize:13}}>{opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>;}
function Btn({children,onClick,ac,full,style}){return <button onClick={onClick} style={{background:ac,border:"none",borderRadius:9,padding:"10px 16px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,width:full?"100%":"auto",...style}}>{children}</button>;}
function Chk({checked,ac,onClick}){return <div onClick={onClick} style={{width:22,height:22,borderRadius:6,border:`2px solid ${checked?ac:"#2a2a45"}`,background:checked?ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all .15s"}}>{checked&&<span style={{color:"#fff",fontSize:12,fontWeight:700}}>✓</span>}</div>;}
function Empty({text}){return <div style={{textAlign:"center",padding:"40px 24px",gridColumn:"1/-1"}}><div style={{fontSize:40,marginBottom:10}}>📭</div><p style={{margin:0,fontSize:14,color:"#475569"}}>{text}</p></div>;}
