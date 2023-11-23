import{u as V}from"./part-b9737e24.js";import{C as w,E as u,Q as k,m as t,G as a,R as C,H as d,M as h,P as B,F as m,S as T}from"./index-a61d92dd.js";import{_ as v,V as z,n as r,l as P}from"./scopeId-e67cf07f.js";import{V as p,a as A,b as f,c as s,d as S,e as o,f as D,g,h as F}from"./VTextField-8f75e674.js";import{V as Q}from"./VSpacer-09f545a6.js";const R=w({setup(){return{partStore:V()}},props:{id:Number,image:String,name:String,link:String,quantity:Number},data(){return{editing:{},showEditingDialog:!1}},methods:{editCard(){this.editing={id:this.$props.id,name:this.$props.name,image:this.$props.image,link:this.$props.link,quantity:this.$props.quantity},this.showEditingDialog=!0},deleteCard(){this.partStore.delete({id:this.$props.id})},saveCard(e){this.partStore.edit(e),this.editing={},this.showEditingDialog=!1},locate(){this.partStore.locate({name:this.$props.name,image:this.$props.image,link:this.$props.link,id:this.$props.id})}}});function j(e,l,$,b,y,N){return u(),k(h,null,[t(s,{cols:2},{default:a(()=>[t(p,null,{default:a(()=>[t(z,{src:e.$props.image,class:"align-end",gradient:"to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)",height:"200px",cover:""},{default:a(()=>[t(A,{class:"text-white",textContent:C(e.$props.name)},null,8,["textContent"])]),_:1},8,["src"]),t(f,null,{default:a(()=>[t(Q),t(r,{size:"small",color:"surface-variant",variant:"text",icon:"mdi-delete-forever",title:"Delete",onClick:l[0]||(l[0]=i=>e.deleteCard())}),t(r,{size:"small",color:"surface-variant",variant:"text",icon:"mdi-file-edit",title:"Edit",onClick:l[1]||(l[1]=i=>e.editCard())}),t(r,{size:"small",color:"surface-variant",variant:"text",icon:"mdi-lighthouse-on",title:"Locate",onClick:l[2]||(l[2]=i=>e.locate())})]),_:1})]),_:1})]),_:1}),t(D,{modelValue:e.showEditingDialog,"onUpdate:modelValue":l[9]||(l[9]=i=>e.showEditingDialog=i),width:"1024"},{default:a(()=>[t(p,null,{title:a(()=>[d(" Editing ID: "+C(e.editing.id),1)]),default:a(()=>[t(S,null,{default:a(()=>[t(o,{modelValue:e.editing.name,"onUpdate:modelValue":l[3]||(l[3]=i=>e.editing.name=i),label:"Name"},null,8,["modelValue"]),t(o,{modelValue:e.editing.link,"onUpdate:modelValue":l[4]||(l[4]=i=>e.editing.link=i),label:"Link"},null,8,["modelValue"]),t(o,{modelValue:e.editing.image,"onUpdate:modelValue":l[5]||(l[5]=i=>e.editing.image=i),label:"Image"},null,8,["modelValue"]),t(o,{modelValue:e.editing.quantity,"onUpdate:modelValue":l[6]||(l[6]=i=>e.editing.quantity=i),label:"Quantity"},null,8,["modelValue"])]),_:1}),t(f,null,{default:a(()=>[t(s,{cols:"2",offset:"8","align-self":"start"},{default:a(()=>[t(r,{color:"primary",onClick:l[7]||(l[7]=i=>e.showEditingDialog=!1)},{default:a(()=>[d("Close Dialog")]),_:1})]),_:1}),t(s,{cols:"2","align-self":"end"},{default:a(()=>[t(r,{"prepend-icon":"mdi-check-circle",onClick:l[8]||(l[8]=i=>e.saveCard(e.editing))},{prepend:a(()=>[t(P,{color:"success"})]),default:a(()=>[d("Save ")]),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])],64)}const G=v(R,[["render",j]]),H=w({setup(){return{partStore:V()}},components:{Part:G},data(){return{newPart:{},showNewDialog:!1,search:""}},mounted(){this.partStore.itemList.length||this.partStore.find()},methods:{savePart(e){this.partStore.createPart(e),this.newPart={},this.showNewDialog=!1}},computed:{filteredParts(){return this.partStore.itemList.filter(e=>this.search?e.name.toLocaleLowerCase().includes(this.search):!0)}}});function M(e,l,$,b,y,N){const i=B("part");return u(),m(F,{class:"fill-height"},{default:a(()=>[t(g,{class:"d-flex align-center justify-center"},{default:a(()=>[t(s,{cols:"10"},{default:a(()=>[t(o,{label:"Search Parts",modelValue:e.search,"onUpdate:modelValue":l[0]||(l[0]=n=>e.search=n)},null,8,["modelValue"])]),_:1}),t(s,{cols:"2"},{default:a(()=>[t(r,{onClick:l[1]||(l[1]=n=>e.showNewDialog=!0)},{default:a(()=>[d("Add Item")]),_:1})]),_:1}),t(g,{dense:""},{default:a(()=>[(u(!0),k(h,null,T(e.filteredParts,({name:n,link:U,image:E,quantity:L,id:q},I)=>(u(),m(i,{quantity:L,id:q,name:n,key:I,link:U,image:E},null,8,["quantity","id","name","link","image"]))),128))]),_:1})]),_:1}),t(D,{modelValue:e.showNewDialog,"onUpdate:modelValue":l[8]||(l[8]=n=>e.showNewDialog=n),width:"1024"},{default:a(()=>[t(p,null,{title:a(()=>[d(" Add Part ")]),default:a(()=>[t(S,null,{default:a(()=>[t(o,{modelValue:e.newPart.name,"onUpdate:modelValue":l[2]||(l[2]=n=>e.newPart.name=n),label:"Name"},null,8,["modelValue"]),t(o,{modelValue:e.newPart.link,"onUpdate:modelValue":l[3]||(l[3]=n=>e.newPart.link=n),label:"Link"},null,8,["modelValue"]),t(o,{modelValue:e.newPart.image,"onUpdate:modelValue":l[4]||(l[4]=n=>e.newPart.image=n),label:"Image"},null,8,["modelValue"]),t(o,{modelValue:e.newPart.quantity,"onUpdate:modelValue":l[5]||(l[5]=n=>e.newPart.quantity=n),label:"Quantity"},null,8,["modelValue"])]),_:1}),t(f,null,{default:a(()=>[t(s,{cols:"2",offset:"8","align-self":"start"},{default:a(()=>[t(r,{color:"primary",onClick:l[6]||(l[6]=n=>e.showNewDialog=!1)},{default:a(()=>[d("Close Dialog")]),_:1})]),_:1}),t(s,{cols:"2","align-self":"end"},{default:a(()=>[t(r,{"prepend-icon":"mdi-check-circle",onClick:l[7]||(l[7]=n=>e.savePart(e.newPart))},{prepend:a(()=>[t(P,{color:"success"})]),default:a(()=>[d("Save ")]),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})}const J=v(H,[["render",M]]),Z=w({__name:"Parts",setup(e){return V(),(l,$)=>(u(),m(g,null,{default:a(()=>[t(s,null,{default:a(()=>[t(J)]),_:1})]),_:1}))}});export{Z as default};
