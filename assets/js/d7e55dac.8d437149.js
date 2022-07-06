"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[961],{3905:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return d}});var r=t(7294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var u=r.createContext({}),c=function(e){var n=r.useContext(u),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},p=function(e){var n=c(e.components);return r.createElement(u.Provider,{value:n},e.children)},s={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,u=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),m=c(t),d=i,v=m["".concat(u,".").concat(d)]||m[d]||s[d]||o;return t?r.createElement(v,a(a({ref:n},p),{},{components:t})):r.createElement(v,a({ref:n},p))}));function d(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,a=new Array(o);a[0]=m;var l={};for(var u in n)hasOwnProperty.call(n,u)&&(l[u]=n[u]);l.originalType=e,l.mdxType="string"==typeof e?e:i,a[1]=l;for(var c=2;c<o;c++)a[c]=t[c];return r.createElement.apply(null,a)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},6929:function(e,n,t){t.r(n),t.d(n,{assets:function(){return p},contentTitle:function(){return u},default:function(){return d},frontMatter:function(){return l},metadata:function(){return c},toc:function(){return s}});var r=t(3117),i=t(102),o=(t(7294),t(3905)),a=["components"],l={sidebar_position:5},u="Using a Python virtual env on the host machine",c={unversionedId:"development/using-virtual-environment",id:"development/using-virtual-environment",title:"Using a Python virtual env on the host machine",description:"Use a virtual environment:",source:"@site/docs/development/using-virtual-environment.md",sourceDirName:"development",slug:"/development/using-virtual-environment",permalink:"/buho-stocks/docs/development/using-virtual-environment",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/development/using-virtual-environment.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Using Docker and VSCode for development",permalink:"/buho-stocks/docs/development/using-docker-vscode"},next:{title:"Other Docker commands",permalink:"/buho-stocks/docs/development/other-docker-commands"}},p={},s=[{value:"Update the config files and put them in the volumes",id:"update-the-config-files-and-put-them-in-the-volumes",level:2},{value:"Running the initial migrations",id:"running-the-initial-migrations",level:2},{value:"Running the application",id:"running-the-application",level:2}],m={toc:s};function d(e){var n=e.components,t=(0,i.Z)(e,a);return(0,o.kt)("wrapper",(0,r.Z)({},m,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"using-a-python-virtual-env-on-the-host-machine"},"Using a Python virtual env on the host machine"),(0,o.kt)("p",null,"Use a virtual environment:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"python3 -m venv env\nsource env/bin/activate\n")),(0,o.kt)("h2",{id:"update-the-config-files-and-put-them-in-the-volumes"},"Update the config files and put them in the volumes"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"backend/config/config.sample.py"),": Application's configuration."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"backend/config/mysql.conf"),": Database configuration")),(0,o.kt)("h2",{id:"running-the-initial-migrations"},"Running the initial migrations"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"cd backend\npython manage.py migrate\n")),(0,o.kt)("h2",{id:"running-the-application"},"Running the application"),(0,o.kt)("p",null,"Backend:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"cd backend\npython manage.py 0.0.0.0:8001\n")),(0,o.kt)("p",null,"Frontend:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"cd client\nyarn start\n")))}d.isMDXComponent=!0}}]);