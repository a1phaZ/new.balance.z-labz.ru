(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{206:function(e,t,a){e.exports=a(335)},335:function(e,t,a){"use strict";a.r(t);a(207),a(233),a(235),a(236),a(238),a(239),a(240),a(241),a(242),a(243),a(244),a(245),a(247),a(248),a(249),a(250),a(251),a(252),a(253),a(254),a(255),a(256),a(258),a(259),a(260),a(261),a(262),a(263),a(264),a(265),a(266),a(267),a(268),a(269),a(270),a(271),a(272),a(273),a(274),a(275);var n=a(0),l=a.n(n),o=a(142),c=a.n(o),r=a(36),i=a.n(r),u=a(8),d=a(71),s=a.n(d),m=(a(283),a(158)),p=a.n(m),v=a(159),E=a.n(v),f=a(61),y=a.n(f),b=a(99),O=a.n(b),h=a(3),g=function(e){return new Intl.NumberFormat("ru-RU",{style:"currency",currency:"RUB"}).format(e)},T=a(26),j=a.n(T),S=a(31),C=a(75),_=a.n(C),w=function(e){var t=e.data,a=e.showAll,o=void 0!==a&&a,c=e.dispatch,r=e.itemsName,i=e.needHide,d=void 0===i||i,s=Object(n.useState)((function(){return o})),m=Object(u.a)(s,2),p=m[0],v=m[1];if(0===t.length){if("accounts"===r)return l.a.createElement(h.i,null,"\u041d\u0435\u0442 \u0441\u0447\u0435\u0442\u043e\u0432 \u0434\u043b\u044f \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f");if("budgets"===r)return l.a.createElement(h.i,null,"\u041d\u0435\u0442 \u0431\u044e\u0434\u0436\u0435\u0442\u043e\u0432 \u0434\u043b\u044f \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f")}var E=t.sort((function(e,t){return t.sum-e.sum})).map((function(e,t){return 3!==t||p?t>3&&!p?null:l.a.createElement(_.a,{key:t,indicator:g(e.sum),expandable:!0,"data-id":e._id,onClick:function(){var e=Object(S.a)(j.a.mark((function e(t){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("accounts"!==r){e.next=5;break}return e.next=3,c({type:"SET_ACCOUNT",payload:{id:t.currentTarget.dataset.id}});case 3:return e.next=5,c({type:"SET_ACTIVE_VIEW",payload:{view:"info",panel:"account"}});case 5:if("budgets"!==r){e.next=10;break}return e.next=8,c({type:"SET_BUDGET",payload:{id:t.currentTarget.dataset.id}});case 8:return e.next=10,c({type:"SET_ACTIVE_VIEW",payload:{view:"info",panel:"budget"}});case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},e.title):l.a.createElement(_.a,{key:t,expandable:!0,onClick:function(){v(!0)}},l.a.createElement(h.I,{weight:"semibold",style:{marginBottom:16}},"\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u0432\u0441\u0435"))}));return d&&p&&E.push(l.a.createElement(_.a,{key:t.length,expandable:!0,onClick:function(){v(!1)}},l.a.createElement(h.I,{weight:"semibold",style:{marginBottom:16}},"accounts"===r?"\u0421\u043a\u0440\u044b\u0442\u044c \u0441\u0447\u0435\u0442\u0430":"\u0421\u043a\u0440\u044b\u0442\u044c \u0431\u044e\u0434\u0436\u0435\u0442\u044b"))),E},A=a(54),D=a.n(A),x=a(72),k=a.n(x),I=a(37),V=a(7),M={accounts:[],budgets:[],account:null,budget:null,modal:null,successMessage:null,error:null,activeView:"home",activePanel:"home",popout:null,editedItem:null,currentDate:new Date,history:[]},P=function(e,t){switch(t.type){case"SET_ACTIVE_VIEW":return window.history.pushState({activeView:t.payload.view,activePanel:t.payload.panel},"".concat(t.payload.panel,".").concat(t.payload.panel),window.location.search),Object(V.a)(Object(V.a)({},e),{},{activeView:t.payload.view,activePanel:t.payload.panel,history:[].concat(Object(I.a)(e.history),[{activeView:t.payload.view,activePanel:t.payload.panel}])});case"SET_ACTIVE_PANEL":return window.history.pushState({activeView:e.activeView,activePanel:t.payload.panel},"".concat(e.activeView,".").concat(t.payload.panel),window.location.search),Object(V.a)(Object(V.a)({},e),{},{activePanel:t.payload.panel,history:[].concat(Object(I.a)(e.history),[{activeView:e.activeView,activePanel:t.payload.panel}])});case"SET_HISTORY_BACK":var a,n=e.history[e.history.length-2],l=null===(a=t.payload)||void 0===a?void 0:a.state;if(l)return Object(V.a)(Object(V.a)({},e),{},{activeView:l.activeView,activePanel:l.activePanel,history:[{activeView:l.activeView,activePanel:l.activePanel}]});if(n){var o=e.history;return o.pop(),Object(V.a)(Object(V.a)({},e),{},{activeView:n.activeView,activePanel:n.activePanel,history:Object(I.a)(o)})}return Object(V.a)(Object(V.a)({},e),{},{activeView:"home",activePanel:"home",history:[{activeView:"home",activePanel:"home"}]});case"SET_ACCOUNTS":var c,r=null===(c=e.account)||void 0===c?void 0:c._id,i=r?t.payload.accounts.find((function(e){return e._id===r})):r;return Object(V.a)(Object(V.a)({},e),{},{accounts:t.payload.accounts,account:i});case"SET_BUDGETS":var u,d=null===(u=e.budget)||void 0===u?void 0:u._id,s=d?t.payload.budgets.find((function(e){return e._id===d})):d;return Object(V.a)(Object(V.a)({},e),{},{budgets:t.payload.budgets,budget:s});case"SET_ACCOUNT":var m=t.payload.id;return Object(V.a)(Object(V.a)({},e),{},{account:e.accounts.find((function(e){return e._id===m}))});case"SET_BUDGET":var p=t.payload.id;return Object(V.a)(Object(V.a)({},e),{},{budget:p?e.budgets.find((function(e){return e._id===p})):p});case"SET_EDITED_ITEM":return Object(V.a)(Object(V.a)({},e),{},{editedItem:t.payload.item});case"SET_POPOUT":return Object(V.a)(Object(V.a)({},e),{},{popout:t.payload.popout});case"SET_MODAL":return Object(V.a)(Object(V.a)({},e),{},{modal:t.payload.modal});case"SET_SUCCESS_MESSAGE":return Object(V.a)(Object(V.a)({},e),{},{successMessage:t.payload.message});case"SET_ERROR":return Object(V.a)(Object(V.a)({},e),{},{error:t.payload.error});case"SET_DATE":return Object(V.a)(Object(V.a)({},e),{},{currentDate:new Date(t.payload.date)});default:return e}},R=Object(n.createContext)(),L=function(e){var t=e.children,a=Object(n.useReducer)(P,M);return l.a.createElement(R.Provider,{value:a},t)},N=a(153),G=a.n(N),H=a(154),q=a.n(H),U=function(){var e=Object(n.useContext)(R),t=Object(u.a)(e,2),a=t[0],o=t[1],c=Object(n.useState)(null),r=Object(u.a)(c,2),i=r[0],d=r[1];return Object(n.useEffect)((function(){a.error&&d(l.a.createElement(h.F,{onClose:function(){o({type:"SET_ERROR",payload:{error:null}}),d(null)},before:l.a.createElement(G.a,{style:{color:"var(--destructive)"}})},a.error.message))}),[d,o,a.error]),Object(n.useEffect)((function(){a.successMessage&&d(l.a.createElement(h.F,{onClose:function(){o({type:"SET_SUCCESS_MESSAGE",payload:{message:null}}),d(null)},before:l.a.createElement(q.a,{style:{color:"var(--accent)"}})},a.successMessage))}),[d,o,a.successMessage]),l.a.createElement(l.a.Fragment,null,i)},F=a(338),B=a(155),W=a(337),K=a(62),z=a(156),Y=a.n(z),J=a(157),Q=a.n(J),X=function(e){var t=e.onRefresh,a=Object(n.useContext)(R),o=Object(u.a)(a,2),c=o[0],r=o[1],i=Object(F.a)(new Date,"yyyy.M")>=Object(F.a)(c.currentDate,"yyyy.M");return l.a.createElement(h.k,null,l.a.createElement(h.e,{before:l.a.createElement(h.c,{onClick:function(){r({type:"SET_DATE",payload:{date:Object(W.a)(c.currentDate,1)}}),t()},mode:"secondary"},l.a.createElement(Y.a,null)),asideContent:l.a.createElement(h.c,{disabled:i,onClick:function(){r({type:"SET_DATE",payload:{date:Object(B.a)(c.currentDate,1)}}),t()},mode:"secondary"},l.a.createElement(Q.a,null)),style:{textAlign:"center",fontWeight:"bold"}},Object(F.a)(c.currentDate,"LLLL yyyy",{locale:K.a}).toLocaleUpperCase()))},Z=function(e){var t=e.id,a=e.accounts,n=e.budgets,o=e.dispatch,c=e.onRefresh,r=e.isFetching,i=a.map((function(e){return e.sum})).reduce((function(e,t){return e+t}),0);return l.a.createElement(p.a,{id:t},l.a.createElement(E.a,{left:l.a.createElement(l.a.Fragment,null,l.a.createElement(h.v,{onClick:function(){o({type:"SET_MODAL",payload:{modal:"add-account"}})}},l.a.createElement(k.a,null)),0!==a.length&&l.a.createElement(h.v,{onClick:function(){o({type:"SET_ACCOUNT",payload:{id:null}}),o({type:"SET_MODAL",payload:{modal:"add-money"}})}},l.a.createElement(D.a,null)))},"Balance"),l.a.createElement(X,{onRefresh:c}),l.a.createElement(h.z,{onRefresh:c,isFetching:r},l.a.createElement(h.o,null,l.a.createElement(y.a,{header:l.a.createElement(h.l,{mode:"secondary"},"\u0412\u0430\u0448\u0438 \u0441\u0447\u0435\u0442\u0430"),separator:"show"},l.a.createElement(O.a,null,l.a.createElement(h.K,{level:"1",weight:"semibold",style:{marginBottom:16}},g(i)),l.a.createElement(w,{data:a,dispatch:o,showAll:!1,itemsName:"accounts"}))),l.a.createElement(y.a,{header:l.a.createElement(h.l,{mode:"secondary"},"\u0412\u0430\u0448\u0438 \u0431\u044e\u0434\u0436\u0435\u0442\u044b"),separator:"show"},l.a.createElement(O.a,null,l.a.createElement(w,{data:n,dispatch:o,showAll:!1,itemsName:"budgets"}))))),l.a.createElement(U,null))},$=a(55),ee=a(100),te=a.n(ee),ae=a(160),ne=a.n(ae),le=function(e){var t=Object(n.useState)(!1),a=Object(u.a)(t,2),o=a[0],c=a[1],r=Object(n.useState)(null),i=Object(u.a)(r,2),d=i[0],s=i[1],m=Object(n.useState)(null),p=Object(u.a)(m,2),v=p[0],E=p[1],f=Object(n.useState)({}),y=Object(u.a)(f,2),b=y[0],O=y[1],g=Object(n.useContext)(R),T=Object(u.a)(g,2)[1],C=Object(n.useCallback)((function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};O(e),s(null),E(null),c(!0),T({type:"SET_POPOUT",payload:{popout:l.a.createElement(h.y,null,l.a.createElement(h.C,null))}})}),[T]),_=b.method,w=void 0===_?"GET":_,A=b.params,D=Object($.a)(b,["method","params"]),x={method:w,baseURL:"https://balance.z-labz.ru/api",url:e,headers:{"Content-Type":"application/json"},params:A?Object(V.a)(Object(V.a)({},A),te.a.parse(window.location.search)):Object(V.a)({},te.a.parse(window.location.search)),data:"GET"!==w?D:null};return Object(n.useEffect)((function(){o&&function(){var e=Object(S.a)(j.a.mark((function e(){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c(!1),e.next=3,ne()(x).then(function(){var e=Object(S.a)(j.a.mark((function e(t){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:s(t.data.data),T({type:"SET_POPOUT",payload:{popout:null}}),T({type:"SET_MODAL",payload:{modal:null}}),T({type:"SET_SUCCESS_MESSAGE",payload:{message:t.data.message}});case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()).catch((function(e){var t=(null===e||void 0===e?void 0:e.response)?e.response.data.error:new Error("\u041f\u0440\u043e\u0431\u043b\u0435\u043c\u044b \u0441 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435\u043c \u043a API");E(t),c(!1),T({type:"SET_POPOUT",payload:{popout:null}}),T({type:"SET_MODAL",payload:{modal:null}}),T({type:"SET_ERROR",payload:{error:t}})}));case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()()}),[o,x,T]),[{isLoading:o,response:d,error:v},C]},oe=a(53),ce=a.n(oe),re=a(76),ie=a.n(re),ue=a(164),de=a.n(ue),se=a(165),me=a.n(se),pe=a(166),ve=a.n(pe),Ee=function(e){var t=e.currentTarget.validity;return t.valid?{status:"valid",message:null}:t.badInput?{status:"error",message:"\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u0444\u043e\u0440\u043c\u0430\u0442 \u0432\u0432\u043e\u0434\u0430"}:t.tooLong?{status:"error",message:"\u041f\u0440\u0435\u0432\u044b\u0448\u0435\u043d\u0430 \u043c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u0430\u044f \u0434\u043b\u0438\u043d\u0430"}:t.typeMismatch?{status:"error",message:"\u041d\u0435\u0441\u043e\u043e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0435 \u0442\u0438\u043f\u0430"}:t.rangeOverflow?{status:"error",message:"\u0421\u043b\u0438\u0448\u043a\u043e\u043c \u0431\u043e\u043b\u044c\u0448\u043e\u0435 \u0447\u0438\u0441\u043b\u043e"}:{status:"default",message:null}},fe={title:"",sum:"",titleValidation:{},sumValidation:{}},ye=function(e,t){switch(t.type){case"CHANGE_STATE":var a=t.payload;return Object(V.a)(Object(V.a)({},e),a);default:return e}},be=function(e){var t=e.onRefresh,a=Object(n.useReducer)(ye,fe),o=Object(u.a)(a,2),c=o[0],r=o[1],i=le("/money-box"),d=Object(u.a)(i,2),s=d[0].response,m=d[1];return Object(n.useEffect)((function(){s&&t()}),[s,t]),l.a.createElement(h.j,{onSubmit:function(){var e=Object(S.a)(j.a.mark((function e(t){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),e.next=3,m({method:"POST",title:c.title,sum:c.sum});case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},l.a.createElement(h.n,{type:"text",placeholder:"\u041a\u0430\u0440\u0442\u0430, \u043d\u0430\u043b\u0438\u0447\u043d\u044b\u0435, \u0441\u0447\u0435\u0442 \u0432 \u0431\u0430\u043d\u043a\u0435",top:"\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435",value:c.title,required:!0,maxLength:"20",status:c.titleValidation.status,bottom:c.titleValidation.message?c.titleValidation.message:"".concat(c.title.length," \u0438\u0437 20"),onChange:function(e){return r({type:"CHANGE_STATE",payload:{title:e.currentTarget.value,titleValidation:Ee(e)}})}}),l.a.createElement(h.n,{type:"number",placeholder:g(0),top:"\u041e\u0441\u0442\u0430\u0442\u043e\u043a \u0432 \u0440\u0443\u0431\u043b\u044f\u0445",value:c.sum,required:!0,status:c.sumValidation.status,max:999999999,step:.01,bottom:c.sumValidation.message?c.sumValidation.message:"\u0414\u0435\u043d\u0435\u0436\u043d\u044b\u0435 \u0441\u0440\u0435\u0434\u0441\u0442\u0432\u0430, \u043d\u0430\u0445\u043e\u0434\u044f\u0449\u0438\u0435\u0441\u044f \u043d\u0430 \u0441\u0447\u0435\u0442\u0435 \u0432 \u0434\u0430\u043d\u043d\u044b\u0439 \u043c\u043e\u043c\u0435\u043d\u0442",onChange:function(e){return r({type:"CHANGE_STATE",payload:{sum:e.currentTarget.value,sumValidation:Ee(e)}})}}),l.a.createElement(h.c,{size:"xl"},"\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c"))},Oe={account:"",title:"",date:Object(F.a)(new Date,"yyyy-MM-dd"),income:!1,description:"",price:"",quantity:"",tags:[],validate:{account:{},title:{},description:{},price:{},quantity:{},tags:{}}},he=function(e,t){switch(t.type){case"CHANGE_STATE":var a=t.payload,n=a.validateForm,l=Object($.a)(a,["validateForm"]);return Object(V.a)(Object(V.a)(Object(V.a)({},e),l),{},{validate:Object(V.a)(Object(V.a)({},e.validate),n)});default:return e}},ge=function(e){var t,a,o,c,r,i,d,s,m,p,v,E,f,y,b,O,T,j,S,C,_,w,A,D,x,k,I,M,P,R,L=e.accounts,N=e.id,G=void 0===N?null:N,H=e.editedItem,q=void 0===H?null:H,U=e.onRefresh,B=Object(n.useState)((function(){return q?"/item/".concat(q._id):"/item"})),W=Object(u.a)(B,1)[0],K=le(W),z=Object(u.a)(K,2),Y=z[0].response,J=z[1],Q=Object(n.useReducer)(he,Oe),X=Object(u.a)(Q,2),Z=X[0],$=X[1],ee=L.map((function(e){return l.a.createElement("option",{key:e._id,value:e._id},e.title," (",g(e.sum),")")}));Object(n.useEffect)((function(){q&&(q.date=Object(F.a)(new Date(q.date),"yyyy-MM-dd"),$({type:"CHANGE_STATE",payload:Object(V.a)({},q)}))}),[q,$]),Object(n.useEffect)((function(){Y&&U()}),[Y,U]);var te=Z.tags.map((function(e,t){return l.a.createElement(h.f,{style:{marginRight:"5px"},key:t},e)}));return l.a.createElement(h.j,{onSubmit:function(e){e.preventDefault(),J({method:q?"PATCH":"POST",date:Z.date,title:Z.title,description:Z.description,price:Z.price,quantity:Z.quantity,income:Z.income,tags:Z.tags,itemFrom:Z.account||G})}},l.a.createElement(h.E,{top:"\u0421\u0447\u0435\u0442",placeholder:"\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0447\u0435\u0442",onChange:function(e){$({type:"CHANGE_STATE",payload:{account:e.currentTarget.value,validateForm:{account:Ee(e)}}})},defaultValue:(null===q||void 0===q?void 0:q.itemFrom)||G||Z.account,required:!0,status:null===(t=Z.validate)||void 0===t||null===(a=t.account)||void 0===a?void 0:a.status,bottom:null===(o=Z.validate)||void 0===o||null===(c=o.account)||void 0===c?void 0:c.message},ee),l.a.createElement(h.n,{type:"date",top:"\u0414\u0430\u0442\u0430",value:Z.date,required:!0,onChange:function(e){$({type:"CHANGE_STATE",payload:{date:e.currentTarget.value}})}}),l.a.createElement(h.n,{type:"text",placeholder:"\u041f\u0440\u043e\u0434\u0443\u043a\u0442, \u0443\u0441\u043b\u0443\u0433\u0430, \u0442\u043e\u0432\u0430\u0440",value:Z.title,top:"\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435",required:!0,maxLength:20,status:null===(r=Z.validate)||void 0===r||null===(i=r.title)||void 0===i?void 0:i.status,bottom:(null===(d=Z.validate)||void 0===d||null===(s=d.title)||void 0===s?void 0:s.message)?null===(m=Z.validate)||void 0===m||null===(p=m.title)||void 0===p?void 0:p.message:"".concat(Z.title.length," \u0438\u0437 20"),onChange:function(e){$({type:"CHANGE_STATE",payload:{title:e.currentTarget.value,validateForm:{title:Ee(e)}}})}}),l.a.createElement(h.A,{name:"income",value:!1,defaultChecked:!Z.income||null,onClick:function(){$({type:"CHANGE_STATE",payload:{income:!1}})}},"\u0420\u0430\u0441\u0445\u043e\u0434"),l.a.createElement(h.A,{name:"income",value:!0,defaultChecked:!!Z.income||null,onClick:function(){$({type:"CHANGE_STATE",payload:{income:!0}})}},"\u0414\u043e\u0445\u043e\u0434"),!Z.income&&l.a.createElement(h.J,{top:"\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435",placeholder:"\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0442\u043e\u0432\u0430\u0440\u0430(\u043f\u0440\u043e\u0434\u0443\u043a\u0442\u0430, \u0443\u0441\u043b\u0443\u0433\u0438)",value:Z.description,maxLength:70,status:null===(v=Z.validate)||void 0===v||null===(E=v.description)||void 0===E?void 0:E.status,bottom:(null===(f=Z.validate)||void 0===f||null===(y=f.description)||void 0===y?void 0:y.message)?null===(b=Z.validate)||void 0===b||null===(O=b.description)||void 0===O?void 0:O.message:"".concat(Z.description.length," \u0438\u0437 70"),onChange:function(e){$({type:"CHANGE_STATE",payload:{description:e.currentTarget.value,validateForm:{description:Ee(e)}}})}}),l.a.createElement(h.n,{type:"text",top:"\u0422\u044d\u0433\u0438",value:Z.tags.join(" "),placeholder:"\u0422\u044d\u0433\u0438 \u0447\u0435\u0440\u0435\u0437 \u043f\u0440\u043e\u0431\u0435\u043b",status:null===(T=Z.validate)||void 0===T||null===(j=T.tags)||void 0===j?void 0:j.status,maxLength:100,bottom:(null===(S=Z.validate)||void 0===S||null===(C=S.tags)||void 0===C?void 0:C.message)?null===(_=Z.validate)||void 0===_||null===(w=_.tags)||void 0===w?void 0:w.message:"".concat(Z.tags.length," \u0438\u0437 100"),onChange:function(e){$({type:"CHANGE_STATE",payload:{tags:e.currentTarget.value.toLowerCase().split(" "),validateForm:{tags:Ee(e)}}})}}),0!==Z.tags.length&&l.a.createElement(h.g,{style:{display:"flex"}},te),l.a.createElement(h.n,{type:"number",placeholder:g(0),top:"\u0426\u0435\u043d\u0430",max:99999999,step:.01,status:null===(A=Z.validate)||void 0===A||null===(D=A.price)||void 0===D?void 0:D.status,bottom:null===(x=Z.validate)||void 0===x||null===(k=x.price)||void 0===k?void 0:k.message,value:Z.price,required:!0,onChange:function(e){$({type:"CHANGE_STATE",payload:{price:e.currentTarget.value,validateForm:{price:Ee(e)}}})}}),l.a.createElement(h.n,{type:"number",placeholder:"0",top:"\u041a\u043e\u043b-\u0432\u043e",max:9999999,step:.01,status:null===(I=Z.validate)||void 0===I||null===(M=I.quantity)||void 0===M?void 0:M.status,bottom:null===(P=Z.validate)||void 0===P||null===(R=P.quantity)||void 0===R?void 0:R.message,value:Z.quantity,required:!0,onChange:function(e){$({type:"CHANGE_STATE",payload:{quantity:e.currentTarget.value,validateForm:{quantity:Ee(e)}}})}}),l.a.createElement(h.c,{size:"xl"},"\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c"))},Te=a(73),je=a.n(Te),Se=a(74),Ce=a.n(Se);function _e(e){return function(t,a){return t.titleDate?l.a.createElement(h.d,{level:"2",weight:"semibold",caps:!0,key:a},Object(F.a)(new Date(null===t||void 0===t?void 0:t.titleDate),"dd MMMM yyyy",{locale:K.a})):l.a.createElement(h.B,{key:a,multiline:!0,caption:Object(F.a)(new Date(null===t||void 0===t?void 0:t.date),"dd MMMM yyyy",{locale:K.a}),after:(null===t||void 0===t?void 0:t.income)?g(null===t||void 0===t?void 0:t.sum):g(-1*(null===t||void 0===t?void 0:t.sum)),"data-id":null===t||void 0===t?void 0:t._id,onClick:function(){e({type:"SET_EDITED_ITEM",payload:{item:t}}),e({type:"SET_MODAL",payload:{modal:"add-money"}})}},null===t||void 0===t?void 0:t.title)}}var we=a(161),Ae=function(e,t){var a=new Date(e.date),n=new Date(t.date);return Object(we.a)(n,a)},De=a(162),xe=function(e,t){var a;return Object(De.a)(new Date(null===(a=e[e.length-1])||void 0===a?void 0:a.date),new Date(t.date))?[].concat(Object(I.a)(e),[t]):[].concat(Object(I.a)(e),[{titleDate:t.date},t])},ke=function(e){var t=e.id,a=e.account,o=e.dispatch,c=e.onRefresh,r=Object(n.useState)(!1),i=Object(u.a)(r,2),d=i[0],s=i[1],m=le("/money-box/".concat(null===a||void 0===a?void 0:a._id)),p=Object(u.a)(m,2),v=p[0].response,E=p[1],f=Object(n.useState)((function(){return null===a||void 0===a?void 0:a.operations})),b=Object(u.a)(f,2),O=b[0],T=b[1],C=Object(n.useState)((function(){return O})),_=Object(u.a)(C,2),w=_[0],A=_[1],x=w.sort(Ae).reduce(xe,[]).map(_e(o)),k=function(){s(!d)},I=l.a.createElement(h.b,{actions:[{title:"\u041e\u0442\u043c\u0435\u043d\u0430",autoclose:!0,mode:"cancel"},{title:"\u0423\u0434\u0430\u043b\u0438\u0442\u044c",autoclose:!0,action:function(){var e=Object(S.a)(j.a.mark((function e(){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return k(),e.next=3,E({method:"DELETE"});case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()}],onClose:function(){k(),o({type:"SET_POPOUT",payload:{popout:null}})}},l.a.createElement("h2",null,"\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0441\u0447\u0435\u0442?"),l.a.createElement("p",null,"\u0423\u0434\u0430\u043b\u0435\u043d\u0438\u0435 \u0441\u0447\u0435\u0442\u0430 \u043f\u0440\u0438\u0432\u0435\u0434\u0435\u0442 \u043a \u0443\u0434\u0430\u043b\u0435\u043d\u0438\u044e \u0432\u0441\u0435\u0445 \u0434\u0430\u043d\u043d\u044b\u0445 \u043f\u043e \u0434\u043e\u0445\u043e\u0434\u0430\u043c \u0438 \u0440\u0430\u0441\u0445\u043e\u0434\u0430\u043c, \u043f\u0440\u0438\u0432\u044f\u0437\u0430\u043d\u043d\u044b\u043c \u043a \u0434\u0430\u043d\u043d\u043e\u043c\u0443 \u0441\u0447\u0435\u0442\u0443. \u0421\u0443\u043c\u043c\u044b \u0431\u044e\u0434\u0436\u0435\u0442\u043e\u0432 \u043c\u043e\u0433\u0443\u0442 \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0442\u044c\u0441\u044f \u043d\u0435\u043a\u043e\u0440\u0435\u043a\u0442\u043d\u043e."));Object(n.useEffect)((function(){T(null===a||void 0===a?void 0:a.operations),A(null===a||void 0===a?void 0:a.operations)}),[a]),Object(n.useEffect)((function(){v&&(o({type:"SET_ACTIVE_VIEW",payload:{view:"home",panel:"home"}}),o({type:"SET_EDITED_ITEM",payload:{item:null}}),c())}),[o,v,c]);return l.a.createElement(h.s,{id:t},l.a.createElement(h.t,{left:l.a.createElement(l.a.Fragment,null,l.a.createElement(h.u,{onClick:function(){o({type:"SET_HISTORY_BACK"}),o({type:"SET_EDITED_ITEM",payload:{item:null}})}}),l.a.createElement(h.v,{onClick:function(){o({type:"SET_EDITED_ITEM",payload:{item:null}}),o({type:"SET_MODAL",payload:{modal:"add-money"}})}},l.a.createElement(D.a,null)))},l.a.createElement(h.w,{aside:l.a.createElement(je.a,{style:{transform:"rotate(".concat(d?"180deg":"0",")")}}),onClick:k},null===a||void 0===a?void 0:a.title)),l.a.createElement(h.x,{opened:d,onClose:k},l.a.createElement(h.o,null,l.a.createElement(h.e,{before:l.a.createElement(Ce.a,null),onClick:function(){o({type:"SET_POPOUT",payload:{popout:I}})}},"\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0441\u0447\u0435\u0442 ",null===a||void 0===a?void 0:a.title))),l.a.createElement(X,{onRefresh:c}),l.a.createElement(h.D,{onChange:function(e){var t;t=e.currentTarget.value,A(""===t?O:null===a||void 0===a?void 0:a.operations.filter((function(e){return e.title.toLowerCase().indexOf(t.toLowerCase())>-1})))}}),l.a.createElement(y.a,{header:l.a.createElement(h.l,{mode:"secondary"},"\u0418\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u043f\u043e \u0441\u0447\u0435\u0442\u0443"),separator:"show"},l.a.createElement(h.g,null,l.a.createElement(h.K,{level:"1",weight:"semibold",style:{marginBottom:16}},g(null===a||void 0===a?void 0:a.sum))),0===(null===a||void 0===a?void 0:a.operations.length)&&l.a.createElement(h.i,null,"\u041e\u043f\u0435\u0440\u0430\u0446\u0438\u0439 \u043f\u043e \u0441\u0447\u0435\u0442\u0443 \u0435\u0449\u0435 \u043d\u0435 \u0431\u044b\u043b\u043e"),l.a.createElement(h.g,null,x,0===x.length&&l.a.createElement(h.i,null,"\u041d\u0435\u0442 \u0434\u0430\u043d\u043d\u044b\u0445 \u0434\u043b\u044f \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f"))),l.a.createElement(U,null))},Ie=function(e){var t=e.id,a=e.budgets,n=e.dispatch,o=e.date,c=void 0===o?new Date:o,r=e.onRefresh,i=a.map((function(e){return e.startSum})).reduce((function(e,t){return e+t}),0),u=a.map((function(e){return e.sum})).reduce((function(e,t){return e+t}),0);return l.a.createElement(h.s,{id:t},l.a.createElement(h.t,{left:l.a.createElement(h.v,{onClick:function(){return n({type:"SET_MODAL",payload:{modal:"add-budget"}})}},l.a.createElement(k.a,null))},"\u0411\u044e\u0434\u0436\u0435\u0442\u044b"),l.a.createElement(X,{onRefresh:r}),l.a.createElement(h.k,{header:l.a.createElement(h.l,{mode:"secondary"},"\u0412\u0430\u0448\u0438 \u0431\u044e\u0434\u0436\u0435\u0442\u044b \u043d\u0430 ",Object(F.a)(new Date(c),"MMM yyyy",{locale:K.a})),separator:"show"},l.a.createElement(w,{data:a,dispatch:n,showAll:!0,itemsName:"budgets",needHide:!1}),l.a.createElement(h.i,null,"\u041e\u0441\u0442\u0430\u043b\u043e\u0441\u044c ",g(u)," \u0438\u0437 ",g(i))),l.a.createElement(U,null))},Ve={title:"",startSum:"",validate:{title:{},startSum:{}}},Me=function(e,t){switch(t.type){case"CHANGE_STATE":var a=t.payload,n=a.validateForm,l=Object($.a)(a,["validateForm"]);return Object(V.a)(Object(V.a)(Object(V.a)({},e),l),{},{validate:Object(V.a)(Object(V.a)({},e.validate),n)});default:return e}},Pe=function(e){var t,a,o,c,r,i,d,s,m,p,v,E,f=e.onRefresh,y=e.editedItem,b=void 0===y?null:y,O=Object(n.useReducer)(Me,Ve),T=Object(u.a)(O,2),C=T[0],_=T[1],w=Object(n.useState)((function(){return b?"/budget/".concat(b._id):"/budget"})),A=Object(u.a)(w,1)[0],D=le(A),x=Object(u.a)(D,2),k=x[0].response,I=x[1];return Object(n.useEffect)((function(){b&&(k||_({type:"CHANGE_STATE",payload:Object(V.a)({},b)}))}),[b,_,k]),Object(n.useEffect)((function(){k&&f()}),[f,k]),l.a.createElement(h.j,{onSubmit:function(){var e=Object(S.a)(j.a.mark((function e(t){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),e.next=3,I({method:b?"PATCH":"POST",title:C.title,sum:C.startSum});case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},l.a.createElement(h.n,{type:"text",placeholder:"\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u0431\u044e\u0434\u0436\u0435\u0442\u0430",top:"\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435",value:C.title,required:!0,maxLength:"20",status:null===(t=C.validate)||void 0===t||null===(a=t.title)||void 0===a?void 0:a.status,bottom:(null===(o=C.validate)||void 0===o||null===(c=o.title)||void 0===c?void 0:c.message)?null===(r=C.validate)||void 0===r||null===(i=r.title)||void 0===i?void 0:i.message:"".concat(C.title.length," \u0438\u0437 20"),onChange:function(e){return _({type:"CHANGE_STATE",payload:{title:e.currentTarget.value,validateForm:{title:Ee(e)}}})}}),l.a.createElement(h.n,{type:"number",placeholder:g(0),top:"\u0411\u044e\u0434\u0436\u0435\u0442 \u0432 \u0440\u0443\u0431\u043b\u044f\u0445",value:C.startSum,required:!0,status:null===(d=C.validate)||void 0===d||null===(s=d.startSum)||void 0===s?void 0:s.status,max:999999999,step:.01,bottom:(null===(m=C.validate)||void 0===m||null===(p=m.startSum)||void 0===p?void 0:p.message)?null===(v=C.validate)||void 0===v||null===(E=v.startSum)||void 0===E?void 0:E.message:"\u0421\u043a\u043e\u043b\u044c\u043a\u043e \u0432\u044b \u0433\u043e\u0442\u043e\u0432\u044b \u043d\u0430 \u044d\u0442\u043e \u043f\u043e\u0442\u0440\u0430\u0442\u0438\u0442\u044c?",onChange:function(e){return _({type:"CHANGE_STATE",payload:{startSum:e.currentTarget.value,validateForm:{startSum:Ee(e)}}})}}),l.a.createElement(h.c,{size:"xl"},"\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c"))},Re=a(163),Le=a.n(Re),Ne=function(e){var t=e.id,a=e.budget,o=e.dispatch,c=e.onRefresh,r=Object(n.useState)(!1),i=Object(u.a)(r,2),d=i[0],s=i[1],m=le("/budget/".concat(null===a||void 0===a?void 0:a._id)),p=Object(u.a)(m,2),v=p[0].response,E=p[1],f=Object(n.useState)((function(){return null===a||void 0===a?void 0:a.items})),y=Object(u.a)(f,2),b=y[0],O=y[1],g=Object(n.useState)((function(){return b})),T=Object(u.a)(g,2),C=T[0],_=T[1];Object(n.useEffect)((function(){O(null===a||void 0===a?void 0:a.items),_(null===a||void 0===a?void 0:a.items)}),[a]),Object(n.useEffect)((function(){v&&(null===v||void 0===v?void 0:v.deletedCount)&&(o({type:"SET_ACTIVE_VIEW",payload:{view:"home",panel:"home"}}),o({type:"SET_EDITED_ITEM",payload:{item:null}}),c())}),[v,o,c]);var w=function(){s(!d)},A=l.a.createElement(h.b,{actions:[{title:"\u041e\u0442\u043c\u0435\u043d\u0430",autoclose:!0,mode:"cancel"},{title:"\u0423\u0434\u0430\u043b\u0438\u0442\u044c",autoclose:!0,action:function(){var e=Object(S.a)(j.a.mark((function e(){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return w(),e.next=3,E({method:"DELETE"});case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()}],onClose:function(){w(),o({type:"SET_POPOUT",payload:{popout:null}})}},l.a.createElement("h2",null,"\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0431\u044e\u0434\u0436\u0435\u0442?"),l.a.createElement("p",null,"\u0412\u044b \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043b\u044c\u043d\u043e \u0445\u043e\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043b\u0438\u0442\u044c \u0431\u044e\u0434\u0436\u0435\u0442?")),x=C&&C.sort(Ae).reduce(xe,[]).map(_e(o));return l.a.createElement(h.s,{id:t},l.a.createElement(h.t,{left:l.a.createElement(l.a.Fragment,null,l.a.createElement(h.u,{onClick:function(){o({type:"SET_HISTORY_BACK"}),o({type:"SET_EDITED_ITEM",payload:{item:null}}),o({type:"SET_BUDGET",payload:{id:null}})}}),l.a.createElement(h.v,{onClick:function(){o({type:"SET_EDITED_ITEM",payload:{item:null}}),o({type:"SET_MODAL",payload:{modal:"add-money"}})}},l.a.createElement(D.a,null)))},l.a.createElement(h.w,{aside:l.a.createElement(je.a,{style:{transform:"rotate(".concat(d?"180deg":"0",")")}}),onClick:w},null===a||void 0===a?void 0:a.title)),l.a.createElement(h.x,{opened:d,onClose:w},l.a.createElement(h.o,null,l.a.createElement(h.e,{before:l.a.createElement(Le.a,null),onClick:function(){o({type:"SET_MODAL",payload:{modal:"add-budget"}}),w()}},"\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0431\u044e\u0434\u0436\u0435\u0442 ",null===a||void 0===a?void 0:a.title),l.a.createElement(h.e,{before:l.a.createElement(Ce.a,null),onClick:function(){o({type:"SET_POPOUT",payload:{popout:A}})}},"\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0431\u044e\u0434\u0436\u0435\u0442 ",null===a||void 0===a?void 0:a.title))),l.a.createElement(h.D,{onChange:function(e){var t;t=e.currentTarget.value,_(""===t?b:a.items.filter((function(e){return e.title.toLowerCase().indexOf(t.toLowerCase())>-1})))}}),l.a.createElement(h.g,null,x,0===(null===x||void 0===x?void 0:x.length)&&l.a.createElement(h.i,null,"\u041d\u0435\u0442 \u0434\u0430\u043d\u043d\u044b\u0445 \u0434\u043b\u044f \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f")),l.a.createElement(U,null))},Ge=function(e){var t=e.id,a=e.accounts,o=e.onRefresh,c=Object(n.useState)((function(){return a.map((function(e){return e.operations})).flat().filter((function(e){return!e.income})).sort((function(e,t){return e.title.localeCompare(t.title)}))})),r=Object(u.a)(c,2),i=r[0],d=r[1],s=Object(n.useState)((function(){return i})),m=Object(u.a)(s,2),p=m[0],v=m[1],E=p.reduce((function(e,t){var a;if((null===(a=e[e.length-1])||void 0===a?void 0:a.title)===t.title){var n=e[e.length-1];n.sum=n.sum+t.sum,n.quantity+=t.quantity;var l=[].concat(Object(I.a)(e.slice(0,e.length-1)),[n]);return Object(I.a)(l)}return[].concat(Object(I.a)(e),[{title:t.title,sum:t.sum,quantity:t.quantity}])}),[]).map((function(e,t){return l.a.createElement(h.B,{key:t,multiline:!0,caption:"\u041a\u043e\u043b-\u0432\u043e: ".concat(null===e||void 0===e?void 0:e.quantity," | \u0421\u0440. \u0446\u0435\u043d\u0430 ").concat(g((null===e||void 0===e?void 0:e.sum)/(null===e||void 0===e?void 0:e.quantity))),after:g(null===e||void 0===e?void 0:e.sum),"data-title":null===e||void 0===e?void 0:e.title},null===e||void 0===e?void 0:e.title)}));Object(n.useEffect)((function(){var e=a.map((function(e){return e.operations})).flat().filter((function(e){return!e.income})).sort((function(e,t){return e.title.localeCompare(t.title)}));d(e),v(e)}),[a]);return l.a.createElement(h.s,{id:t},l.a.createElement(h.t,null,"\u0421\u0432\u043e\u0434\u043a\u0430"),l.a.createElement(X,{onRefresh:o}),l.a.createElement(h.D,{onChange:function(e){var t;t=e.currentTarget.value,v(""===t?a.map((function(e){return e.operations})).flat().filter((function(e){return!e.income})).sort((function(e,t){return e.title.localeCompare(t.title)})):a.map((function(e){return e.operations})).flat().filter((function(e){return!e.income})).sort((function(e,t){return e.title.localeCompare(t.title)})).filter((function(e){return e.title.toLowerCase().indexOf(t.toLowerCase())>-1})))}}),l.a.createElement(h.k,null,E,0===E.length&&l.a.createElement(h.i,null,"\u041d\u0435\u0442 \u0434\u0430\u043d\u043d\u044b\u0445 \u0434\u043b\u044f \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f")))},He=function(){var e,t=Object(h.L)(),a=le("/state"),o=Object(u.a)(a,2),c=o[0],r=c.response,i=c.isLoading,d=o[1],m=Object(n.useState)(!0),p=Object(u.a)(m,2),v=p[0],E=p[1],f=Object(n.useContext)(R),y=Object(u.a)(f,2),b=y[0],O=y[1];Object(n.useEffect)((function(){v&&(d({params:{date:new Date(b.currentDate)}}),E(!1))}),[v,d,b.currentDate]),Object(n.useEffect)((function(){r&&(O({type:"SET_ACCOUNTS",payload:{accounts:(null===r||void 0===r?void 0:r.accounts)?null===r||void 0===r?void 0:r.accounts:[]}}),O({type:"SET_BUDGETS",payload:{budgets:(null===r||void 0===r?void 0:r.budgets)?null===r||void 0===r?void 0:r.budgets:[]}}))}),[r,O]),Object(n.useEffect)((function(){window.onpopstate=function(e){if(0!==b.history.length)return O({type:"SET_HISTORY_BACK",payload:{state:e.state}})}}),[O,b.history]);var g=Object(n.useCallback)((function(){E(!0)}),[]),T=function(){O({type:"SET_MODAL",payload:{modal:null}})},j=l.a.createElement(h.r,{activeModal:b.modal,onClose:T},l.a.createElement(h.p,{id:"add-account",header:l.a.createElement(h.q,{left:t===h.a&&l.a.createElement(h.v,{onClick:T},l.a.createElement(ce.a,null)),right:l.a.createElement(h.v,{onClick:T},t===h.m?"\u0413\u043e\u0442\u043e\u0432\u043e":l.a.createElement(ie.a,null))},"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0441\u0447\u0435\u0442")},l.a.createElement(be,{onRefresh:g})),l.a.createElement(h.p,{id:"add-money",header:l.a.createElement(h.q,{left:t===h.a&&l.a.createElement(h.v,{onClick:T},l.a.createElement(ce.a,null)),right:l.a.createElement(h.v,{onClick:T},t===h.m?"\u0413\u043e\u0442\u043e\u0432\u043e":l.a.createElement(ie.a,null))},b.editedItem?"\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c":"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u043f\u0438\u0441\u044c")},l.a.createElement(ge,{accounts:b.accounts,id:null===(e=b.account)||void 0===e?void 0:e._id,editedItem:b.editedItem,onRefresh:g})),l.a.createElement(h.p,{id:"add-budget",header:l.a.createElement(h.q,{left:t===h.a&&l.a.createElement(h.v,{onClick:T},l.a.createElement(ce.a,null)),right:l.a.createElement(h.v,{onClick:T},t===h.m?"\u0413\u043e\u0442\u043e\u0432\u043e":l.a.createElement(ie.a,null))},"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0431\u044e\u0434\u0436\u0435\u0442")},l.a.createElement(Pe,{editedItem:b.budget,onRefresh:g,dispatch:O}))),S=function(e){O({type:"SET_ACTIVE_VIEW",payload:{view:e.currentTarget.dataset.story,panel:e.currentTarget.dataset.panel}})},C=l.a.createElement(h.G,null,l.a.createElement(h.H,{onClick:S,selected:"home"===b.activeView,"data-story":"home","data-panel":"home",text:"\u0411\u0430\u043b\u0430\u043d\u0441"},l.a.createElement(de.a,null)),l.a.createElement(h.H,{onClick:S,selected:"info"===b.activeView&&"budgets"===b.activePanel,"data-story":"info","data-panel":"budgets",text:"\u0411\u044e\u0434\u0436\u0435\u0442\u044b"},l.a.createElement(me.a,null)),l.a.createElement(h.H,{onClick:S,selected:"info"===b.activeView&&"stats"===b.activePanel,"data-story":"info","data-panel":"stats",text:"\u0421\u0432\u043e\u0434\u043a\u0430"},l.a.createElement(ve.a,null)));return l.a.createElement(h.h,{activeStory:b.activeView,tabbar:C},l.a.createElement(s.a,{id:"home",activePanel:b.activePanel,popout:b.popout,modal:j},l.a.createElement(Z,{id:"home",accounts:b.accounts,budgets:b.budgets,dispatch:O,isLoading:i,onRefresh:g,isFetching:i})),l.a.createElement(s.a,{id:"info",activePanel:b.activePanel,popout:b.popout,modal:j},l.a.createElement(ke,{id:"account",account:b.accounts.find((function(e){var t;return e._id===(null===(t=b.account)||void 0===t?void 0:t._id)})),dispatch:O,onRefresh:g}),l.a.createElement(Ne,{id:"budget",budget:b.budgets.find((function(e){var t;return e._id===(null===(t=b.budget)||void 0===t?void 0:t._id)})),dispatch:O,onRefresh:g}),l.a.createElement(Ie,{id:"budgets",budgets:b.budgets,dispatch:O,onRefresh:g,date:b.currentDate}),l.a.createElement(Ge,{id:"stats",accounts:b.accounts,onRefresh:g,dispatch:O})))};i.a.subscribe((function(e){var t=e.detail,a=t.type,n=t.data;if("VKWebAppUpdateConfig"===a){var l=document.createAttribute("scheme");l.value=n.scheme?n.scheme:"client_light",document.body.attributes.setNamedItem(l)}})),i.a.send("VKWebAppInit"),c.a.render(l.a.createElement(L,null,l.a.createElement(He,null)),document.getElementById("root"))}},[[206,1,2]]]);
//# sourceMappingURL=main.4471931e.chunk.js.map