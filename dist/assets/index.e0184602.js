import{g as A,h as p,x as H,r as B,o as c,c as l,a as t,Y as j,b as h,w as k,s as K,Z,G as q,I as J,F as U,D as V,N as Y,p as I,f as M,_ as T,A as L,L as b,t as N,H as R,e as Q,$ as W}from"./index.df7b46f6.js";const X="/vue-admin-perfect/assets/emoji-after.664cb306.png",ee={imgs:["\u7231\u4F60","\u7231\u60C5","\u7231\u5FC3","\u50B2\u6162","\u767D\u773C","\u62B1\u62F3","\u9119\u89C6","\u95ED\u5634","\u4FBF\u4FBF","\u64E6\u6C57","\u83DC\u5200","\u5DEE\u52B2","\u5472\u7259","\u5927\u54ED","\u86CB\u7CD5","\u5200","\u5F97\u610F","\u51CB\u8C22","\u53D1\u5446","NO","OK","\u53D1\u6296","\u53D1\u6012","\u996D","\u98DE\u543B","\u594B\u6597","\u75AF\u4E86","\u5C34\u5C2C","\u52FE\u5F15","\u9F13\u638C","\u54C8\u6B20"]},te=a=>(I("data-v-a33089f1"),a=a(),M(),a),se={class:"g-layout-content-chat-util"},ne={class:"item-left"},oe=["onClick"],ae=te(()=>t("img",{src:X,alt:"",style:{width:"20px"}},null,-1)),ce=[ae],le={class:"upload-picture",title:"\u4E0A\u4F20\u56FE\u7247"},ue={class:"emoje-border-wrap"},ie=["onClick"],re=["src","title"],de=A({__name:"index",emits:["insert","upload"],setup(a,{emit:u}){const i=p(ee.imgs),d=p(!1),g=(_,f)=>{if(_.target.tagName==="IMG"){let r=_.target.cloneNode(!0);r.title=f,u("insert",r,"IMG")}else u("insert",node)},C=()=>{d.value=!0,u("insert",null,null)},x=(_,f)=>new Promise((r,w)=>{var v=new FileReader;let m=/\.jpg$|\.jpeg$|\.gif$|\.png$/i;v.readAsDataURL(_);let y=_.name;m.test(y)?v.onload=F=>{r(F.target.result),u("upload",F.target.result)}:(Y.error("\u8BF7\u4E0A\u4F20\u56FE\u7247"),w())});return H(()=>{window.onclick=function(_){d.value=!1}}),(_,f)=>{const r=B("el-icon"),w=B("el-upload");return c(),l("div",se,[t("div",ne,[t("div",{class:"emoje",title:"\u9009\u62E9\u8868\u60C5",onClick:j(C,["stop"])},ce,8,oe),t("div",le,[h(w,{action:"",multiple:"","show-file-list":!1,"before-upload":x},{default:k(()=>[h(r,{style:{"font-size":"20px"}},{default:k(()=>[h(K(Z))]),_:1})]),_:1})]),q(t("div",ue,[(c(!0),l(U,null,V(i.value,(v,m)=>(c(),l("div",{class:"title-emoje",onClick:j(y=>g(y,v),["stop"]),key:m},[t("img",{src:`static/face/${v}.png`,title:v},null,8,re)],8,ie))),128))],512),[[J,d.value]])])])}}});const _e=T(de,[["__scopeId","data-v-a33089f1"]]),pe=[{is_self:0,created_at:"2022-11-15",content:"http://182.61.5.190:8889/we.png",id:1,type:2},{is_self:1,created_at:"2022-03-11",content:"hello \u4F60\u597D\u5440!",id:2,type:1}],S=a=>(I("data-v-ea640eae"),a=a(),M(),a),ve={class:"g-container-chat"},he={key:0,class:"from_user_info"},ge={class:"contact-nickname"},fe={class:"receive-message-wrap"},me=S(()=>t("div",{class:"avatar-show"},[t("img",{src:L})],-1)),Ce={style:{position:"relative",display:"flex"}},we=["innerHTML"],ye={key:1,class:"public-show-pic"},xe={key:1,class:"ower-user_info"},Fe={class:"contact-nickname"},De={class:"receive-message-wrap public-show-pic"},Be={style:{position:"relative",display:"flex"}},Ee={key:0,class:"receive-message-info"},$e=["innerHTML"],be={key:1,class:"public-show-pic"},ke=S(()=>t("div",{class:"avatar-show"},[t("img",{src:L})],-1)),Ae={class:"g-chat-container-footer-btn"},Ie=S(()=>t("div",{class:"",style:{"margin-right":"10px"}}," Ctrl+V\u7C98\u8D34, Ctrl+Enter\u6362\u884C ",-1)),Me=A({__name:"index",setup(a){const u=p(null),i=p(null),d=p(pe);p(L);const g=p(null),C=p(null),x=p([]),_=()=>{const e=g.value;e==null||e.focus(),i.value=document.getSelection(),u.value=i.value.getRangeAt(0)},f=e=>{if(window.getSelection){e.focus();let n=window.getSelection();n.selectAllChildren(e),n.collapseToEnd()}else if(document.selection){let n=document.selection.createRange();n.moveToElementText(e),n.collapse(!1),n.select()}},r=(e,n)=>{if(e){let s=document.createRange();s.selectNode(e),s.collapse(!!n),i.value.removeAllRanges(),i.value.addRange(s),s.value=s}else i.value.removeAllRanges(),i.value.addRange(u.value)},w=()=>{u.value=i.value.getRangeAt(0)},v=(e,n)=>{n==="IMG"?(u.value.insertNode(e),r(e,!1)):r()},m=(e,n=1)=>{const s=W().format("YYYY-MM-DD");return{is_self:1,created_at:s,content:e,type:n,id:Date.now()+Math.random()}},y=()=>{x.value=[],b(()=>{d.value.forEach(e=>{e.type===2&&x.value.push(e.content)})})},F=e=>{const n=g.value;let s=new Image;s.onload=function(){n.appendChild(s),f&&f(n)},s.src=e,s.setAttribute("insert","insert"),s.width=100},G=()=>{b(()=>{setTimeout(()=>{C.value.scrollTop=C.value.scrollHeight},0)})},O=()=>{const e=g.value.innerHTML;if(console.log("value===",e),!e)return r(),Y.error("\u8BF7\u586B\u5199\u53D1\u9001\u5185\u5BB9");let n=/<img.*?src="(.*?)".*?title="(.*?)".*?>/gi,s=/<img.*?src="(.*?)".*?insert="(.*?)">/gi,D=e.replace(n,"[$2]"),o=[],E=D.match(s);if(console.log("content",E),E){let P=D.replace(s,($,z)=>`/b/~${z}/b/~`).split("/b/~");for(let $ of P)$&&d.value.push(m($,2))}else o=m(e),d.value.push(o);y(),g.value.innerHTML="",console.log("content--",d.value),G()};return H(()=>{b(()=>{_()})}),(e,n)=>{const s=B("el-image"),D=B("el-button");return c(),l("div",ve,[t("div",{class:"g-layout-content-center",style:{width:"100%"},ref_key:"chatContentBoxs",ref:C},[(c(!0),l(U,null,V(d.value,(o,E)=>(c(),l("div",{key:o.id,style:{"padding-top":"15px"}},[o.is_self===0?(c(),l("div",he,[t("div",ge,N(o.created_at)+" \u6797\u5CF0",1),t("div",fe,[me,t("div",Ce,[o.type===1?(c(),l("div",{key:0,class:"receive-message-info",innerHTML:o.content},null,8,we)):o.type===2?(c(),l("div",ye,[h(s,{src:o.content,"preview-src-list":[o.content],style:{"max-width":"200px"},"data-resid":Date.now()},null,8,["src","preview-src-list","data-resid"])])):R("",!0)])])])):(c(),l("div",xe,[t("div",Fe,N(o.created_at)+" \u6797\u5CF0",1),t("div",De,[t("div",Be,[o.type==1?(c(),l("div",Ee,[t("div",{class:"text-content",innerHTML:o.content},null,8,$e)])):o.type===2?(c(),l("div",be,[h(s,{src:o.content,"preview-src-list":[o.content],style:{"max-width":"200px"},"data-resid":Date.now()},null,8,["src","preview-src-list","data-resid"])])):R("",!0)]),ke])]))]))),128))],512),h(_e,{onInsert:v,onUpload:F}),t("div",{onBlur:w,ref_key:"contenteditableInputs",ref:g,class:"g-chat-container-footer-input",contenteditable:"true"},null,544),t("div",Ae,[Ie,h(D,{onClick:O},{default:k(()=>[Q("\u53D1\u9001")]),_:1})])])}}});const Te=T(Me,[["__scopeId","data-v-ea640eae"]]),Le=a=>(I("data-v-b3288350"),a=a(),M(),a),Se={class:"app-container"},je={class:"app-container-inner m-chat"},Ne=Le(()=>t("div",{style:{"margin-bottom":"15px","flex-shrink":"0"}},"\u804A\u5929\u5185\u5BB9\u6846\uFF0C\u529F\u80FD\u6709\u53D1\u9001emoji\u8868\u60C5\uFF0C\u4E0A\u4F20\u56FE\u7247\uFF0C\u53D1\u9001\u56FE\u7247\uFF0C\u5185\u5BB9\u6EDA\u52A8\uFF0C\u53D1\u9001\u6587\u5B57",-1)),Re=A({__name:"index",setup(a){return(u,i)=>(c(),l("div",Se,[t("div",je,[Ne,h(Te,{class:"m-chat-box"})])]))}});const Ve=T(Re,[["__scopeId","data-v-b3288350"]]);export{Ve as default};
