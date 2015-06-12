
 /**//*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */

window.matchMedia = window.matchMedia || (function(doc, undefined){

    var docElem  = doc.documentElement,
        refNode  = docElem.firstElementChild || docElem.firstChild,
    // fakeBody required for <FF4 when executed in <head>
        fakeBody = doc.createElement('body'),
        div      = doc.createElement('div');

    div.id = 'mq-test-1';
    div.style.cssText = "position:absolute;top:-100em";
    fakeBody.style.background = "none";
    fakeBody.appendChild(div);

    var mqRun = function ( mq ) {
            div.innerHTML = '&shy;<style media="' + mq + '"> #mq-test-1 { width: 42px; }</style>';
            docElem.insertBefore( fakeBody, refNode );
            bool = div.offsetWidth === 42;
            docElem.removeChild( fakeBody );

            return { matches: bool, media: mq };
        },

        getEmValue = function () {
            var ret,
                body = docElem.body,
                fakeUsed = false;

            div.style.cssText = "position:absolute;font-size:1em;width:1em";

            if( !body ) {
                body = fakeUsed = doc.createElement( "body" );
                body.style.background = "none";
            }

            body.appendChild( div );

            docElem.insertBefore( body, docElem.firstChild );

            if( fakeUsed ) {
                docElem.removeChild( body );
            } else {
                body.removeChild( div );
            }

            //also update eminpx before returning
            ret = eminpx = parseFloat( div.offsetWidth );

            return ret;
        },

    //cached container for 1em value, populated the first time it's needed
        eminpx,

    // verify that we have support for a simple media query
        mqSupport = mqRun( '(min-width: 0px)' ).matches;

    return function ( mq ) {
        if( mqSupport ) {
            return mqRun( mq );
        } else {
            var min = mq.match( /\(min\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/ ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" ),
                max = mq.match( /\(max\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/ ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" ),
                minnull = min === null,
                maxnull = max === null,
                currWidth = doc.body.offsetWidth,
                em = 'em';

            if( !!min ) { min = parseFloat( min ) * ( min.indexOf( em ) > -1 ? ( eminpx || getEmValue() ) : 1 ); }
            if( !!max ) { max = parseFloat( max ) * ( max.indexOf( em ) > -1 ? ( eminpx || getEmValue() ) : 1 ); }

            bool = ( !minnull || !maxnull ) && ( minnull || currWidth >= min ) && ( maxnull || currWidth <= max );

            return { matches: bool, media: mq };
        }
    };

}( document ));
 /**//*! Respond.js v1.3.0: min/max-width media query polyfill. (c) Scott Jehl. MIT/GPLv2 Lic. j.mp/respondjs  */
(function(a){"use strict";function x(){u(!0)}var b={};if(a.respond=b,b.update=function(){},b.mediaQueriesSupported=a.matchMedia&&a.matchMedia("only all").matches,!b.mediaQueriesSupported){var q,r,t,c=a.document,d=c.documentElement,e=[],f=[],g=[],h={},i=30,j=c.getElementsByTagName("head")[0]||d,k=c.getElementsByTagName("base")[0],l=j.getElementsByTagName("link"),m=[],n=function(){for(var b=0;l.length>b;b++){var c=l[b],d=c.href,e=c.media,f=c.rel&&"stylesheet"===c.rel.toLowerCase();d&&f&&!h[d]&&(c.styleSheet&&c.styleSheet.rawCssText?(p(c.styleSheet.rawCssText,d,e),h[d]=!0):(!/^([a-zA-Z:]*\/\/)/.test(d)&&!k||d.replace(RegExp.$1,"").split("/")[0]===a.location.host)&&m.push({href:d,media:e}))}o()},o=function(){if(m.length){var b=m.shift();v(b.href,function(c){p(c,b.href,b.media),h[b.href]=!0,a.setTimeout(function(){o()},0)})}},p=function(a,b,c){var d=a.match(/@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi),g=d&&d.length||0;b=b.substring(0,b.lastIndexOf("/"));var h=function(a){return a.replace(/(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,"$1"+b+"$2$3")},i=!g&&c;b.length&&(b+="/"),i&&(g=1);for(var j=0;g>j;j++){var k,l,m,n;i?(k=c,f.push(h(a))):(k=d[j].match(/@media *([^\{]+)\{([\S\s]+?)$/)&&RegExp.$1,f.push(RegExp.$2&&h(RegExp.$2))),m=k.split(","),n=m.length;for(var o=0;n>o;o++)l=m[o],e.push({media:l.split("(")[0].match(/(only\s+)?([a-zA-Z]+)\s?/)&&RegExp.$2||"all",rules:f.length-1,hasquery:l.indexOf("(")>-1,minw:l.match(/\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/)&&parseFloat(RegExp.$1)+(RegExp.$2||""),maxw:l.match(/\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/)&&parseFloat(RegExp.$1)+(RegExp.$2||"")})}u()},s=function(){var a,b=c.createElement("div"),e=c.body,f=!1;return b.style.cssText="position:absolute;font-size:1em;width:1em",e||(e=f=c.createElement("body"),e.style.background="none"),e.appendChild(b),d.insertBefore(e,d.firstChild),a=b.offsetWidth,f?d.removeChild(e):e.removeChild(b),a=t=parseFloat(a)},u=function(b){var h="clientWidth",k=d[h],m="CSS1Compat"===c.compatMode&&k||c.body[h]||k,n={},o=l[l.length-1],p=(new Date).getTime();if(b&&q&&i>p-q)return a.clearTimeout(r),r=a.setTimeout(u,i),void 0;q=p;for(var v in e)if(e.hasOwnProperty(v)){var w=e[v],x=w.minw,y=w.maxw,z=null===x,A=null===y,B="em";x&&(x=parseFloat(x)*(x.indexOf(B)>-1?t||s():1)),y&&(y=parseFloat(y)*(y.indexOf(B)>-1?t||s():1)),w.hasquery&&(z&&A||!(z||m>=x)||!(A||y>=m))||(n[w.media]||(n[w.media]=[]),n[w.media].push(f[w.rules]))}for(var C in g)g.hasOwnProperty(C)&&g[C]&&g[C].parentNode===j&&j.removeChild(g[C]);for(var D in n)if(n.hasOwnProperty(D)){var E=c.createElement("style"),F=n[D].join("\n");E.type="text/css",E.media=D,j.insertBefore(E,o.nextSibling),E.styleSheet?E.styleSheet.cssText=F:E.appendChild(c.createTextNode(F)),g.push(E)}},v=function(a,b){var c=w();c&&(c.open("GET",a,!0),c.onreadystatechange=function(){4!==c.readyState||200!==c.status&&304!==c.status||b(c.responseText)},4!==c.readyState&&c.send(null))},w=function(){var b=!1;try{b=new a.XMLHttpRequest}catch(c){b=new a.ActiveXObject("Microsoft.XMLHTTP")}return function(){return b}}();n(),b.update=n,a.addEventListener?a.addEventListener("resize",x,!1):a.attachEvent&&a.attachEvent("onresize",x)}})(this);

 /**//**
 * @license
 * Lo-Dash 2.2.1 (Custom Build) lodash.com/license | Underscore.js 1.5.2 underscorejs.org/LICENSE
 * Build: `lodash -o ./dist/lodash.compat.js`
 */
;(function(){function n(n,t,e){e=(e||0)-1;for(var r=n?n.length:0;++e<r;)if(n[e]===t)return e;return-1}function t(t,e){var r=typeof e;if(t=t.l,"boolean"==r||null==e)return t[e]?0:-1;"number"!=r&&"string"!=r&&(r="object");var u="number"==r?e:b+e;return t=(t=t[r])&&t[u],"object"==r?t&&-1<n(t,e)?0:-1:t?0:-1}function e(n){var t=this.l,e=typeof n;if("boolean"==e||null==n)t[n]=!0;else{"number"!=e&&"string"!=e&&(e="object");var r="number"==e?n:b+n,t=t[e]||(t[e]={});"object"==e?(t[r]||(t[r]=[])).push(n):t[r]=!0
}}function r(n){return n.charCodeAt(0)}function u(n,t){var e=n.m,r=t.m;if(e!==r){if(e>r||typeof e=="undefined")return 1;if(e<r||typeof r=="undefined")return-1}return n.n-t.n}function o(n){var t=-1,r=n.length,u=n[0],o=n[0|r/2],a=n[r-1];if(u&&typeof u=="object"&&o&&typeof o=="object"&&a&&typeof a=="object")return!1;for(u=l(),u["false"]=u["null"]=u["true"]=u.undefined=!1,o=l(),o.k=n,o.l=u,o.push=e;++t<r;)o.push(n[t]);return o}function a(n){return"\\"+Z[n]}function i(){return y.pop()||[]}function l(){return m.pop()||{k:null,l:null,m:null,"false":!1,n:0,"null":!1,number:null,object:null,push:null,string:null,"true":!1,undefined:!1,o:null}
}function f(n){return typeof n.toString!="function"&&typeof(n+"")=="string"}function c(){}function p(n){n.length=0,y.length<j&&y.push(n)}function s(n){var t=n.l;t&&s(t),n.k=n.l=n.m=n.object=n.number=n.string=n.o=null,m.length<j&&m.push(n)}function g(n,t,e){t||(t=0),typeof e=="undefined"&&(e=n?n.length:0);var r=-1;e=e-t||0;for(var u=Array(0>e?0:e);++r<e;)u[r]=n[t+r];return u}function h(e){function y(n){return n&&typeof n=="object"&&!Je(n)&&de.call(n,"__wrapped__")?n:new m(n)}function m(n,t){this.__chain__=!!t,this.__wrapped__=n
}function j(n,t,e,r,u){if(e){var o=e(n);if(typeof o!="undefined")return o}if(!bt(n))return n;var a=ke.call(n);if(!U[a]||!We.nodeClass&&f(n))return n;var l=qe[a];switch(a){case z:case q:return new l(+n);case G:case H:return new l(n);case M:return o=l(n.source,I.exec(n)),o.lastIndex=n.lastIndex,o}if(a=Je(n),t){var c=!r;r||(r=i()),u||(u=i());for(var s=r.length;s--;)if(r[s]==n)return u[s];o=a?l(n.length):{}}else o=a?g(n):er({},n);return a&&(de.call(n,"index")&&(o.index=n.index),de.call(n,"input")&&(o.input=n.input)),t?(r.push(n),u.push(o),(a?tr:or)(n,function(n,a){o[a]=j(n,t,e,r,u)
}),c&&(p(r),p(u)),o):o}function Z(n,t,e){if(typeof n!="function")return Ht;if(typeof t=="undefined")return n;var r=n.__bindData__||We.funcNames&&!n.name;if(typeof r=="undefined"){var u=P&&ye.call(n);We.funcNames||!u||A.test(u)||(r=!0),(We.funcNames||!r)&&(r=!We.funcDecomp||P.test(u),Ge(n,r))}if(true!==r&&r&&1&r[1])return n;switch(e){case 1:return function(e){return n.call(t,e)};case 2:return function(e,r){return n.call(t,e,r)};case 3:return function(e,r,u){return n.call(t,e,r,u)};case 4:return function(e,r,u,o){return n.call(t,e,r,u,o)
}}return Gt(n,t)}function tt(n,t,e,r){r=(r||0)-1;for(var u=n?n.length:0,o=[];++r<u;){var a=n[r];if(a&&typeof a=="object"&&typeof a.length=="number"&&(Je(a)||vt(a))){t||(a=tt(a,t,e));var i=-1,l=a.length,f=o.length;for(o.length+=l;++i<l;)o[f++]=a[i]}else e||o.push(a)}return o}function et(n,t,e,r,u,o){if(e){var a=e(n,t);if(typeof a!="undefined")return!!a}if(n===t)return 0!==n||1/n==1/t;if(n===n&&!(n&&Y[typeof n]||t&&Y[typeof t]))return!1;if(null==n||null==t)return n===t;var l=ke.call(n),c=ke.call(t);
    if(l==L&&(l=J),c==L&&(c=J),l!=c)return!1;switch(l){case z:case q:return+n==+t;case G:return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case M:case H:return n==oe(t)}if(c=l==T,!c){if(de.call(n,"__wrapped__")||de.call(t,"__wrapped__"))return et(n.__wrapped__||n,t.__wrapped__||t,e,r,u,o);if(l!=J||!We.nodeClass&&(f(n)||f(t)))return!1;var l=!We.argsObject&&vt(n)?re:n.constructor,s=!We.argsObject&&vt(t)?re:t.constructor;if(l!=s&&!(_t(l)&&l instanceof l&&_t(s)&&s instanceof s))return!1}for(s=!u,u||(u=i()),o||(o=i()),l=u.length;l--;)if(u[l]==n)return o[l]==t;
    var g=0,a=!0;if(u.push(n),o.push(t),c){if(l=n.length,g=t.length,a=g==n.length,!a&&!r)return a;for(;g--;)if(c=l,s=t[g],r)for(;c--&&!(a=et(n[c],s,e,r,u,o)););else if(!(a=et(n[g],s,e,r,u,o)))break;return a}return ur(t,function(t,i,l){return de.call(l,i)?(g++,a=de.call(n,i)&&et(n[i],t,e,r,u,o)):void 0}),a&&!r&&ur(n,function(n,t,e){return de.call(e,t)?a=-1<--g:void 0}),s&&(p(u),p(o)),a}function ut(n,t,e,r,u){(Je(t)?St:or)(t,function(t,o){var a,i,l=t,f=n[o];if(t&&((i=Je(t))||ar(t))){for(l=r.length;l--;)if(a=r[l]==t){f=u[l];
    break}if(!a){var c;e&&(l=e(f,t),c=typeof l!="undefined")&&(f=l),c||(f=i?Je(f)?f:[]:ar(f)?f:{}),r.push(t),u.push(f),c||ut(f,t,e,r,u)}}else e&&(l=e(f,t),typeof l=="undefined"&&(l=t)),typeof l!="undefined"&&(f=l);n[o]=f})}function at(e,r,u){var a=-1,l=st(),f=e?e.length:0,c=[],g=!r&&f>=w&&l===n,h=u||g?i():c;if(g){var v=o(h);v?(l=t,h=v):(g=!1,h=u?h:(p(h),c))}for(;++a<f;){var v=e[a],y=u?u(v,a,e):v;(r?!a||h[h.length-1]!==y:0>l(h,y))&&((u||g)&&h.push(y),c.push(v))}return g?(p(h.k),s(h)):u&&p(h),c}function it(n){return function(t,e,r){var u={};
    if(e=y.createCallback(e,r,3),Je(t)){r=-1;for(var o=t.length;++r<o;){var a=t[r];n(u,a,e(a,r,t),t)}}else tr(t,function(t,r,o){n(u,t,e(t,r,o),o)});return u}}function lt(n,t,e,r,u,o){var a=1&t,i=2&t,l=4&t,f=8&t,c=16&t,p=32&t,s=n;if(!i&&!_t(n))throw new ae;c&&!e.length&&(t&=-17,c=e=!1),p&&!r.length&&(t&=-33,p=r=!1);var g=n&&n.__bindData__;if(g)return!a||1&g[1]||(g[4]=u),!a&&1&g[1]&&(t|=8),!l||4&g[1]||(g[5]=o),c&&be.apply(g[2]||(g[2]=[]),e),p&&be.apply(g[3]||(g[3]=[]),r),g[1]|=t,lt.apply(null,g);if(!a||i||l||p||!(We.fastBind||Se&&c))v=function(){var g=arguments,h=a?u:this;
    return(l||c||p)&&(g=Le.call(g),c&&Ee.apply(g,e),p&&be.apply(g,r),l&&g.length<o)?(t|=16,lt(n,f?t:-4&t,g,null,u,o)):(i&&(n=h[s]),this instanceof v?(h=ct(n.prototype),g=n.apply(h,g),bt(g)?g:h):n.apply(h,g))};else{if(c){var h=[u];be.apply(h,e)}var v=c?Se.apply(n,h):Se.call(n,u)}return Ge(v,Le.call(arguments)),v}function ft(){X.h=$,X.b=X.c=X.g=X.i="",X.e="t",X.j=!0;for(var n,t=0;n=arguments[t];t++)for(var e in n)X[e]=n[e];t=X.a,X.d=/^[^,]+/.exec(t)[0],n=ne,t="return function("+t+"){",e=X;var r="var n,t="+e.d+",E="+e.e+";if(!t)return E;"+e.i+";";
    e.b?(r+="var u=t.length;n=-1;if("+e.b+"){",We.unindexedChars&&(r+="if(s(t)){t=t.split('')}"),r+="while(++n<u){"+e.g+";}}else{"):We.nonEnumArgs&&(r+="var u=t.length;n=-1;if(u&&p(t)){while(++n<u){n+='';"+e.g+";}}else{"),We.enumPrototypes&&(r+="var G=typeof t=='function';"),We.enumErrorProps&&(r+="var F=t===k||t instanceof Error;");var u=[];if(We.enumPrototypes&&u.push('!(G&&n=="prototype")'),We.enumErrorProps&&u.push('!(F&&(n=="message"||n=="name"))'),e.j&&e.f)r+="var C=-1,D=B[typeof t]&&v(t),u=D?D.length:0;while(++C<u){n=D[C];",u.length&&(r+="if("+u.join("&&")+"){"),r+=e.g+";",u.length&&(r+="}"),r+="}";
    else if(r+="for(n in t){",e.j&&u.push("m.call(t, n)"),u.length&&(r+="if("+u.join("&&")+"){"),r+=e.g+";",u.length&&(r+="}"),r+="}",We.nonEnumShadows){for(r+="if(t!==A){var i=t.constructor,r=t===(i&&i.prototype),f=t===J?I:t===k?j:L.call(t),x=y[f];",k=0;7>k;k++)r+="n='"+e.h[k]+"';if((!(r&&x[n])&&m.call(t,n))",e.j||(r+="||(!x[n]&&t[n]!==A[n])"),r+="){"+e.g+"}";r+="}"}return(e.b||We.nonEnumArgs)&&(r+="}"),r+=e.c+";return E",n("d,j,k,m,o,p,q,s,v,A,B,y,I,J,L",t+r+"}")(Z,K,le,de,_,vt,Je,jt,X.f,fe,Y,Ke,H,ce,ke)
}function ct(n){return bt(n)?Ie(n):{}}function pt(n){return Xe[n]}function st(){var t=(t=y.indexOf)===Lt?n:t;return t}function gt(n){var t,e;return!n||ke.call(n)!=J||(t=n.constructor,_t(t)&&!(t instanceof t))||!We.argsClass&&vt(n)||!We.nodeClass&&f(n)?!1:We.ownLast?(ur(n,function(n,t,r){return e=de.call(r,t),!1}),false!==e):(ur(n,function(n,t){e=t}),typeof e=="undefined"||de.call(n,e))}function ht(n){return Ye[n]}function vt(n){return n&&typeof n=="object"&&typeof n.length=="number"&&ke.call(n)==L||!1
}function yt(n,t,e){var r=He(n),u=r.length;for(t=Z(t,e,3);u--&&(e=r[u],false!==t(n[e],e,n)););return n}function mt(n){var t=[];return ur(n,function(n,e){_t(n)&&t.push(e)}),t.sort()}function dt(n){for(var t=-1,e=He(n),r=e.length,u={};++t<r;){var o=e[t];u[n[o]]=o}return u}function _t(n){return typeof n=="function"}function bt(n){return!(!n||!Y[typeof n])}function wt(n){return typeof n=="number"||ke.call(n)==G}function jt(n){return typeof n=="string"||ke.call(n)==H}function xt(n){for(var t=-1,e=He(n),r=e.length,u=Xt(r);++t<r;)u[t]=n[e[t]];
    return u}function Ct(n,t,e){var r=-1,u=st(),o=n?n.length:0,a=!1;return e=(0>e?Pe(0,o+e):e)||0,Je(n)?a=-1<u(n,t,e):typeof o=="number"?a=-1<(jt(n)?n.indexOf(t,e):u(n,t,e)):tr(n,function(n){return++r<e?void 0:!(a=n===t)}),a}function kt(n,t,e){var r=!0;if(t=y.createCallback(t,e,3),Je(n)){e=-1;for(var u=n.length;++e<u&&(r=!!t(n[e],e,n)););}else tr(n,function(n,e,u){return r=!!t(n,e,u)});return r}function Et(n,t,e){var r=[];if(t=y.createCallback(t,e,3),Je(n)){e=-1;for(var u=n.length;++e<u;){var o=n[e];
    t(o,e,n)&&r.push(o)}}else tr(n,function(n,e,u){t(n,e,u)&&r.push(n)});return r}function Ot(n,t,e){if(t=y.createCallback(t,e,3),!Je(n)){var r;return tr(n,function(n,e,u){return t(n,e,u)?(r=n,!1):void 0}),r}e=-1;for(var u=n.length;++e<u;){var o=n[e];if(t(o,e,n))return o}}function St(n,t,e){if(t&&typeof e=="undefined"&&Je(n)){e=-1;for(var r=n.length;++e<r&&false!==t(n[e],e,n););}else tr(n,t,e);return n}function It(n,t,e){var r=n,u=n?n.length:0;if(t=t&&typeof e=="undefined"?t:Z(t,e,3),Je(n))for(;u--&&false!==t(n[u],u,n););else{if(typeof u!="number")var o=He(n),u=o.length;
else We.unindexedChars&&jt(n)&&(r=n.split(""));tr(n,function(n,e,a){return e=o?o[--u]:--u,t(r[e],e,a)})}return n}function At(n,t,e){var r=-1,u=n?n.length:0,o=Xt(typeof u=="number"?u:0);if(t=y.createCallback(t,e,3),Je(n))for(;++r<u;)o[r]=t(n[r],r,n);else tr(n,function(n,e,u){o[++r]=t(n,e,u)});return o}function Nt(n,t,e){var u=-1/0,o=u;if(!t&&Je(n)){e=-1;for(var a=n.length;++e<a;){var i=n[e];i>o&&(o=i)}}else t=!t&&jt(n)?r:y.createCallback(t,e,3),tr(n,function(n,e,r){e=t(n,e,r),e>u&&(u=e,o=n)});return o
}function Bt(n,t,e,r){var u=3>arguments.length;if(t=Z(t,r,4),Je(n)){var o=-1,a=n.length;for(u&&(e=n[++o]);++o<a;)e=t(e,n[o],o,n)}else tr(n,function(n,r,o){e=u?(u=!1,n):t(e,n,r,o)});return e}function Dt(n,t,e,r){var u=3>arguments.length;return t=Z(t,r,4),It(n,function(n,r,o){e=u?(u=!1,n):t(e,n,r,o)}),e}function Pt(n){var t=-1,e=n?n.length:0,r=Xt(typeof e=="number"?e:0);return St(n,function(n){var e=Vt(++t);r[t]=r[e],r[e]=n}),r}function Rt(n,t,e){var r;if(t=y.createCallback(t,e,3),Je(n)){e=-1;for(var u=n.length;++e<u&&!(r=t(n[e],e,n)););}else tr(n,function(n,e,u){return!(r=t(n,e,u))
});return!!r}function Ft(e){var r=-1,u=st(),a=e?e.length:0,i=tt(arguments,!0,!0,1),l=[],f=a>=w&&u===n;if(f){var c=o(i);c?(u=t,i=c):f=!1}for(;++r<a;)c=e[r],0>u(i,c)&&l.push(c);return f&&s(i),l}function $t(n,t,e){var r=0,u=n?n.length:0;if(typeof t!="number"&&null!=t){var o=-1;for(t=y.createCallback(t,e,3);++o<u&&t(n[o],o,n);)r++}else if(r=t,null==r||e)return n?n[0]:v;return g(n,0,Re(Pe(0,r),u))}function Lt(t,e,r){if(typeof r=="number"){var u=t?t.length:0;r=0>r?Pe(0,u+r):r||0}else if(r)return r=zt(t,e),t[r]===e?r:-1;
    return n(t,e,r)}function Tt(n,t,e){if(typeof t!="number"&&null!=t){var r=0,u=-1,o=n?n.length:0;for(t=y.createCallback(t,e,3);++u<o&&t(n[u],u,n);)r++}else r=null==t||e?1:Pe(0,t);return g(n,r)}function zt(n,t,e,r){var u=0,o=n?n.length:u;for(e=e?y.createCallback(e,r,1):Ht,t=e(t);u<o;)r=u+o>>>1,e(n[r])<t?u=r+1:o=r;return u}function qt(n,t,e,r){return typeof t!="boolean"&&null!=t&&(e=(r=e)&&r[t]===n?null:t,t=!1),null!=e&&(e=y.createCallback(e,r,3)),at(n,t,e)}function Kt(){for(var n=1<arguments.length?arguments:arguments[0],t=-1,e=n?Nt(cr(n,"length")):0,r=Xt(0>e?0:e);++t<e;)r[t]=cr(n,t);
    return r}function Wt(n,t){for(var e=-1,r=n?n.length:0,u={};++e<r;){var o=n[e];t?u[o]=t[e]:o&&(u[o[0]]=o[1])}return u}function Gt(n,t){return 2<arguments.length?lt(n,17,Le.call(arguments,2),null,t):lt(n,1,null,null,t)}function Jt(n,t,e){function r(){c&&he(c),a=c=p=v,(h||g!==t)&&(s=_e(),i=n.apply(f,o))}function u(){var e=t-(_e()-l);0<e?c=xe(u,e):(a&&he(a),e=p,a=c=p=v,e&&(s=_e(),i=n.apply(f,o)))}var o,a,i,l,f,c,p,s=0,g=!1,h=!0;if(!_t(n))throw new ae;if(t=Pe(0,t)||0,true===e)var y=!0,h=!1;else bt(e)&&(y=e.leading,g="maxWait"in e&&(Pe(t,e.maxWait)||0),h="trailing"in e?e.trailing:h);
    return function(){if(o=arguments,l=_e(),f=this,p=h&&(c||!y),false===g)var e=y&&!c;else{a||y||(s=l);var v=g-(l-s);0<v?a||(a=xe(r,v)):(a&&(a=he(a)),s=l,i=n.apply(f,o))}return c||t===g||(c=xe(u,t)),e&&(i=n.apply(f,o)),i}}function Mt(n){if(!_t(n))throw new ae;var t=Le.call(arguments,1);return xe(function(){n.apply(v,t)},1)}function Ht(n){return n}function Ut(n,t){var e=n,r=!t||_t(e);t||(e=m,t=n,n=y),St(mt(t),function(u){var o=n[u]=t[u];r&&(e.prototype[u]=function(){var t=this.__wrapped__,r=[t];return be.apply(r,arguments),r=o.apply(n,r),t&&typeof t=="object"&&t===r?this:(r=new e(r),r.__chain__=this.__chain__,r)
})})}function Vt(n,t,e){var r=null==n,u=null==t;return null==e&&(typeof n=="boolean"&&u?(e=n,n=1):u||typeof t!="boolean"||(e=t,u=!0)),r&&u&&(t=1),n=+n||0,u?(t=n,n=0):t=+t||0,r=$e(),e||n%1||t%1?Re(n+r*(t-n+parseFloat("1e-"+((r+"").length-1))),t):n+ve(r*(t-n+1))}function Qt(){return this.__wrapped__}e=e?ot.defaults(nt.Object(),e,ot.pick(nt,F)):nt;var Xt=e.Array,Yt=e.Boolean,Zt=e.Date,ne=e.Function,te=e.Math,ee=e.Number,re=e.Object,ue=e.RegExp,oe=e.String,ae=e.TypeError,ie=[],le=e.Error.prototype,fe=re.prototype,ce=oe.prototype,pe=e._,se=ue("^"+oe(fe.valueOf).replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/valueOf|for [^\]]+/g,".+?")+"$"),ge=te.ceil,he=e.clearTimeout,ve=te.floor,ye=ne.prototype.toString,me=se.test(me=re.getPrototypeOf)&&me,de=fe.hasOwnProperty,_e=se.test(_e=Zt.now)&&_e||function(){return+new Zt
},be=ie.push,we=fe.propertyIsEnumerable,je=e.setImmediate,xe=e.setTimeout,Ce=ie.splice,ke=fe.toString,Ee=ie.unshift,Oe=function(){try{var n={},t=se.test(t=re.defineProperty)&&t,e=t(n,n,n)&&t}catch(r){}return e}(),Se=se.test(Se=ke.bind)&&Se,Ie=se.test(Ie=re.create)&&Ie,Ae=se.test(Ae=Xt.isArray)&&Ae,Ne=e.isFinite,Be=e.isNaN,De=se.test(De=re.keys)&&De,Pe=te.max,Re=te.min,Fe=e.parseInt,$e=te.random,Le=ie.slice,Te=se.test(e.attachEvent),ze=Se&&!/\n|true/.test(Se+Te),qe={};qe[T]=Xt,qe[z]=Yt,qe[q]=Zt,qe[W]=ne,qe[J]=re,qe[G]=ee,qe[M]=ue,qe[H]=oe;
    var Ke={};Ke[T]=Ke[q]=Ke[G]={constructor:!0,toLocaleString:!0,toString:!0,valueOf:!0},Ke[z]=Ke[H]={constructor:!0,toString:!0,valueOf:!0},Ke[K]=Ke[W]=Ke[M]={constructor:!0,toString:!0},Ke[J]={constructor:!0},function(){for(var n=$.length;n--;){var t,e=$[n];for(t in Ke)de.call(Ke,t)&&!de.call(Ke[t],e)&&(Ke[t][e]=!1)}}(),m.prototype=y.prototype;var We=y.support={};!function(){function n(){this.x=1}var t={0:1,length:1},r=[];n.prototype={valueOf:1};for(var u in new n)r.push(u);for(u in arguments);We.argsClass=ke.call(arguments)==L,We.argsObject=arguments.constructor==re&&!(arguments instanceof Xt),We.enumErrorProps=we.call(le,"message")||we.call(le,"name"),We.enumPrototypes=we.call(n,"prototype"),We.fastBind=Se&&!ze,We.funcDecomp=!se.test(e.p)&&P.test(h),We.funcNames=typeof ne.name=="string",We.nonEnumArgs=0!=u,We.nonEnumShadows=!/valueOf/.test(r),We.ownLast="x"!=r[0],We.spliceObjects=(ie.splice.call(t,0,1),!t[0]),We.unindexedChars="xx"!="x"[0]+re("x")[0];
        try{We.nodeClass=!(ke.call(document)==J&&!({toString:0}+""))}catch(o){We.nodeClass=!0}}(1),y.templateSettings={escape:/<%-([\s\S]+?)%>/g,evaluate:/<%([\s\S]+?)%>/g,interpolate:N,variable:"",imports:{_:y}},Ie||(ct=function(n){if(bt(n)){c.prototype=n;var t=new c;c.prototype=null}return t||{}});var Ge=Oe?function(n,t){Q.value=t,Oe(n,"__bindData__",Q)}:c;We.argsClass||(vt=function(n){return n&&typeof n=="object"&&typeof n.length=="number"&&de.call(n,"callee")||!1});var Je=Ae||function(n){return n&&typeof n=="object"&&typeof n.length=="number"&&ke.call(n)==T||!1
    },Me=ft({a:"z",e:"[]",i:"if(!(B[typeof z]))return E",g:"E.push(n)"}),He=De?function(n){return bt(n)?We.enumPrototypes&&typeof n=="function"||We.nonEnumArgs&&n.length&&vt(n)?Me(n):De(n):[]}:Me,Ue={a:"g,e,K",i:"e=e&&typeof K=='undefined'?e:d(e,K,3)",b:"typeof u=='number'",v:He,g:"if(e(t[n],n,g)===false)return E"},Ve={a:"z,H,l",i:"var a=arguments,b=0,c=typeof l=='number'?2:a.length;while(++b<c){t=a[b];if(t&&B[typeof t]){",v:He,g:"if(typeof E[n]=='undefined')E[n]=t[n]",c:"}}"},Qe={i:"if(!B[typeof t])return E;"+Ue.i,b:!1},Xe={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Ye=dt(Xe),Ze=ue("("+He(Ye).join("|")+")","g"),nr=ue("["+He(Xe).join("")+"]","g"),tr=ft(Ue),er=ft(Ve,{i:Ve.i.replace(";",";if(c>3&&typeof a[c-2]=='function'){var e=d(a[--c-1],a[c--],2)}else if(c>2&&typeof a[c-1]=='function'){e=a[--c]}"),g:"E[n]=e?e(E[n],t[n]):t[n]"}),rr=ft(Ve),ur=ft(Ue,Qe,{j:!1}),or=ft(Ue,Qe);
    _t(/x/)&&(_t=function(n){return typeof n=="function"&&ke.call(n)==W});var ar=me?function(n){if(!n||ke.call(n)!=J||!We.argsClass&&vt(n))return!1;var t=n.valueOf,e=typeof t=="function"&&(e=me(t))&&me(e);return e?n==e||me(n)==e:gt(n)}:gt,ir=it(function(n,t,e){de.call(n,e)?n[e]++:n[e]=1}),lr=it(function(n,t,e){(de.call(n,e)?n[e]:n[e]=[]).push(t)}),fr=it(function(n,t,e){n[e]=t}),cr=At;ze&&rt&&typeof je=="function"&&(Mt=function(n){if(!_t(n))throw new ae;return je.apply(e,arguments)});var pr=8==Fe(x+"08")?Fe:function(n,t){return Fe(jt(n)?n.replace(B,""):n,t||0)
    };return y.after=function(n,t){if(!_t(t))throw new ae;return function(){return 1>--n?t.apply(this,arguments):void 0}},y.assign=er,y.at=function(n){var t=arguments,e=-1,r=tt(t,!0,!1,1),t=t[2]&&t[2][t[1]]===n?1:r.length,u=Xt(t);for(We.unindexedChars&&jt(n)&&(n=n.split(""));++e<t;)u[e]=n[r[e]];return u},y.bind=Gt,y.bindAll=function(n){for(var t=1<arguments.length?tt(arguments,!0,!1,1):mt(n),e=-1,r=t.length;++e<r;){var u=t[e];n[u]=lt(n[u],1,null,null,n)}return n},y.bindKey=function(n,t){return 2<arguments.length?lt(t,19,Le.call(arguments,2),null,n):lt(t,3,null,null,n)
    },y.chain=function(n){return n=new m(n),n.__chain__=!0,n},y.compact=function(n){for(var t=-1,e=n?n.length:0,r=[];++t<e;){var u=n[t];u&&r.push(u)}return r},y.compose=function(){for(var n=arguments,t=n.length;t--;)if(!_t(n[t]))throw new ae;return function(){for(var t=arguments,e=n.length;e--;)t=[n[e].apply(this,t)];return t[0]}},y.countBy=ir,y.createCallback=function(n,t,e){var r=typeof n;if(null==n||"function"==r)return Z(n,t,e);if("object"!=r)return function(t){return t[n]};var u=He(n),o=u[0],a=n[o];
        return 1!=u.length||a!==a||bt(a)?function(t){for(var e=u.length,r=!1;e--&&(r=et(t[u[e]],n[u[e]],null,!0)););return r}:function(n){return n=n[o],a===n&&(0!==a||1/a==1/n)}},y.curry=function(n,t){return t=typeof t=="number"?t:+t||n.length,lt(n,4,null,null,null,t)},y.debounce=Jt,y.defaults=rr,y.defer=Mt,y.delay=function(n,t){if(!_t(n))throw new ae;var e=Le.call(arguments,2);return xe(function(){n.apply(v,e)},t)},y.difference=Ft,y.filter=Et,y.flatten=function(n,t,e,r){return typeof t!="boolean"&&null!=t&&(e=(r=e)&&r[t]===n?null:t,t=!1),null!=e&&(n=At(n,e,r)),tt(n,t)
    },y.forEach=St,y.forEachRight=It,y.forIn=ur,y.forInRight=function(n,t,e){var r=[];ur(n,function(n,t){r.push(t,n)});var u=r.length;for(t=Z(t,e,3);u--&&false!==t(r[u--],r[u],n););return n},y.forOwn=or,y.forOwnRight=yt,y.functions=mt,y.groupBy=lr,y.indexBy=fr,y.initial=function(n,t,e){var r=0,u=n?n.length:0;if(typeof t!="number"&&null!=t){var o=u;for(t=y.createCallback(t,e,3);o--&&t(n[o],o,n);)r++}else r=null==t||e?1:t||r;return g(n,0,Re(Pe(0,u-r),u))},y.intersection=function(e){for(var r=arguments,u=r.length,a=-1,l=i(),f=-1,c=st(),g=e?e.length:0,h=[],v=i();++a<u;){var y=r[a];
        l[a]=c===n&&(y?y.length:0)>=w&&o(a?r[a]:v)}n:for(;++f<g;){var m=l[0],y=e[f];if(0>(m?t(m,y):c(v,y))){for(a=u,(m||v).push(y);--a;)if(m=l[a],0>(m?t(m,y):c(r[a],y)))continue n;h.push(y)}}for(;u--;)(m=l[u])&&s(m);return p(l),p(v),h},y.invert=dt,y.invoke=function(n,t){var e=Le.call(arguments,2),r=-1,u=typeof t=="function",o=n?n.length:0,a=Xt(typeof o=="number"?o:0);return St(n,function(n){a[++r]=(u?t:n[t]).apply(n,e)}),a},y.keys=He,y.map=At,y.max=Nt,y.memoize=function(n,t){function e(){var r=e.cache,u=t?t.apply(this,arguments):b+arguments[0];
        return de.call(r,u)?r[u]:r[u]=n.apply(this,arguments)}if(!_t(n))throw new ae;return e.cache={},e},y.merge=function(n){var t=arguments,e=2;if(!bt(n))return n;if("number"!=typeof t[2]&&(e=t.length),3<e&&"function"==typeof t[e-2])var r=Z(t[--e-1],t[e--],2);else 2<e&&"function"==typeof t[e-1]&&(r=t[--e]);for(var t=Le.call(arguments,1,e),u=-1,o=i(),a=i();++u<e;)ut(n,t[u],r,o,a);return p(o),p(a),n},y.min=function(n,t,e){var u=1/0,o=u;if(!t&&Je(n)){e=-1;for(var a=n.length;++e<a;){var i=n[e];i<o&&(o=i)}}else t=!t&&jt(n)?r:y.createCallback(t,e,3),tr(n,function(n,e,r){e=t(n,e,r),e<u&&(u=e,o=n)
    });return o},y.omit=function(n,t,e){var r=st(),u=typeof t=="function",o={};if(u)t=y.createCallback(t,e,3);else var a=tt(arguments,!0,!1,1);return ur(n,function(n,e,i){(u?!t(n,e,i):0>r(a,e))&&(o[e]=n)}),o},y.once=function(n){var t,e;if(!_t(n))throw new ae;return function(){return t?e:(t=!0,e=n.apply(this,arguments),n=null,e)}},y.pairs=function(n){for(var t=-1,e=He(n),r=e.length,u=Xt(r);++t<r;){var o=e[t];u[t]=[o,n[o]]}return u},y.partial=function(n){return lt(n,16,Le.call(arguments,1))},y.partialRight=function(n){return lt(n,32,null,Le.call(arguments,1))
    },y.pick=function(n,t,e){var r={};if(typeof t!="function")for(var u=-1,o=tt(arguments,!0,!1,1),a=bt(n)?o.length:0;++u<a;){var i=o[u];i in n&&(r[i]=n[i])}else t=y.createCallback(t,e,3),ur(n,function(n,e,u){t(n,e,u)&&(r[e]=n)});return r},y.pluck=cr,y.pull=function(n){for(var t=arguments,e=0,r=t.length,u=n?n.length:0;++e<r;)for(var o=-1,a=t[e];++o<u;)n[o]===a&&(Ce.call(n,o--,1),u--);return n},y.range=function(n,t,e){n=+n||0,e=typeof e=="number"?e:+e||1,null==t&&(t=n,n=0);var r=-1;t=Pe(0,ge((t-n)/(e||1)));
        for(var u=Xt(t);++r<t;)u[r]=n,n+=e;return u},y.reject=function(n,t,e){return t=y.createCallback(t,e,3),Et(n,function(n,e,r){return!t(n,e,r)})},y.remove=function(n,t,e){var r=-1,u=n?n.length:0,o=[];for(t=y.createCallback(t,e,3);++r<u;)e=n[r],t(e,r,n)&&(o.push(e),Ce.call(n,r--,1),u--);return o},y.rest=Tt,y.shuffle=Pt,y.sortBy=function(n,t,e){var r=-1,o=n?n.length:0,a=Xt(typeof o=="number"?o:0);for(t=y.createCallback(t,e,3),St(n,function(n,e,u){var o=a[++r]=l();o.m=t(n,e,u),o.n=r,o.o=n}),o=a.length,a.sort(u);o--;)n=a[o],a[o]=n.o,s(n);
        return a},y.tap=function(n,t){return t(n),n},y.throttle=function(n,t,e){var r=!0,u=!0;if(!_t(n))throw new ae;return false===e?r=!1:bt(e)&&(r="leading"in e?e.leading:r,u="trailing"in e?e.trailing:u),V.leading=r,V.maxWait=t,V.trailing=u,Jt(n,t,V)},y.times=function(n,t,e){n=-1<(n=+n)?n:0;var r=-1,u=Xt(n);for(t=Z(t,e,1);++r<n;)u[r]=t(r);return u},y.toArray=function(n){return n&&typeof n.length=="number"?We.unindexedChars&&jt(n)?n.split(""):g(n):xt(n)},y.transform=function(n,t,e,r){var u=Je(n);return t=Z(t,r,4),null==e&&(u?e=[]:(r=n&&n.constructor,e=ct(r&&r.prototype))),(u?tr:or)(n,function(n,r,u){return t(e,n,r,u)
    }),e},y.union=function(){return at(tt(arguments,!0,!0))},y.uniq=qt,y.values=xt,y.where=Et,y.without=function(n){return Ft(n,Le.call(arguments,1))},y.wrap=function(n,t){if(!_t(t))throw new ae;return function(){var e=[n];return be.apply(e,arguments),t.apply(this,e)}},y.zip=Kt,y.zipObject=Wt,y.collect=At,y.drop=Tt,y.each=St,y.q=It,y.extend=er,y.methods=mt,y.object=Wt,y.select=Et,y.tail=Tt,y.unique=qt,y.unzip=Kt,Ut(y),y.clone=function(n,t,e,r){return typeof t!="boolean"&&null!=t&&(r=e,e=t,t=!1),j(n,t,typeof e=="function"&&Z(e,r,1))
    },y.cloneDeep=function(n,t,e){return j(n,!0,typeof t=="function"&&Z(t,e,1))},y.contains=Ct,y.escape=function(n){return null==n?"":oe(n).replace(nr,pt)},y.every=kt,y.find=Ot,y.findIndex=function(n,t,e){var r=-1,u=n?n.length:0;for(t=y.createCallback(t,e,3);++r<u;)if(t(n[r],r,n))return r;return-1},y.findKey=function(n,t,e){var r;return t=y.createCallback(t,e,3),or(n,function(n,e,u){return t(n,e,u)?(r=e,!1):void 0}),r},y.findLast=function(n,t,e){var r;return t=y.createCallback(t,e,3),It(n,function(n,e,u){return t(n,e,u)?(r=n,!1):void 0
    }),r},y.findLastIndex=function(n,t,e){var r=n?n.length:0;for(t=y.createCallback(t,e,3);r--;)if(t(n[r],r,n))return r;return-1},y.findLastKey=function(n,t,e){var r;return t=y.createCallback(t,e,3),yt(n,function(n,e,u){return t(n,e,u)?(r=e,!1):void 0}),r},y.has=function(n,t){return n?de.call(n,t):!1},y.identity=Ht,y.indexOf=Lt,y.isArguments=vt,y.isArray=Je,y.isBoolean=function(n){return true===n||false===n||ke.call(n)==z},y.isDate=function(n){return n?typeof n=="object"&&ke.call(n)==q:!1},y.isElement=function(n){return n?1===n.nodeType:!1
    },y.isEmpty=function(n){var t=!0;if(!n)return t;var e=ke.call(n),r=n.length;return e==T||e==H||(We.argsClass?e==L:vt(n))||e==J&&typeof r=="number"&&_t(n.splice)?!r:(or(n,function(){return t=!1}),t)},y.isEqual=function(n,t,e,r){return et(n,t,typeof e=="function"&&Z(e,r,2))},y.isFinite=function(n){return Ne(n)&&!Be(parseFloat(n))},y.isFunction=_t,y.isNaN=function(n){return wt(n)&&n!=+n},y.isNull=function(n){return null===n},y.isNumber=wt,y.isObject=bt,y.isPlainObject=ar,y.isRegExp=function(n){return n&&Y[typeof n]?ke.call(n)==M:!1
    },y.isString=jt,y.isUndefined=function(n){return typeof n=="undefined"},y.lastIndexOf=function(n,t,e){var r=n?n.length:0;for(typeof e=="number"&&(r=(0>e?Pe(0,r+e):Re(e,r-1))+1);r--;)if(n[r]===t)return r;return-1},y.mixin=Ut,y.noConflict=function(){return e._=pe,this},y.parseInt=pr,y.random=Vt,y.reduce=Bt,y.reduceRight=Dt,y.result=function(n,t){if(n){var e=n[t];return _t(e)?n[t]():e}},y.runInContext=h,y.size=function(n){var t=n?n.length:0;return typeof t=="number"?t:He(n).length},y.some=Rt,y.sortedIndex=zt,y.template=function(n,t,e){var r=y.templateSettings;
        n||(n=""),e=rr({},e,r);var u,o=rr({},e.imports,r.imports),r=He(o),o=xt(o),i=0,l=e.interpolate||D,f="__p+='",l=ue((e.escape||D).source+"|"+l.source+"|"+(l===N?S:D).source+"|"+(e.evaluate||D).source+"|$","g");n.replace(l,function(t,e,r,o,l,c){return r||(r=o),f+=n.slice(i,c).replace(R,a),e&&(f+="'+__e("+e+")+'"),l&&(u=!0,f+="';"+l+";__p+='"),r&&(f+="'+((__t=("+r+"))==null?'':__t)+'"),i=c+t.length,t}),f+="';\n",l=e=e.variable,l||(e="obj",f="with("+e+"){"+f+"}"),f=(u?f.replace(C,""):f).replace(E,"$1").replace(O,"$1;"),f="function("+e+"){"+(l?"":e+"||("+e+"={});")+"var __t,__p='',__e=_.escape"+(u?",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}":";")+f+"return __p}";
        try{var c=ne(r,"return "+f).apply(v,o)}catch(p){throw p.source=f,p}return t?c(t):(c.source=f,c)},y.unescape=function(n){return null==n?"":oe(n).replace(Ze,ht)},y.uniqueId=function(n){var t=++d;return oe(null==n?"":n)+t},y.all=kt,y.any=Rt,y.detect=Ot,y.findWhere=Ot,y.foldl=Bt,y.foldr=Dt,y.include=Ct,y.inject=Bt,or(y,function(n,t){y.prototype[t]||(y.prototype[t]=function(){var t=[this.__wrapped__],e=this.__chain__;return be.apply(t,arguments),t=n.apply(y,t),e?new m(t,e):t})}),y.first=$t,y.last=function(n,t,e){var r=0,u=n?n.length:0;
        if(typeof t!="number"&&null!=t){var o=u;for(t=y.createCallback(t,e,3);o--&&t(n[o],o,n);)r++}else if(r=t,null==r||e)return n?n[u-1]:v;return g(n,Pe(0,u-r))},y.sample=function(n,t,e){var r=n?n.length:0;return typeof r!="number"?n=xt(n):We.unindexedChars&&jt(n)&&(n=n.split("")),null==t||e?n?n[Vt(r-1)]:v:(n=Pt(n),n.length=Re(Pe(0,t),n.length),n)},y.take=$t,y.head=$t,or(y,function(n,t){var e="sample"!==t;y.prototype[t]||(y.prototype[t]=function(t,r){var u=this.__chain__,o=n(this.__wrapped__,t,r);return u||null!=t&&(!r||e&&typeof t=="function")?new m(o,u):o
    })}),y.VERSION="2.2.1",y.prototype.chain=function(){return this.__chain__=!0,this},y.prototype.toString=function(){return oe(this.__wrapped__)},y.prototype.value=Qt,y.prototype.valueOf=Qt,tr(["join","pop","shift"],function(n){var t=ie[n];y.prototype[n]=function(){var n=this.__chain__,e=t.apply(this.__wrapped__,arguments);return n?new m(e,n):e}}),tr(["push","reverse","sort","unshift"],function(n){var t=ie[n];y.prototype[n]=function(){return t.apply(this.__wrapped__,arguments),this}}),tr(["concat","slice","splice"],function(n){var t=ie[n];
        y.prototype[n]=function(){return new m(t.apply(this.__wrapped__,arguments),this.__chain__)}}),We.spliceObjects||tr(["pop","shift","splice"],function(n){var t=ie[n],e="splice"==n;y.prototype[n]=function(){var n=this.__chain__,r=this.__wrapped__,u=t.apply(r,arguments);return 0===r.length&&delete r[0],n||e?new m(u,n):u}}),y}var v,y=[],m=[],d=0,_={},b=+new Date+"",w=75,j=40,x=" \t\x0B\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000",C=/\b__p\+='';/g,E=/\b(__p\+=)''\+/g,O=/(__e\(.*?\)|\b__t\))\+'';/g,S=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,I=/\w*$/,A=/^function[ \n\r\t]+\w/,N=/<%=([\s\S]+?)%>/g,B=RegExp("^["+x+"]*0+(?=.$)"),D=/($^)/,P=/\bthis\b/,R=/['\n\r\t\u2028\u2029\\]/g,F="Array Boolean Date Error Function Math Number Object RegExp String _ attachEvent clearTimeout isFinite isNaN parseInt setImmediate setTimeout".split(" "),$="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),L="[object Arguments]",T="[object Array]",z="[object Boolean]",q="[object Date]",K="[object Error]",W="[object Function]",G="[object Number]",J="[object Object]",M="[object RegExp]",H="[object String]",U={};
    U[W]=!1,U[L]=U[T]=U[z]=U[q]=U[G]=U[J]=U[M]=U[H]=!0;var V={leading:!1,maxWait:0,trailing:!1},Q={configurable:!1,enumerable:!1,value:null,writable:!1},X={a:"",b:null,c:"",d:"",e:"",v:null,g:"",h:null,support:null,i:"",j:!1},Y={"boolean":!1,"function":!0,object:!0,number:!1,string:!1,undefined:!1},Z={"\\":"\\","'":"'","\n":"n","\r":"r","\t":"t","\u2028":"u2028","\u2029":"u2029"},nt=Y[typeof window]&&window||this,tt=Y[typeof exports]&&exports&&!exports.nodeType&&exports,et=Y[typeof module]&&module&&!module.nodeType&&module,rt=et&&et.exports===tt&&tt,ut=Y[typeof global]&&global;
    !ut||ut.global!==ut&&ut.window!==ut||(nt=ut);var ot=h();typeof define=="function"&&typeof define.amd=="object"&&define.amd?(nt._=ot, define(function(){return ot})):tt&&et?rt?(et.exports=ot)._=ot:tt._=ot:nt._=ot}).call(this);
 /**//*! Hammer.JS - v1.0.5 - 2013-04-07
 * http://eightmedia.github.com/hammer.js
 *
 * Copyright (c) 2013 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */

(function(t,e){"use strict";function n(){if(!i.READY){i.event.determineEventTypes();for(var t in i.gestures)i.gestures.hasOwnProperty(t)&&i.detection.register(i.gestures[t]);i.event.onTouch(i.DOCUMENT,i.EVENT_MOVE,i.detection.detect),i.event.onTouch(i.DOCUMENT,i.EVENT_END,i.detection.detect),i.READY=!0}}var i=function(t,e){return new i.Instance(t,e||{})};i.defaults={stop_browser_behavior:{userSelect:"none",touchAction:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}},i.HAS_POINTEREVENTS=navigator.pointerEnabled||navigator.msPointerEnabled,i.HAS_TOUCHEVENTS="ontouchstart"in t,i.MOBILE_REGEX=/mobile|tablet|ip(ad|hone|od)|android/i,i.NO_MOUSEEVENTS=i.HAS_TOUCHEVENTS&&navigator.userAgent.match(i.MOBILE_REGEX),i.EVENT_TYPES={},i.DIRECTION_DOWN="down",i.DIRECTION_LEFT="left",i.DIRECTION_UP="up",i.DIRECTION_RIGHT="right",i.POINTER_MOUSE="mouse",i.POINTER_TOUCH="touch",i.POINTER_PEN="pen",i.EVENT_START="start",i.EVENT_MOVE="move",i.EVENT_END="end",i.DOCUMENT=document,i.plugins={},i.READY=!1,i.Instance=function(t,e){var r=this;return n(),this.element=t,this.enabled=!0,this.options=i.utils.extend(i.utils.extend({},i.defaults),e||{}),this.options.stop_browser_behavior&&i.utils.stopDefaultBrowserBehavior(this.element,this.options.stop_browser_behavior),i.event.onTouch(t,i.EVENT_START,function(t){r.enabled&&i.detection.startDetect(r,t)}),this},i.Instance.prototype={on:function(t,e){for(var n=t.split(" "),i=0;n.length>i;i++)this.element.addEventListener(n[i],e,!1);return this},off:function(t,e){for(var n=t.split(" "),i=0;n.length>i;i++)this.element.removeEventListener(n[i],e,!1);return this},trigger:function(t,e){var n=i.DOCUMENT.createEvent("Event");n.initEvent(t,!0,!0),n.gesture=e;var r=this.element;return i.utils.hasParent(e.target,r)&&(r=e.target),r.dispatchEvent(n),this},enable:function(t){return this.enabled=t,this}};var r=null,o=!1,s=!1;i.event={bindDom:function(t,e,n){for(var i=e.split(" "),r=0;i.length>r;r++)t.addEventListener(i[r],n,!1)},onTouch:function(t,e,n){var a=this;this.bindDom(t,i.EVENT_TYPES[e],function(c){var u=c.type.toLowerCase();if(!u.match(/mouse/)||!s){(u.match(/touch/)||u.match(/pointerdown/)||u.match(/mouse/)&&1===c.which)&&(o=!0),u.match(/touch|pointer/)&&(s=!0);var h=0;o&&(i.HAS_POINTEREVENTS&&e!=i.EVENT_END?h=i.PointerEvent.updatePointer(e,c):u.match(/touch/)?h=c.touches.length:s||(h=u.match(/up/)?0:1),h>0&&e==i.EVENT_END?e=i.EVENT_MOVE:h||(e=i.EVENT_END),h||null===r?r=c:c=r,n.call(i.detection,a.collectEventData(t,e,c)),i.HAS_POINTEREVENTS&&e==i.EVENT_END&&(h=i.PointerEvent.updatePointer(e,c))),h||(r=null,o=!1,s=!1,i.PointerEvent.reset())}})},determineEventTypes:function(){var t;t=i.HAS_POINTEREVENTS?i.PointerEvent.getEvents():i.NO_MOUSEEVENTS?["touchstart","touchmove","touchend touchcancel"]:["touchstart mousedown","touchmove mousemove","touchend touchcancel mouseup"],i.EVENT_TYPES[i.EVENT_START]=t[0],i.EVENT_TYPES[i.EVENT_MOVE]=t[1],i.EVENT_TYPES[i.EVENT_END]=t[2]},getTouchList:function(t){return i.HAS_POINTEREVENTS?i.PointerEvent.getTouchList():t.touches?t.touches:[{identifier:1,pageX:t.pageX,pageY:t.pageY,target:t.target}]},collectEventData:function(t,e,n){var r=this.getTouchList(n,e),o=i.POINTER_TOUCH;return(n.type.match(/mouse/)||i.PointerEvent.matchType(i.POINTER_MOUSE,n))&&(o=i.POINTER_MOUSE),{center:i.utils.getCenter(r),timeStamp:(new Date).getTime(),target:n.target,touches:r,eventType:e,pointerType:o,srcEvent:n,preventDefault:function(){this.srcEvent.preventManipulation&&this.srcEvent.preventManipulation(),this.srcEvent.preventDefault&&this.srcEvent.preventDefault()},stopPropagation:function(){this.srcEvent.stopPropagation()},stopDetect:function(){return i.detection.stopDetect()}}}},i.PointerEvent={pointers:{},getTouchList:function(){var t=this,e=[];return Object.keys(t.pointers).sort().forEach(function(n){e.push(t.pointers[n])}),e},updatePointer:function(t,e){return t==i.EVENT_END?this.pointers={}:(e.identifier=e.pointerId,this.pointers[e.pointerId]=e),Object.keys(this.pointers).length},matchType:function(t,e){if(!e.pointerType)return!1;var n={};return n[i.POINTER_MOUSE]=e.pointerType==e.MSPOINTER_TYPE_MOUSE||e.pointerType==i.POINTER_MOUSE,n[i.POINTER_TOUCH]=e.pointerType==e.MSPOINTER_TYPE_TOUCH||e.pointerType==i.POINTER_TOUCH,n[i.POINTER_PEN]=e.pointerType==e.MSPOINTER_TYPE_PEN||e.pointerType==i.POINTER_PEN,n[t]},getEvents:function(){return["pointerdown MSPointerDown","pointermove MSPointerMove","pointerup pointercancel MSPointerUp MSPointerCancel"]},reset:function(){this.pointers={}}},i.utils={extend:function(t,n,i){for(var r in n)t[r]!==e&&i||(t[r]=n[r]);return t},hasParent:function(t,e){for(;t;){if(t==e)return!0;t=t.parentNode}return!1},getCenter:function(t){for(var e=[],n=[],i=0,r=t.length;r>i;i++)e.push(t[i].pageX),n.push(t[i].pageY);return{pageX:(Math.min.apply(Math,e)+Math.max.apply(Math,e))/2,pageY:(Math.min.apply(Math,n)+Math.max.apply(Math,n))/2}},getVelocity:function(t,e,n){return{x:Math.abs(e/t)||0,y:Math.abs(n/t)||0}},getAngle:function(t,e){var n=e.pageY-t.pageY,i=e.pageX-t.pageX;return 180*Math.atan2(n,i)/Math.PI},getDirection:function(t,e){var n=Math.abs(t.pageX-e.pageX),r=Math.abs(t.pageY-e.pageY);return n>=r?t.pageX-e.pageX>0?i.DIRECTION_LEFT:i.DIRECTION_RIGHT:t.pageY-e.pageY>0?i.DIRECTION_UP:i.DIRECTION_DOWN},getDistance:function(t,e){var n=e.pageX-t.pageX,i=e.pageY-t.pageY;return Math.sqrt(n*n+i*i)},getScale:function(t,e){return t.length>=2&&e.length>=2?this.getDistance(e[0],e[1])/this.getDistance(t[0],t[1]):1},getRotation:function(t,e){return t.length>=2&&e.length>=2?this.getAngle(e[1],e[0])-this.getAngle(t[1],t[0]):0},isVertical:function(t){return t==i.DIRECTION_UP||t==i.DIRECTION_DOWN},stopDefaultBrowserBehavior:function(t,e){var n,i=["webkit","khtml","moz","ms","o",""];if(e&&t.style){for(var r=0;i.length>r;r++)for(var o in e)e.hasOwnProperty(o)&&(n=o,i[r]&&(n=i[r]+n.substring(0,1).toUpperCase()+n.substring(1)),t.style[n]=e[o]);"none"==e.userSelect&&(t.onselectstart=function(){return!1})}}},i.detection={gestures:[],current:null,previous:null,stopped:!1,startDetect:function(t,e){this.current||(this.stopped=!1,this.current={inst:t,startEvent:i.utils.extend({},e),lastEvent:!1,name:""},this.detect(e))},detect:function(t){if(this.current&&!this.stopped){t=this.extendEventData(t);for(var e=this.current.inst.options,n=0,r=this.gestures.length;r>n;n++){var o=this.gestures[n];if(!this.stopped&&e[o.name]!==!1&&o.handler.call(o,t,this.current.inst)===!1){this.stopDetect();break}}return this.current&&(this.current.lastEvent=t),t.eventType==i.EVENT_END&&!t.touches.length-1&&this.stopDetect(),t}},stopDetect:function(){this.previous=i.utils.extend({},this.current),this.current=null,this.stopped=!0},extendEventData:function(t){var e=this.current.startEvent;if(e&&(t.touches.length!=e.touches.length||t.touches===e.touches)){e.touches=[];for(var n=0,r=t.touches.length;r>n;n++)e.touches.push(i.utils.extend({},t.touches[n]))}var o=t.timeStamp-e.timeStamp,s=t.center.pageX-e.center.pageX,a=t.center.pageY-e.center.pageY,c=i.utils.getVelocity(o,s,a);return i.utils.extend(t,{deltaTime:o,deltaX:s,deltaY:a,velocityX:c.x,velocityY:c.y,distance:i.utils.getDistance(e.center,t.center),angle:i.utils.getAngle(e.center,t.center),direction:i.utils.getDirection(e.center,t.center),scale:i.utils.getScale(e.touches,t.touches),rotation:i.utils.getRotation(e.touches,t.touches),startEvent:e}),t},register:function(t){var n=t.defaults||{};return n[t.name]===e&&(n[t.name]=!0),i.utils.extend(i.defaults,n,!0),t.index=t.index||1e3,this.gestures.push(t),this.gestures.sort(function(t,e){return t.index<e.index?-1:t.index>e.index?1:0}),this.gestures}},i.gestures=i.gestures||{},i.gestures.Hold={name:"hold",index:10,defaults:{hold_timeout:500,hold_threshold:1},timer:null,handler:function(t,e){switch(t.eventType){case i.EVENT_START:clearTimeout(this.timer),i.detection.current.name=this.name,this.timer=setTimeout(function(){"hold"==i.detection.current.name&&e.trigger("hold",t)},e.options.hold_timeout);break;case i.EVENT_MOVE:t.distance>e.options.hold_threshold&&clearTimeout(this.timer);break;case i.EVENT_END:clearTimeout(this.timer)}}},i.gestures.Tap={name:"tap",index:100,defaults:{tap_max_touchtime:250,tap_max_distance:10,tap_always:!0,doubletap_distance:20,doubletap_interval:300},handler:function(t,e){if(t.eventType==i.EVENT_END){var n=i.detection.previous,r=!1;if(t.deltaTime>e.options.tap_max_touchtime||t.distance>e.options.tap_max_distance)return;n&&"tap"==n.name&&t.timeStamp-n.lastEvent.timeStamp<e.options.doubletap_interval&&t.distance<e.options.doubletap_distance&&(e.trigger("doubletap",t),r=!0),(!r||e.options.tap_always)&&(i.detection.current.name="tap",e.trigger(i.detection.current.name,t))}}},i.gestures.Swipe={name:"swipe",index:40,defaults:{swipe_max_touches:1,swipe_velocity:.7},handler:function(t,e){if(t.eventType==i.EVENT_END){if(e.options.swipe_max_touches>0&&t.touches.length>e.options.swipe_max_touches)return;(t.velocityX>e.options.swipe_velocity||t.velocityY>e.options.swipe_velocity)&&(e.trigger(this.name,t),e.trigger(this.name+t.direction,t))}}},i.gestures.Drag={name:"drag",index:50,defaults:{drag_min_distance:10,drag_max_touches:1,drag_block_horizontal:!1,drag_block_vertical:!1,drag_lock_to_axis:!1,drag_lock_min_distance:25},triggered:!1,handler:function(t,n){if(i.detection.current.name!=this.name&&this.triggered)return n.trigger(this.name+"end",t),this.triggered=!1,e;if(!(n.options.drag_max_touches>0&&t.touches.length>n.options.drag_max_touches))switch(t.eventType){case i.EVENT_START:this.triggered=!1;break;case i.EVENT_MOVE:if(t.distance<n.options.drag_min_distance&&i.detection.current.name!=this.name)return;i.detection.current.name=this.name,(i.detection.current.lastEvent.drag_locked_to_axis||n.options.drag_lock_to_axis&&n.options.drag_lock_min_distance<=t.distance)&&(t.drag_locked_to_axis=!0);var r=i.detection.current.lastEvent.direction;t.drag_locked_to_axis&&r!==t.direction&&(t.direction=i.utils.isVertical(r)?0>t.deltaY?i.DIRECTION_UP:i.DIRECTION_DOWN:0>t.deltaX?i.DIRECTION_LEFT:i.DIRECTION_RIGHT),this.triggered||(n.trigger(this.name+"start",t),this.triggered=!0),n.trigger(this.name,t),n.trigger(this.name+t.direction,t),(n.options.drag_block_vertical&&i.utils.isVertical(t.direction)||n.options.drag_block_horizontal&&!i.utils.isVertical(t.direction))&&t.preventDefault();break;case i.EVENT_END:this.triggered&&n.trigger(this.name+"end",t),this.triggered=!1}}},i.gestures.Transform={name:"transform",index:45,defaults:{transform_min_scale:.01,transform_min_rotation:1,transform_always_block:!1},triggered:!1,handler:function(t,n){if(i.detection.current.name!=this.name&&this.triggered)return n.trigger(this.name+"end",t),this.triggered=!1,e;if(!(2>t.touches.length))switch(n.options.transform_always_block&&t.preventDefault(),t.eventType){case i.EVENT_START:this.triggered=!1;break;case i.EVENT_MOVE:var r=Math.abs(1-t.scale),o=Math.abs(t.rotation);if(n.options.transform_min_scale>r&&n.options.transform_min_rotation>o)return;i.detection.current.name=this.name,this.triggered||(n.trigger(this.name+"start",t),this.triggered=!0),n.trigger(this.name,t),o>n.options.transform_min_rotation&&n.trigger("rotate",t),r>n.options.transform_min_scale&&(n.trigger("pinch",t),n.trigger("pinch"+(1>t.scale?"in":"out"),t));break;case i.EVENT_END:this.triggered&&n.trigger(this.name+"end",t),this.triggered=!1}}},i.gestures.Touch={name:"touch",index:-1/0,defaults:{prevent_default:!1,prevent_mouseevents:!1},handler:function(t,n){return n.options.prevent_mouseevents&&t.pointerType==i.POINTER_MOUSE?(t.stopDetect(),e):(n.options.prevent_default&&t.preventDefault(),t.eventType==i.EVENT_START&&n.trigger(this.name,t),e)}},i.gestures.Release={name:"release",index:1/0,handler:function(t,e){t.eventType==i.EVENT_END&&e.trigger(this.name,t)}},"object"==typeof module&&"object"==typeof module.exports?module.exports=i:(t.Hammer=i,"function"==typeof t.define&&t.define.amd&&t.define("hammer",[],function(){return i}))})(this),function(t,e){"use strict";t!==e&&(Hammer.event.bindDom=function(n,i,r){t(n).on(i,function(t){var n=t.originalEvent||t;n.pageX===e&&(n.pageX=t.pageX,n.pageY=t.pageY),n.target||(n.target=t.target),n.which===e&&(n.which=n.button),n.preventDefault||(n.preventDefault=t.preventDefault),n.stopPropagation||(n.stopPropagation=t.stopPropagation),r.call(this,n)})},Hammer.Instance.prototype.on=function(e,n){return t(this.element).on(e,n)},Hammer.Instance.prototype.off=function(e,n){return t(this.element).off(e,n)},Hammer.Instance.prototype.trigger=function(e,n){var i=t(this.element);return i.has(n.target).length&&(i=t(n.target)),i.trigger({type:e,gesture:n})},t.fn.hammer=function(e){return this.each(function(){var n=t(this),i=n.data("hammer");i?i&&e&&Hammer.utils.extend(i.options,e):n.data("hammer",new Hammer(this,e||{}))})})}(window.jQuery||window.Zepto);
 /**/// Magnific Popup v0.9.8 by Dmitry Semenov
// http://bit.ly/magnific-popup#build=image+gallery+retina+imagezoom+fastclick
(function(a){var b="Close",c="BeforeClose",d="AfterClose",e="BeforeAppend",f="MarkupParse",g="Open",h="Change",i="mfp",j="."+i,k="mfp-ready",l="mfp-removing",m="mfp-prevent-close",n,o=function(){},p=!!window.jQuery,q,r=a(window),s,t,u,v,w,x=function(a,b){n.ev.on(i+a+j,b)},y=function(b,c,d,e){var f=document.createElement("div");return f.className="mfp-"+b,d&&(f.innerHTML=d),e?c&&c.appendChild(f):(f=a(f),c&&f.appendTo(c)),f},z=function(b,c){n.ev.triggerHandler(i+b,c),n.st.callbacks&&(b=b.charAt(0).toLowerCase()+b.slice(1),n.st.callbacks[b]&&n.st.callbacks[b].apply(n,a.isArray(c)?c:[c]))},A=function(){(n.st.focus?n.content.find(n.st.focus).eq(0):n.wrap).focus()},B=function(b){if(b!==w||!n.currTemplate.closeBtn)n.currTemplate.closeBtn=a(n.st.closeMarkup.replace("%title%",n.st.tClose)),w=b;return n.currTemplate.closeBtn},C=function(){a.magnificPopup.instance||(n=new o,n.init(),a.magnificPopup.instance=n)},D=function(){var a=document.createElement("p").style,b=["ms","O","Moz","Webkit"];if(a.transition!==undefined)return!0;while(b.length)if(b.pop()+"Transition"in a)return!0;return!1};o.prototype={constructor:o,init:function(){var b=navigator.appVersion;n.isIE7=b.indexOf("MSIE 7.")!==-1,n.isIE8=b.indexOf("MSIE 8.")!==-1,n.isLowIE=n.isIE7||n.isIE8,n.isAndroid=/android/gi.test(b),n.isIOS=/iphone|ipad|ipod/gi.test(b),n.supportsTransition=D(),n.probablyMobile=n.isAndroid||n.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),s=a(document.body),t=a(document),n.popupsCache={}},open:function(b){var c;if(b.isObj===!1){n.items=b.items.toArray(),n.index=0;var d=b.items,e;for(c=0;c<d.length;c++){e=d[c],e.parsed&&(e=e.el[0]);if(e===b.el[0]){n.index=c;break}}}else n.items=a.isArray(b.items)?b.items:[b.items],n.index=b.index||0;if(n.isOpen){n.updateItemHTML();return}n.types=[],v="",b.mainEl&&b.mainEl.length?n.ev=b.mainEl.eq(0):n.ev=t,b.key?(n.popupsCache[b.key]||(n.popupsCache[b.key]={}),n.currTemplate=n.popupsCache[b.key]):n.currTemplate={},n.st=a.extend(!0,{},a.magnificPopup.defaults,b),n.fixedContentPos=n.st.fixedContentPos==="auto"?!n.probablyMobile:n.st.fixedContentPos,n.st.modal&&(n.st.closeOnContentClick=!1,n.st.closeOnBgClick=!1,n.st.showCloseBtn=!1,n.st.enableEscapeKey=!1),n.bgOverlay||(n.bgOverlay=y("bg").on("click"+j,function(){n.close()}),n.wrap=y("wrap").attr("tabindex",-1).on("click"+j,function(a){n._checkIfClose(a.target)&&n.close()}),n.container=y("container",n.wrap)),n.contentContainer=y("content"),n.st.preloader&&(n.preloader=y("preloader",n.container,n.st.tLoading));var h=a.magnificPopup.modules;for(c=0;c<h.length;c++){var i=h[c];i=i.charAt(0).toUpperCase()+i.slice(1),n["init"+i].call(n)}z("BeforeOpen"),n.st.showCloseBtn&&(n.st.closeBtnInside?(x(f,function(a,b,c,d){c.close_replaceWith=B(d.type)}),v+=" mfp-close-btn-in"):n.wrap.append(B())),n.st.alignTop&&(v+=" mfp-align-top"),n.fixedContentPos?n.wrap.css({overflow:n.st.overflowY,overflowX:"hidden",overflowY:n.st.overflowY}):n.wrap.css({top:r.scrollTop(),position:"absolute"}),(n.st.fixedBgPos===!1||n.st.fixedBgPos==="auto"&&!n.fixedContentPos)&&n.bgOverlay.css({height:t.height(),position:"absolute"}),n.st.enableEscapeKey&&t.on("keyup"+j,function(a){a.keyCode===27&&n.close()}),r.on("resize"+j,function(){n.updateSize()}),n.st.closeOnContentClick||(v+=" mfp-auto-cursor"),v&&n.wrap.addClass(v);var l=n.wH=r.height(),m={};if(n.fixedContentPos&&n._hasScrollBar(l)){var o=n._getScrollbarSize();o&&(m.marginRight=o)}n.fixedContentPos&&(n.isIE7?a("body, html").css("overflow","hidden"):m.overflow="hidden");var p=n.st.mainClass;return n.isIE7&&(p+=" mfp-ie7"),p&&n._addClassToMFP(p),n.updateItemHTML(),z("BuildControls"),a("html").css(m),n.bgOverlay.add(n.wrap).prependTo(document.body),n._lastFocusedEl=document.activeElement,setTimeout(function(){n.content?(n._addClassToMFP(k),A()):n.bgOverlay.addClass(k),t.on("focusin"+j,function(b){if(b.target!==n.wrap[0]&&!a.contains(n.wrap[0],b.target))return A(),!1})},16),n.isOpen=!0,n.updateSize(l),z(g),b},close:function(){if(!n.isOpen)return;z(c),n.isOpen=!1,n.st.removalDelay&&!n.isLowIE&&n.supportsTransition?(n._addClassToMFP(l),setTimeout(function(){n._close()},n.st.removalDelay)):n._close()},_close:function(){z(b);var c=l+" "+k+" ";n.bgOverlay.detach(),n.wrap.detach(),n.container.empty(),n.st.mainClass&&(c+=n.st.mainClass+" "),n._removeClassFromMFP(c);if(n.fixedContentPos){var e={marginRight:""};n.isIE7?a("body, html").css("overflow",""):e.overflow="",a("html").css(e)}t.off("keyup"+j+" focusin"+j),n.ev.off(j),n.wrap.attr("class","mfp-wrap").removeAttr("style"),n.bgOverlay.attr("class","mfp-bg"),n.container.attr("class","mfp-container"),n.st.showCloseBtn&&(!n.st.closeBtnInside||n.currTemplate[n.currItem.type]===!0)&&n.currTemplate.closeBtn&&n.currTemplate.closeBtn.detach(),n._lastFocusedEl&&a(n._lastFocusedEl).focus(),n.currItem=null,n.content=null,n.currTemplate=null,n.prevHeight=0,z(d)},updateSize:function(a){if(n.isIOS){var b=document.documentElement.clientWidth/window.innerWidth,c=window.innerHeight*b;n.wrap.css("height",c),n.wH=c}else n.wH=a||r.height();n.fixedContentPos||n.wrap.css("height",n.wH),z("Resize")},updateItemHTML:function(){var b=n.items[n.index];n.contentContainer.detach(),n.content&&n.content.detach(),b.parsed||(b=n.parseEl(n.index));var c=b.type;z("BeforeChange",[n.currItem?n.currItem.type:"",c]),n.currItem=b;if(!n.currTemplate[c]){var d=n.st[c]?n.st[c].markup:!1;z("FirstMarkupParse",d),d?n.currTemplate[c]=a(d):n.currTemplate[c]=!0}u&&u!==b.type&&n.container.removeClass("mfp-"+u+"-holder");var e=n["get"+c.charAt(0).toUpperCase()+c.slice(1)](b,n.currTemplate[c]);n.appendContent(e,c),b.preloaded=!0,z(h,b),u=b.type,n.container.prepend(n.contentContainer),z("AfterChange")},appendContent:function(a,b){n.content=a,a?n.st.showCloseBtn&&n.st.closeBtnInside&&n.currTemplate[b]===!0?n.content.find(".mfp-close").length||n.content.append(B()):n.content=a:n.content="",z(e),n.container.addClass("mfp-"+b+"-holder"),n.contentContainer.append(n.content)},parseEl:function(b){var c=n.items[b],d=c.type;c.tagName?c={el:a(c)}:c={data:c,src:c.src};if(c.el){var e=n.types;for(var f=0;f<e.length;f++)if(c.el.hasClass("mfp-"+e[f])){d=e[f];break}c.src=c.el.attr("data-mfp-src"),c.src||(c.src=c.el.attr("href"))}return c.type=d||n.st.type||"inline",c.index=b,c.parsed=!0,n.items[b]=c,z("ElementParse",c),n.items[b]},addGroup:function(a,b){var c=function(c){c.mfpEl=this,n._openClick(c,a,b)};b||(b={});var d="click.magnificPopup";b.mainEl=a,b.items?(b.isObj=!0,a.off(d).on(d,c)):(b.isObj=!1,b.delegate?a.off(d).on(d,b.delegate,c):(b.items=a,a.off(d).on(d,c)))},_openClick:function(b,c,d){var e=d.midClick!==undefined?d.midClick:a.magnificPopup.defaults.midClick;if(!e&&(b.which===2||b.ctrlKey||b.metaKey))return;var f=d.disableOn!==undefined?d.disableOn:a.magnificPopup.defaults.disableOn;if(f)if(a.isFunction(f)){if(!f.call(n))return!0}else if(r.width()<f)return!0;b.type&&(b.preventDefault(),n.isOpen&&b.stopPropagation()),d.el=a(b.mfpEl),d.delegate&&(d.items=c.find(d.delegate)),n.open(d)},updateStatus:function(a,b){if(n.preloader){q!==a&&n.container.removeClass("mfp-s-"+q),!b&&a==="loading"&&(b=n.st.tLoading);var c={status:a,text:b};z("UpdateStatus",c),a=c.status,b=c.text,n.preloader.html(b),n.preloader.find("a").on("click",function(a){a.stopImmediatePropagation()}),n.container.addClass("mfp-s-"+a),q=a}},_checkIfClose:function(b){if(a(b).hasClass(m))return;var c=n.st.closeOnContentClick,d=n.st.closeOnBgClick;if(c&&d)return!0;if(!n.content||a(b).hasClass("mfp-close")||n.preloader&&b===n.preloader[0])return!0;if(b!==n.content[0]&&!a.contains(n.content[0],b)){if(d&&a.contains(document,b))return!0}else if(c)return!0;return!1},_addClassToMFP:function(a){n.bgOverlay.addClass(a),n.wrap.addClass(a)},_removeClassFromMFP:function(a){this.bgOverlay.removeClass(a),n.wrap.removeClass(a)},_hasScrollBar:function(a){return(n.isIE7?t.height():document.body.scrollHeight)>(a||r.height())},_parseMarkup:function(b,c,d){var e;d.data&&(c=a.extend(d.data,c)),z(f,[b,c,d]),a.each(c,function(a,c){if(c===undefined||c===!1)return!0;e=a.split("_");if(e.length>1){var d=b.find(j+"-"+e[0]);if(d.length>0){var f=e[1];f==="replaceWith"?d[0]!==c[0]&&d.replaceWith(c):f==="img"?d.is("img")?d.attr("src",c):d.replaceWith('<img src="'+c+'" class="'+d.attr("class")+'" />'):d.attr(e[1],c)}}else b.find(j+"-"+a).html(c)})},_getScrollbarSize:function(){if(n.scrollbarSize===undefined){var a=document.createElement("div");a.id="mfp-sbm",a.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(a),n.scrollbarSize=a.offsetWidth-a.clientWidth,document.body.removeChild(a)}return n.scrollbarSize}},a.magnificPopup={instance:null,proto:o.prototype,modules:[],open:function(b,c){return C(),b?b=a.extend(!0,{},b):b={},b.isObj=!0,b.index=c||0,this.instance.open(b)},close:function(){return a.magnificPopup.instance&&a.magnificPopup.instance.close()},registerModule:function(b,c){c.options&&(a.magnificPopup.defaults[b]=c.options),a.extend(this.proto,c.proto),this.modules.push(b)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeOnBgClick:!0,closeBtnInside:!0,showCloseBtn:!0,enableEscapeKey:!0,modal:!1,alignTop:!1,removalDelay:0,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&times;</button>',tClose:"Close (Esc)",tLoading:"Loading..."}},a.fn.magnificPopup=function(b){C();var c=a(this);if(typeof b=="string")if(b==="open"){var d,e=p?c.data("magnificPopup"):c[0].magnificPopup,f=parseInt(arguments[1],10)||0;e.items?d=e.items[f]:(d=c,e.delegate&&(d=d.find(e.delegate)),d=d.eq(f)),n._openClick({mfpEl:d},c,e)}else n.isOpen&&n[b].apply(n,Array.prototype.slice.call(arguments,1));else b=a.extend(!0,{},b),p?c.data("magnificPopup",b):c[0].magnificPopup=b,n.addGroup(c,b);return c};var E,F=function(b){if(b.data&&b.data.title!==undefined)return b.data.title;var c=n.st.image.titleSrc;if(c){if(a.isFunction(c))return c.call(n,b);if(b.el)return b.el.attr(c)||""}return""};a.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var a=n.st.image,c=".image";n.types.push("image"),x(g+c,function(){n.currItem.type==="image"&&a.cursor&&s.addClass(a.cursor)}),x(b+c,function(){a.cursor&&s.removeClass(a.cursor),r.off("resize"+j)}),x("Resize"+c,n.resizeImage),n.isLowIE&&x("AfterChange",n.resizeImage)},resizeImage:function(){var a=n.currItem;if(!a||!a.img)return;if(n.st.image.verticalFit){var b=0;n.isLowIE&&(b=parseInt(a.img.css("padding-top"),10)+parseInt(a.img.css("padding-bottom"),10)),a.img.css("max-height",n.wH-b)}},_onImageHasSize:function(a){a.img&&(a.hasSize=!0,E&&clearInterval(E),a.isCheckingImgSize=!1,z("ImageHasSize",a),a.imgHidden&&(n.content&&n.content.removeClass("mfp-loading"),a.imgHidden=!1))},findImageSize:function(a){var b=0,c=a.img[0],d=function(e){E&&clearInterval(E),E=setInterval(function(){if(c.naturalWidth>0){n._onImageHasSize(a);return}b>200&&clearInterval(E),b++,b===3?d(10):b===40?d(50):b===100&&d(500)},e)};d(1)},getImage:function(b,c){var d=0,e=function(){b&&(b.img[0].complete?(b.img.off(".mfploader"),b===n.currItem&&(n._onImageHasSize(b),n.updateStatus("ready")),b.hasSize=!0,b.loaded=!0,z("ImageLoadComplete")):(d++,d<200?setTimeout(e,100):f()))},f=function(){b&&(b.img.off(".mfploader"),b===n.currItem&&(n._onImageHasSize(b),n.updateStatus("error",g.tError.replace("%url%",b.src))),b.hasSize=!0,b.loaded=!0,b.loadError=!0)},g=n.st.image,h=c.find(".mfp-img");if(h.length){var i=document.createElement("img");i.className="mfp-img",b.img=a(i).on("load.mfploader",e).on("error.mfploader",f),i.src=b.src,h.is("img")&&(b.img=b.img.clone()),b.img[0].naturalWidth>0&&(b.hasSize=!0)}return n._parseMarkup(c,{title:F(b),img_replaceWith:b.img},b),n.resizeImage(),b.hasSize?(E&&clearInterval(E),b.loadError?(c.addClass("mfp-loading"),n.updateStatus("error",g.tError.replace("%url%",b.src))):(c.removeClass("mfp-loading"),n.updateStatus("ready")),c):(n.updateStatus("loading"),b.loading=!0,b.hasSize||(b.imgHidden=!0,c.addClass("mfp-loading"),n.findImageSize(b)),c)}}});var G,H=function(){return G===undefined&&(G=document.createElement("p").style.MozTransform!==undefined),G};a.magnificPopup.registerModule("zoom",{options:{enabled:!1,easing:"ease-in-out",duration:300,opener:function(a){return a.is("img")?a:a.find("img")}},proto:{initZoom:function(){var a=n.st.zoom,d=".zoom",e;if(!a.enabled||!n.supportsTransition)return;var f=a.duration,g=function(b){var c=b.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),d="all "+a.duration/1e3+"s "+a.easing,e={position:"fixed",zIndex:9999,left:0,top:0,"-webkit-backface-visibility":"hidden"},f="transition";return e["-webkit-"+f]=e["-moz-"+f]=e["-o-"+f]=e[f]=d,c.css(e),c},h=function(){n.content.css("visibility","visible")},i,j;x("BuildControls"+d,function(){if(n._allowZoom()){clearTimeout(i),n.content.css("visibility","hidden"),e=n._getItemToZoom();if(!e){h();return}j=g(e),j.css(n._getOffset()),n.wrap.append(j),i=setTimeout(function(){j.css(n._getOffset(!0)),i=setTimeout(function(){h(),setTimeout(function(){j.remove(),e=j=null,z("ZoomAnimationEnded")},16)},f)},16)}}),x(c+d,function(){if(n._allowZoom()){clearTimeout(i),n.st.removalDelay=f;if(!e){e=n._getItemToZoom();if(!e)return;j=g(e)}j.css(n._getOffset(!0)),n.wrap.append(j),n.content.css("visibility","hidden"),setTimeout(function(){j.css(n._getOffset())},16)}}),x(b+d,function(){n._allowZoom()&&(h(),j&&j.remove(),e=null)})},_allowZoom:function(){return n.currItem.type==="image"},_getItemToZoom:function(){return n.currItem.hasSize?n.currItem.img:!1},_getOffset:function(b){var c;b?c=n.currItem.img:c=n.st.zoom.opener(n.currItem.el||n.currItem);var d=c.offset(),e=parseInt(c.css("padding-top"),10),f=parseInt(c.css("padding-bottom"),10);d.top-=a(window).scrollTop()-e;var g={width:c.width(),height:(p?c.innerHeight():c[0].offsetHeight)-f-e};return H()?g["-moz-transform"]=g.transform="translate("+d.left+"px,"+d.top+"px)":(g.left=d.left,g.top=d.top),g}}});var I=function(a){var b=n.items.length;return a>b-1?a-b:a<0?b+a:a},J=function(a,b,c){return a.replace(/%curr%/gi,b+1).replace(/%total%/gi,c)};a.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var c=n.st.gallery,d=".mfp-gallery",e=Boolean(a.fn.mfpFastClick);n.direction=!0;if(!c||!c.enabled)return!1;v+=" mfp-gallery",x(g+d,function(){c.navigateByImgClick&&n.wrap.on("click"+d,".mfp-img",function(){if(n.items.length>1)return n.next(),!1}),t.on("keydown"+d,function(a){a.keyCode===37?n.prev():a.keyCode===39&&n.next()})}),x("UpdateStatus"+d,function(a,b){b.text&&(b.text=J(b.text,n.currItem.index,n.items.length))}),x(f+d,function(a,b,d,e){var f=n.items.length;d.counter=f>1?J(c.tCounter,e.index,f):""}),x("BuildControls"+d,function(){if(n.items.length>1&&c.arrows&&!n.arrowLeft){var b=c.arrowMarkup,d=n.arrowLeft=a(b.replace(/%title%/gi,c.tPrev).replace(/%dir%/gi,"left")).addClass(m),f=n.arrowRight=a(b.replace(/%title%/gi,c.tNext).replace(/%dir%/gi,"right")).addClass(m),g=e?"mfpFastClick":"click";d[g](function(){n.prev()}),f[g](function(){n.next()}),n.isIE7&&(y("b",d[0],!1,!0),y("a",d[0],!1,!0),y("b",f[0],!1,!0),y("a",f[0],!1,!0)),n.container.append(d.add(f))}}),x(h+d,function(){n._preloadTimeout&&clearTimeout(n._preloadTimeout),n._preloadTimeout=setTimeout(function(){n.preloadNearbyImages(),n._preloadTimeout=null},16)}),x(b+d,function(){t.off(d),n.wrap.off("click"+d),n.arrowLeft&&e&&n.arrowLeft.add(n.arrowRight).destroyMfpFastClick(),n.arrowRight=n.arrowLeft=null})},next:function(){n.direction=!0,n.index=I(n.index+1),n.updateItemHTML()},prev:function(){n.direction=!1,n.index=I(n.index-1),n.updateItemHTML()},goTo:function(a){n.direction=a>=n.index,n.index=a,n.updateItemHTML()},preloadNearbyImages:function(){var a=n.st.gallery.preload,b=Math.min(a[0],n.items.length),c=Math.min(a[1],n.items.length),d;for(d=1;d<=(n.direction?c:b);d++)n._preloadItem(n.index+d);for(d=1;d<=(n.direction?b:c);d++)n._preloadItem(n.index-d)},_preloadItem:function(b){b=I(b);if(n.items[b].preloaded)return;var c=n.items[b];c.parsed||(c=n.parseEl(b)),z("LazyLoad",c),c.type==="image"&&(c.img=a('<img class="mfp-img" />').on("load.mfploader",function(){c.hasSize=!0}).on("error.mfploader",function(){c.hasSize=!0,c.loadError=!0,z("LazyLoadError",c)}).attr("src",c.src)),c.preloaded=!0}}});var K="retina";a.magnificPopup.registerModule(K,{options:{replaceSrc:function(a){return a.src.replace(/\.\w+$/,function(a){return"@2x"+a})},ratio:1},proto:{initRetina:function(){if(window.devicePixelRatio>1){var a=n.st.retina,b=a.ratio;b=isNaN(b)?b():b,b>1&&(x("ImageHasSize."+K,function(a,c){c.img.css({"max-width":c.img[0].naturalWidth/b,width:"100%"})}),x("ElementParse."+K,function(c,d){d.src=a.replaceSrc(d,b)}))}}}}),function(){var b=1e3,c="ontouchstart"in window,d=function(){r.off("touchmove"+f+" touchend"+f)},e="mfpFastClick",f="."+e;a.fn.mfpFastClick=function(e){return a(this).each(function(){var g=a(this),h;if(c){var i,j,k,l,m,n;g.on("touchstart"+f,function(a){l=!1,n=1,m=a.originalEvent?a.originalEvent.touches[0]:a.touches[0],j=m.clientX,k=m.clientY,r.on("touchmove"+f,function(a){m=a.originalEvent?a.originalEvent.touches:a.touches,n=m.length,m=m[0];if(Math.abs(m.clientX-j)>10||Math.abs(m.clientY-k)>10)l=!0,d()}).on("touchend"+f,function(a){d();if(l||n>1)return;h=!0,a.preventDefault(),clearTimeout(i),i=setTimeout(function(){h=!1},b),e()})})}g.on("click"+f,function(){h||e()})})},a.fn.destroyMfpFastClick=function(){a(this).off("touchstart"+f+" click"+f),c&&r.off("touchmove"+f+" touchend"+f)}}()})(window.jQuery||window.Zepto)
 /**//*! GremlinJS 0.6.0 (2013-11-10) - http://grml.in - Licensed under MIT license  */!function(a,b){b["true"]=a,!function(a){window.onDomReady=a()}(function(){"use strict";function a(b){if(!v){if(!g.body)return d(a);for(v=!0;b=w.shift();)d(b)}}function b(b){(t||b.type===i||g[m]===l)&&(c(),a())}function c(){t?(g[s](q,b,j),f[s](i,b,j)):(g[o](r,b),f[o](k,b))}function d(a,b){setTimeout(a,+b>=0?b:1)}function e(a){v?d(a):w.push(a)}var f=window,g=f.document,h=g.documentElement,i="load",j=!1,k="on"+i,l="complete",m="readyState",n="attachEvent",o="detachEvent",p="addEventListener",q="DOMContentLoaded",r="onreadystatechange",s="removeEventListener",t=p in g,u=j,v=j,w=[];if(g[m]===l)d(a);else if(t)g[p](q,b,j),f[p](i,b,j);else{g[n](r,b),f[n](k,b);try{u=null==f.frameElement&&h}catch(x){}u&&u.doScroll&&function y(){if(!v){try{u.doScroll("left")}catch(b){return d(y,50)}c(),a()}}()}return e.version="1.3",e});var c;c=function(){function a(){this._events={}}return a.prototype.on=function(a,b){return this._events[a]=this._events[a]||[],this._events[a].push(b)},a.prototype.off=function(a,b){return!1!=a in this._events?this._events[a].splice(this._events[a].indexOf(b),1):void 0},a.prototype.emit=function(a){var b,c;if(this._events=this._events||{},!1!=a in this._events){for(b=0,c=[];b<this._events[a].length;)this._events[a][b].apply(this,Array.prototype.slice.call(arguments,1)),c.push(b++);return c}},a}();var d={}.hasOwnProperty,e=[].slice,f={};f.Helper=function(){function a(){}var b;return b=function(a,b){var c,e;for(c in b)d.call(b,c)&&(e=b[c],a[c]=e);return a},a.extend=function(){var a,b,c,d,f,g,h;for(d=arguments[0],c=2<=arguments.length?e.call(arguments,1):[],g=0,h=c.length;h>g;g++)for(a in b=c[g])f=b[a],d[a]=f;return d},a.mixin=function(a,c){return b(a.prototype,c)},a.clone=function(a){var b,c;if(null==a||"object"!=typeof a)return a;if(a instanceof Date)return new Date(a.getTime());if(a instanceof RegExp)return b="",null!=a.global&&(b+="g"),null!=a.ignoreCase&&(b+="i"),null!=a.multiline&&(b+="m"),null!=a.sticky&&(b+="y"),RegExp(a.source,b);c=new a.constructor;for(b in a)c[b]=f.Helper.clone(a[b]);return c},a.hasClass=function(a,b){return b=b.trim(),null===a.className.match(RegExp("(\\s|^)"+b+"(\\s|$)"))?!1:!0},a.addClass=function(a,b){return b=b.trim(),f.Helper.hasClass(a,b)||(a.className+=" "+b),a.className=a.className.trim()},a.removeClass=function(a,b){var c;return b=b.trim(),f.Helper.hasClass(a,b)?(c=RegExp("(\\s|^)"+b+"(\\s|$)"),a.className=a.className.replace(c," "),a.className=a.className.trim()):void 0},a.addStyleSheet=function(a){var b,c;return b=document.getElementsByTagName("head")[0],c=document.createElement("style"),c.type="text/css",c.styleSheet?c.styleSheet.cssText=a:c.appendChild(document.createTextNode(a)),b.appendChild(c)},a}(),f.Debug=function(){function a(a){this._isDebug=a,this._gremlins=[],this._broken=[],this._logEl=null,this._createLog(),this._createConsole()}var b,c,d,e,g;return b="debug error info log warn dir dirxml trace assert count markTimeline profile profileEnd time timeEnd timeStamp group groupCollapsed groupEnd".split(" "),c="function"==typeof Function.prototype.bind,d="function"==typeof(null!=(g=window.console)?g.log:void 0),e=function(){},a.prototype._createLog=function(){return this._isDebug?(this._logEl=document.createElement("div"),this._logEl.className="gremlinjs-log",document.body.appendChild(this._logEl)):void 0},a.prototype._createConsole=function(){var a,g,h,i;if(this.console={},this._isDebug&&f.Helper.addStyleSheet(".gremlinjs-log {\nposition: fixed;\nbottom: 0;\nleft: 0;\nbackground: #fff;\npadding: 4px 6px;\n-webkit-box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.3);\nbox-shadow: 0px 0px 4px 0px rgba(0,0,0,0.3);\nz-index: 9999;\n}\n\n.gremlinjs-log p {\n  font-size: 12px;\n  color: #666666;\n  margin: 0;\n  padding: 0;\n}\n\n.gremlinjs-log p span {\n  display: inline-block;\n  margin: 0 5px;\n  cursor: help;\n}\n\n.gremlinjs-log p .gremlinjs-log-ready{\ncolor: #41bb19;\n}\n\n.gremlinjs-log p .gremlinjs-log-waiting{\ncolor: #8d46b0;\n}\n\n.gremlinjs-log p .gremlinjs-log-pending{\ncolor: #fff;\nbackground: #fe781e;\npadding: 0 4px;\n}\n\n.gremlinjs-log p .gremlinjs-log-error{\ncolor: #fff;\nbackground: #f50f43;\npadding: 0 4px;\n}\n\n*[data-gremlin-found] {\noutline: 2px solid #41bb19;\n}\n\n*[data-gremlin-found]::before {\ncolor: #41bb19;\nfont-family: monospace;\ncontent: '[' attr(data-gremlin-found) '] ready';\nposition: absolute;\nmargin-top: -14px;\nfont-size: 11px;\nfont-weight: bold;\n}\n\n.gremlin-definition-pending {\noutline: 2px solid #fe781e;\n}\n.gremlin-definition-pending::before {\ncontent: '[' attr(data-gremlin-found) '] definition pendig...';\ncolor: #fe781e;\n}\n.gremlin-error {\noutline: 2px solid red;\n}\n\n.gremlin-error[data-gremlin-found]::before {\ncontent: 'faulty gremlin!';\ncolor: red;\n}"),d&&this._isDebug){for(i=[],g=0,h=b.length;h>g;g++)a=b[g],c?i.push(this.console[a]=console[a]?Function.prototype.bind.call(console[a],console):e):void 0!==console[a]?i.push(this.console[a]=function(){return Function.prototype.apply.call(console[a],console,arguments)}):i.push(this.console[a]=e);return i}for(i=[],g=0,h=b.length;h>g;g++)a=b[g],i.push(this.console[a]=e);return i},a.prototype.registerGremlin=function(a){return this._gremlins.push(a)},a.prototype.reportBrokenGremlin=function(a){return this._broken.push(a)},a.prototype.updateGremlinLog=function(){var a=this;return this._isDebug&&this._logEl?window.setTimeout(function(){var b,c,d,e,f,g,h,i,j,k,l;for(f=0,g={},h=0,i={},d=0,e={},b=a._broken.length,l=a._gremlins,j=0,k=l.length;k>j;j++)c=l[j],c.hasGremlin()?(f++,a._addName(g,c.name)):c.isLazy?(h++,a._addName(i,c.name)):(d++,a._addName(e,c.name));return b='<p>\n<span title="'+a._getTitle(g)+"\" class='gremlinjs-log-ready'><strong>"+f+'</strong> ready</span>\n<span title="'+a._getTitle(i)+"\" class='gremlinjs-log-waiting'><strong>"+h+'</strong> lazy waiting</span>\n<span title="'+a._getTitle(e)+"\" class='"+(d>0?"gremlinjs-log-pending":"")+"'><strong>"+d+"</strong> pending</span>\n<span class='"+(b>0?"gremlinjs-log-error":"")+"'><strong>"+b+"</strong> error(s)</span>\n</p>",a._logEl.innerHTML=b},50):void 0},a.prototype._addName=function(a,b){return a[b]?a[b]++:a[b]=1},a.prototype._getTitle=function(a){var b,c,d;c="";for(b in a)d=a[b],c+=""+d+"x "+b+" \n";return""===c?"":"Gremlins: \n"+c},a}();var g={};g.Configuration=function(){function a(a){this._options=f.Helper.extend({},b,a)}var b;return b={debug:!1},a.prototype.get=function(a){var b;return null!=(b=this._options[a])?b:null},a.options={DEBUG:"debug",AUTOLOAD:"autoload"},a}(),f.ready=window.onDomReady;var d={}.hasOwnProperty,h=function(a,b){function c(){this.constructor=a}for(var e in b)d.call(b,e)&&(a[e]=b[e]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},i={};i.Gizmo=function(){function a(a,b,c,d){this.el=a,this.data=b,this.id=c,d.call(this)}var b;return b=function(a,b,c,e){var g;if("function"!=typeof b)throw Error("The second parameter when defining a gremlin has to be the constructor function!");if("undefined"!=typeof c&&"object"!=typeof c)throw Error("The third parameter when defining a gremlin has to be an object providing the instance members of the gremlin!");if("undefined"!=typeof e&&"object"!=typeof e)throw Error("The fourth parameter when defining a gremlin has to be an object providing the static members of the gremlin!");a=function(a){function c(){c.__super__.constructor.apply(this,arguments),b.call(this)}return h(c,a),c}(a),f.Helper.mixin(a,c);for(g in e)d.call(e,g)&&(c=e[g],a[g]=c);return a},a.extend=function(a,c,d){return b(this,a,c,d)},a.prototype.data=null,a.prototype.el=null,a.prototype.id=null,a}();var j={};j.ModuleCollection=function(){function a(){}var b,c,d;return d={},c={},b=function(a,b){var e,f,g;if(!c[a]){switch(e=b.include,typeof e){case"string":f=[e];break;case"object":f=Array.isArray(e)?e:[];break;default:f=[]}c[a]=function(){var a,b,c,e;for(e=[],a=0,b=f.length;b>a;a++)g=f[a],e.push(function(){if(null!=(c=d[g]))return c;throw Error("The module "+g+" does not exists!")}());return e}()}return c[a]},a.registerModule=function(a){return d[a.name]=a},a.extendGizmo=function(a,c){var d,e,f,g,h;for(e=b(a,c),h=[],f=0,g=e.length;g>f;f++)d=e[f],h.push(d.extend(c));return h},a.bindGizmo=function(a,c){var d,e,f,g,h;for(e=b(a,c.constructor),h=[],f=0,g=e.length;g>f;f++)d=e[f],h.push(d.bind(c));return h},a}(),i.Pool=function(){function a(){}var b,c;return c=null,b={},a=function(){function a(){}return a.prototype.get=function(a){var c;return null!=(c=b[a])?c:null},a.prototype.set=function(a,c){if("undefined"!=typeof b[a])throw Error("Trying to add new Gremlin definition, but a definition for "+a+" already exists.");return j.ModuleCollection.extendGizmo(a,c),b[a]=c},a.prototype.addClass=function(a,b){if("string"!=typeof a)throw Error("Please provide the name of the gremlin!");if("function"!=typeof b)throw Error("When adding a gremlin, you have to provide a constructor function!");return this.set(a,b),b},a}(),a.getInstance=function(){return null!=c?c:c=new a},a}();var k=function(a,b){return function(){return a.apply(b,arguments)}},l={clocks:{}};l.clocks.LegacyTimeoutClock=function(){function a(){this._onInterval=k(this._onInterval,this)}return a.prototype.observe=function(){return this._initiateInterval()},a.prototype._initiateInterval=function(){return this._interval=window.setTimeout(this._onInterval,500)},a.prototype._onInterval=function(){return this.onMutation(),this._initiateInterval()},a.prototype.onMutation=function(){},a}();var m={};m.NameProvider=function(){function a(){}var b;return b=function(a,b){var c;return"function"==typeof a.hasAttribute?a.hasAttribute(b):(c=a.getAttributeNode(b),!(!c||!c.specified&&!c.nodeValue))},a.DATA_NAME_ATTR="data-gremlin",a.isGremlin=function(a){return b(a,"data-gremlin")},a.getNames=function(a){var b,c;if(b=a.getAttribute("data-gremlin"),""===b)return b=null!=(c=a.outerHTML)?c:"",m.NameProvider.flagBrokenElement(a),r.debug.console.log("Couldn't process gremlin element, no gremlin names available, 'data-gremlin' is empty!\n"+b),[];var d,e;for(d=b.split(","),e=[],c=0,b=d.length;b>c;c++)a=d[c],e.push(a.trim());return e},a.flagBrokenElement=function(a){return f.Helper.addClass(a,"gremlin-error"),m.NameProvider.flagProcessedElement(a),r.debug.reportBrokenGremlin(a)},a.flagProcessedElement=function(a){var b;return b=a.getAttribute("data-gremlin"),a.removeAttribute("data-gremlin"),a.setAttribute("data-gremlin-found",b)},a}(),l.clocks.cssAnimationStyle=function(a){return a="@keyframes {{ANIMATION_NAME}} {\n  0%   { opacity: 0.9; }\n  100% { opacity: 1; }\n}\n\n@-moz-keyframes {{ANIMATION_NAME}} {\n  0%   { opacity: 0.9; }\n  100% { opacity: 1; }\n}\n\n@-webkit-keyframes {{ANIMATION_NAME}} {\n  0%   { opacity: 0.9; }\n  100% { opacity: 1; }\n}\n\n@-o-keyframes {{ANIMATION_NAME}} {\n  0%   { opacity: 0.9; }\n  100% { opacity: 1; }\n}\n\n*[{{GREMLIN_ATTRIBUTE}}] {\n  animation-duration: 1ms;\n  -o-animation-duration: 1ms;\n  -moz-animation-duration: 1ms;\n  -webkit-animation-duration: 1ms;\n  animation-name: {{ANIMATION_NAME}};\n  -o-animation-name: {{ANIMATION_NAME}};\n  -moz-animation-name: {{ANIMATION_NAME}};\n  -webkit-animation-name: {{ANIMATION_NAME}};\n}".replace(/{{ANIMATION_NAME}}/g,a),a.replace(/{{GREMLIN_ATTRIBUTE}}/g,m.NameProvider.DATA_NAME_ATTR)},k=function(a,b){return function(){return a.apply(b,arguments)}},l.clocks.CssAnimationClock=function(){function a(){this._onAnimation=k(this._onAnimation,this);var a;a=l.clocks.cssAnimationStyle(b),f.Helper.addStyleSheet(a)}var b,c;return b="gremlinInserted",c=["animationstart","webkitAnimationStart","oanimationstart"],a.prototype.observe=function(){var a,b,d,e;for(e=[],b=0,d=c.length;d>b;b++)a=c[b],e.push(document.body.addEventListener(a,this._onAnimation,!1));return e},a.prototype._onAnimation=function(a){return a.animationName===b?this.onMutation():void 0},a.prototype.onMutation=function(){},a}(),k=function(a,b){return function(){return a.apply(b,arguments)}},l.clocks.MutationObserverClock=function(){function a(){if(this._onMutation=k(this._onMutation,this),null===b)throw Error("Mutation Observer not available")}var b;return b=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver||null,a.prototype.observe=function(){return new b(this._onMutation).observe(document.body,{childList:!0,subtree:!0})},a.prototype._onMutation=function(a){var b,c,d,e;for(e=[],c=0,d=a.length;d>c;c++){if(b=a[c],"childList"===b.type){this.onMutation();break}e.push(void 0)}return e},a.prototype.onMutation=function(){},a}(),f.FeatureDetector=function(){function a(){}return a.hasQuerySelectorAll="undefined"!=typeof document.querySelectorAll,a.hasMutationObserver=!(!window.MutationObserver&&!window.WebKitMutationObserver&&!window.MozMutationObserver),a.hasGetClientRect=void 0!==document.documentElement.getBoundingClientRect,a.hasCssAnimations=function(){var a,b,c,d;if(c=document.documentElement,a=!1,b=["Webkit","Moz","O","ms","Khtml"],c.style.animationName&&(a=!0),!1===a)for(d=0;d<b.length;){if(void 0!==c.style[b[d]+"AnimationName"]){a=b[d],a.toLowerCase(),a=!0;break}d++}return a}(),a}(),l.clocks.ClockFactory=function(){function a(){}var b;return b=f.FeatureDetector.hasCssAnimations,a.createClock=function(){return new(b?l.clocks.CssAnimationClock:l.clocks.LegacyTimeoutClock)},a}();var n,k=function(a,b){return function(){return a.apply(b,arguments)}},d={}.hasOwnProperty,h=function(a,b){function c(){this.constructor=a}for(var e in b)d.call(b,e)&&(a[e]=b[e]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a};n=function(){function a(){}var b;return b=null,a=function(a){function b(){this._onMutation=k(this._onMutation,this),b.__super__.constructor.apply(this,arguments),this._clock=l.clocks.ClockFactory.createClock(),this._clock.onMutation=this._onMutation}return h(b,a),b.prototype._onMutation=function(){return this.emit(b.ON_MUTATION)},b.prototype.observe=function(){return this._clock.observe(),this._onMutation()},b}(c),a.ON_MUTATION="ON_MUTATION",a.get=function(){return null!=b?b:b=new a},a}.call(this),l.ElementList=function(){function a(a){this._attributeName=a}var b,c,d;return c=function(){function a(){}return a.get=function(a){var b,c,d,e;for(b=document.querySelectorAll("["+m.NameProvider.DATA_NAME_ATTR+"]"),e=[],c=0,d=b.length;d>c;c++)a=b[c],e.push(a);return e},a}(),b=function(){function a(){}return a.get=function(a){var b,c,d,e;for(b=document.getElementsByTagName("*"),e=[],c=0,d=b.length;d>c;c++)a=b[c],m.NameProvider.isGremlin(a)&&e.push(a);return e},a}(),d=f.FeatureDetector.hasQuerySelectorAll?c:b,a.prototype.getList=function(){return d.get(this._attributeName)},a}.call(this),k=function(a,b){return function(){return a.apply(b,arguments)}},l.DomObserver=function(){function a(){this._handleMutation=k(this._handleMutation,this),this._elementList=new l.ElementList}return a.prototype._bindMutations=function(){var a;return a=n.get(),a.on(n.ON_MUTATION,this._handleMutation),a.observe()},a.prototype._handleMutation=function(){var a;return a=this._elementList.getList(),0<a.length?this.onNewElements(a):void 0},a.prototype.observe=function(){return this._bindMutations()},a.prototype.onNewElements=function(){},a}(),m.GremlinFactory=function(){function a(){}var b,c;return c=function(){var a;return a=0,function(){return a++}}(),b=function(a){return function(){return j.ModuleCollection.bindGizmo(a,this)}},a.getInstance=function(a,d,e){var f;if(f=i.Pool.getInstance().get(a),"function"==typeof f){if(a=new f(d,e.toObject(),c(),b(a)),null===a.el)throw Error("Abstract gremlin class not called. Did you miss a super in your coffeescript-class?");return a}return null},a}(),f.ElementData={},f.ElementData.DataValue=function(){function a(a){this._dataString=a}var b;return b=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,a.prototype.parse=function(){var a,c;if(c=a=this._dataString,"string"==typeof this._dataString)try{c="true"===a?!0:"false"===a?!1:"null"===a?null:+a+""===a?+a:b.test(a)?JSON.parse(a):a}catch(d){}return c},a}(),d={}.hasOwnProperty,f.ElementData.ElementData=function(){function a(a){this._el=a,this._obj=c(this._el)}var b,c;return b=function(a){return a.toLowerCase().replace(/-(.)/g,function(a,b){return b.toUpperCase()})},c=function(a){var c,e,g,h;h={},void 0!==a.dataset?c=a.dataset:(c={},[].filter.call(a.attributes,function(d){var e;return(e=/^data-/.test(d.name))&&(c[b(d.name.substring(5))]=a.getAttribute(d.name)),e}));for(g in c)d.call(c,g)&&(e=c[g],e=new f.ElementData.DataValue(e),h[g]=e.parse());return h},a.prototype.get=function(a){var b;return null!=(b=this._obj[a])?b:null},a.prototype.toObject=function(){return f.Helper.clone(this._obj)},a}();var o;o=f.FeatureDetector.hasGetClientRect,m.GremlinDomElement=function(){function a(a,d){this._el=a,this._name=d,this._data=new f.ElementData.ElementData(this._el),this.isLazy=this._isLazy=!0===this._data.get(c)?!0:!1,this.name=this._name,this._triggeredPending=!1,f.Helper.addClass(this._el,b),r.debug.registerGremlin(this),r.emit(r.ON_ELEMENT_FOUND,this._el)}var b,c;return c="gremlinLazy",b="gremlin-loading",a.prototype._gremlinInstance=null,a.prototype.check=function(){return this._isInViewport()?this._create():void 0},a.prototype._isInViewport=function(){var a;return this._isLazy&&o?(a=document.documentElement.clientHeight,300>this._el.getBoundingClientRect().top-a):!0},a.prototype._create=function(){return this._gremlinInstance=m.GremlinFactory.getInstance(this._name,this._el,this._data),this.hasGremlin()?(f.Helper.removeClass(this._el,b),f.Helper.removeClass(this._el,"gremlin-definition-pending"),f.Helper.addClass(this._el,"gremlin-ready"),r.emit(r.ON_GREMLIN_LOADED,this._el)):this._triggeredPending?void 0:(this._triggeredPending=!0,f.Helper.addClass(this._el,"gremlin-definition-pending"),r.debug.console.info("Gremlin <"+this._name+"> found in the dom, but there is no definition for it at the moment."),r.emit(r.ON_DEFINITION_PENDING,this._el))},a.prototype.hasGremlin=function(){return null!==this._gremlinInstance},a}(),k=function(a,b){return function(){return a.apply(b,arguments)}},m.GremlinCollection=function(){function a(){this._scrollHandler=k(this._scrollHandler,this),this._queue=[],this._bindScroll(),this._scrollTimer=this._didScroll=!1}return a.prototype._queue=null,a.prototype._bindScroll=function(){return window.addEventListener?window.addEventListener("scroll",this._scrollHandler,!1):window.attachEvent?window.attachEvent("onscroll",this._scrollHandler):void 0},a.prototype.add=function(a){var b,c,d;for(c=0,d=a.length;d>c;c++)b=a[c],this._addGremlinElements(b);return this._processQueue()},a.prototype._addGremlinElements=function(a){var b,c,d,e,f;for(c=m.NameProvider.getNames(a),m.NameProvider.flagProcessedElement(a),f=[],d=0,e=c.length;e>d;d++)b=c[d],f.push(this._queue.push(new m.GremlinDomElement(a,b)));return f},a.prototype._processQueue=function(){var a,b,c,d,e;for(b=[],e=this._queue,c=0,d=e.length;d>c;c++)a=e[c],a.check(),a.hasGremlin()||b.push(a);return this._queue=b,r.debug.updateGremlinLog()},a.prototype.process=function(){return this._processQueue()},a.prototype._scrollHandler=function(){var a=this;return 0===this._queue.length?!0:(this._didScroll||(this._scrollTimer=setInterval(function(){return a._didScroll?(a._didScroll=!1,clearTimeout(a._scrollTimer),a.process()):void 0},250)),this._didScroll=!0)},a}();var p,k=function(a,b){return function(){return a.apply(b,arguments)}};p=function(){function a(){this._onNew=k(this._onNew,this);var a,c;a=null!=(c=new f.ElementData.ElementData(document.body).get(b))?c:{},this.configuration=new g.Configuration(a),this._observer=new l.DomObserver,this._coll=new m.GremlinCollection,this._observer.onNewElements=this._onNew}var b;return b="gremlinConfig",a.prototype._onNew=function(a){return this._coll.add(a)},a.prototype.start=function(){return this._observer.observe()},a.prototype.refresh=function(){return this._coll.process()},a}(),j.Module=function(){return function(a,b){var c,d;if(!(this instanceof j.Module))return function(a,b,c){return c.prototype=a.prototype,c=new c,a=a.apply(c,b),Object(a)===a?a:c}(j.Module,arguments,function(){});if(d="function"==typeof b.extend,c="function"==typeof b.bind,!d)throw Error("Missing .extend method in your module "+a);if(!c)throw Error("Missing .bind method in your module "+a);this.name=a,this.extend=b.extend,this.bind=b.bind,j.ModuleCollection.registerModule(this)}}();var q={};q.Package=function(){function a(a,c){return this instanceof q.Package?(this._package=b(a,c),void 0):function(a,b,c){return c.prototype=a.prototype,c=new c,a=a.apply(c,b),Object(a)===a?a:c}(q.Package,arguments,function(){})}var b,c;return c={},b=function(a,b){var d,e,f,g,h,i;for(null==b&&(b=null),e=a.split("."),f=e.pop(),g=c,h=0,i=e.length;i>h;h++)d=e[h],g=g[d]||(g[d]={});return g[f]=b||g[f]||(g[f]={})},a.require=function(a){return b(a)},a}(),f.polyfill={},"function"!=typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}),Array.prototype.filter||(Array.prototype.filter=function(a,b){var c,d,e,f,g;if("undefined"==typeof this||null===this)throw new TypeError;if(f=Object(this),d=f.length>>>0,"function"!=typeof a)throw new TypeError;for(e=[],c=0;d>c;)c in f&&(g=f[c],a.call(b,g,c,f)&&e.push(g)),c++;return e}),Array.isArray||(Array.isArray=function(a){return"[object Array]"===Object.prototype.toString.call(a)}),Array.prototype.indexOf||(Array.prototype.indexOf=function(a){if(null==this)throw new TypeError;var b,c=Object(this),d=c.length>>>0;if(0===d)return-1;if(b=0,1<arguments.length&&(b=Number(arguments[1]),b!=b?b=0:0!=b&&1/0!=b&&-1/0!=b&&(b=(b>0||-1)*Math.floor(Math.abs(b)))),b>=d)return-1;for(b=b>=0?b:Math.max(d-Math.abs(b),0);d>b;b++)if(b in c&&c[b]===a)return b;return-1});var r,d={}.hasOwnProperty,h=function(a,b){function c(){this.constructor=a}for(var e in b)d.call(b,e)&&(a[e]=b[e]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a};r=function(){var a,b;return a=null,b=new(function(b){function c(){c.__super__.constructor.apply(this,arguments),this.debug=new f.Debug(!1)}return h(c,b),c.prototype.ON_ELEMENT_FOUND="elementfound",c.prototype.ON_DEFINITION_PENDING="definitionpending",c.prototype.ON_GREMLIN_LOADED="gremlinloaded",c.prototype.add=function(b,c){return c=i.Pool.getInstance().addClass(b,c),null!=a&&a.refresh(),c},c.prototype.Gizmo=i.Gizmo,c.prototype.Helper=f.Helper,c.prototype.Module=j.Module,c.prototype.Package=q.Package,c}(c)),f.ready(function(){var c;return a=new p,(c=a.configuration.get(g.Configuration.options.DEBUG))&&(b.debug=new f.Debug(c)),a.start(),b.debug.console.log("gremlin.js up and running...")}),b}(),window.Gremlin=r,void 0===window.G&&(window.G=window.Gremlin),"function"==typeof window.define&&window.define.amd&&define("Gremlin",[],function(){return r})}({},function(){return this}());
 /**//*! gremlinjs-interests - v0.2.0 - 2013-11-10 */(function(){var a,b;a=function(){function a(){}var b;return b={},a.registerHandler=function(a,c,d){var e;return b[a]=null!=(e=b[a])?e:[],b[a].push({handler:c,ctx:d})},a.dispatch=function(a,c){return void 0!==b[a]?window.setTimeout(function(){var d,e,f,g,h;for(g=b[a],h=[],e=0,f=g.length;f>e;e++)d=g[e],h.push(d.handler.call(d.ctx,c));return h},10):void 0},a}(),b=function(){var b,c,d,e,f;d=null!=(e=this.constructor.interests)?e:{},f=[];for(c in d){if(b=d[c],"function"!=typeof this[b])throw new Error('Handler "'+b+'" for the interest "'+c+'" is missing!');f.push(a.registerHandler(c,this[b],this))}return f},Gremlin.Module("interests",{extend:function(b){return b.prototype.emit=function(b,c){return a.dispatch(b,c)}},bind:function(a){return b.call(a)}})}).call(this);
 /**//*! gremlinjs-jquery - v0.3.0 - 2013-11-10 */(function(){var a,b,c={}.hasOwnProperty;a=function(){var a,b,d,e;if("object"==typeof this.constructor.elements){d=this.constructor.elements,e=[];for(b in d)c.call(d,b)&&(a=d[b],e.push(this[a]=this.$el.find(b)));return e}},b=function(){var a,b,d,e,f,g=this;if(a=this,"object"==typeof this.constructor.events){f=this.constructor.events,e=function(b,c){var d,e,f,h,i;if("string"!=typeof c)throw new TypeError("Event selectors have to be referenced by strings!");if("function"!=typeof g[b])throw new TypeError("Event '"+c+"' can't be bound to '"+g.name+"."+b+"', as the type is "+typeof g[b]);return f=g[b],e=c.indexOf(" "),h=-1!==e,d=h?c.substr(0,e):c,i=h?c.substr(e+1):null,g.$el.on(d,i,function(b){return f.call(a,b,this),!0})};for(b in f)c.call(f,b)&&(d=f[b],e(d,b));return!0}},Gremlin.Module("jquery",{extend:function(){},bind:function(c){return c.$el=$(c.el),a.call(c),b.call(c)}})}).call(this);


 /**//*global jQuery */
/*jshint multistr:true browser:true */
/*!
* FitVids 1.0.3
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
* Date: Thu Sept 01 18:00:00 2011 -0500
*/

(function( $ ){

  "use strict";

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null
    };

    if(!document.getElementById('fit-vids-style')) {

      var div = document.createElement('div'),
          ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0],
          cssStyles = '&shy;<style>.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}</style>';

      div.className = 'fit-vids-style';
      div.id = 'fit-vids-style';
      div.style.display = 'none';
      div.innerHTML = cssStyles;

      ref.parentNode.insertBefore(div,ref);

    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        "iframe[src*='player.vimeo.com']",
        "iframe[src*='youtube.com']",
        "iframe[src*='youtube-nocookie.com']",
        "iframe[src*='kickstarter.com'][src*='video.html']",
        "object",
        "embed"
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not("object object"); // SwfObj conflict patch

      $allVideos.each(function(){
        var $this = $(this);
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('id')){
          var videoID = 'fitvid' + Math.floor(Math.random()*999999);
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+"%");
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );

 /**/(function() {
  var DESKTOP, PHONE, TABLET, desktopTest, mediaTests, onResize, phoneTest, repaint, repaintListeners, respondObj, tabletTest;

  PHONE = 320;

  TABLET = 768;

  DESKTOP = 1024;

  respondObj = {
    RESPOND_PHONE: 'RESPOND_PHONE',
    RESPOND_TABLET: 'RESPOND_TABLET',
    RESPOND_DESKTOP: 'RESPOND_DESKTOP',
    respondCurrent: ''
  };

  phoneTest = {
    query: "only screen and (max-width: " + (TABLET - 1) + "px)",
    type: respondObj.RESPOND_PHONE
  };

  tabletTest = {
    query: "only screen and (min-width: " + TABLET + "px) and (max-width: " + (DESKTOP - 1) + "px)",
    type: respondObj.RESPOND_TABLET
  };

  desktopTest = {
    query: "only screen and (min-width: " + DESKTOP + "px)",
    type: respondObj.RESPOND_DESKTOP
  };

  mediaTests = [phoneTest, tabletTest, desktopTest];

  repaintListeners = [];

  repaint = function() {
    var last, listener, test, _i, _j, _len, _len1, _results;
    last = respondObj.respondCurrent;
    for (_i = 0, _len = mediaTests.length; _i < _len; _i++) {
      test = mediaTests[_i];
      if (matchMedia(test.query).matches) {
        respondObj.respondCurrent = test.type;
        break;
      }
    }
    _results = [];
    for (_j = 0, _len1 = repaintListeners.length; _j < _len1; _j++) {
      listener = repaintListeners[_j];
      _results.push(listener.cb.apply(listener.ctx, [respondObj.respondCurrent !== last]));
    }
    return _results;
  };

  onResize = _.debounce(repaint, 300);

  $(window).resize(onResize);

  repaint();

  G.Module('respond', {
    extend: function(AbstractGremlin) {
      AbstractGremlin.__respond = respondObj;
      return AbstractGremlin.prototype.addResizeListener = function(cb, ctx) {
        if (ctx == null) {
          ctx = null;
        }
        return repaintListeners.push({
          cb: cb,
          ctx: ctx
        });
      };
    },
    bind: function() {}
  });

}).call(this);

/*
//@ sourceMappingURL=respond.js.map
*/
 /**/(function() {
  var HammerJS;

  HammerJS = (function() {
    function HammerJS() {}

    HammerJS.extend = function() {};

    HammerJS.bind = function(gremlinInstance) {
      return $(gremlinInstance.el).hammer();
    };

    return HammerJS;

  })();

  G.Module('hammer', HammerJS);

}).call(this);

/*
//@ sourceMappingURL=hammer.js.map
*/
 /**/(function() {
  var Index;

  Index = (function() {
    var START, STEP;

    START = 0;

    STEP = 1;

    function Index(_length, _position) {
      this._length = _length;
      this._position = _position;
    }

    Index.prototype.next = function() {
      if (this.hasMore()) {
        return this._position += STEP;
      }
    };

    Index.prototype.prev = function() {
      if (this.hasLess()) {
        return this._position -= STEP;
      }
    };

    Index.prototype.hasMore = function() {
      return this._position + STEP < this._length;
    };

    Index.prototype.hasLess = function() {
      return this._position - STEP >= START;
    };

    Index.prototype.getPosition = function() {
      return this._position;
    };

    return Index;

  })();

  G.Package('slider.Index', Index);

}).call(this);

/*
//@ sourceMappingURL=Index.js.map
*/
 /**/(function() {
  var Spinner;

  Spinner = (function() {
    var CSS_SPINNER_LOADING;

    CSS_SPINNER_LOADING = 'spinner_state-active';

    function Spinner() {
      this._$spinner = $('<span class="spinner spinner_position-centered"></span>');
    }

    Spinner.prototype._toggle = function(show) {
      return this._$spinner.toggleClass(CSS_SPINNER_LOADING, show);
    };

    Spinner.prototype.show = function() {
      return this._toggle(true);
    };

    Spinner.prototype.hide = function() {
      return this._toggle(false);
    };

    Spinner.prototype.appendTo = function($el) {
      return $el.append(this._$spinner);
    };

    Spinner.prototype.after = function($el) {
      return $el.after(this._$spinner);
    };

    return Spinner;

  })();

  G.Package('ui.Spinner', Spinner);

}).call(this);

/*
//@ sourceMappingURL=Spinner.js.map
*/
 /**/(function() {
  var ElementRow;

  ElementRow = (function() {
    var INCLUDE_MARGIN, INITAL_WIDTH, rowId;

    INITAL_WIDTH = 0;

    INCLUDE_MARGIN = true;

    rowId = 0;

    function ElementRow(_maxWidth) {
      this._maxWidth = _maxWidth;
      this._rowId = ++rowId;
      this._width = INITAL_WIDTH;
      this._elements = [];
    }

    ElementRow.prototype.canAddElement = function($el) {
      var width;
      width = this._getElementwidth($el);
      return (this._width + width) <= this._maxWidth;
    };

    ElementRow.prototype.addElement = function($el) {
      this._width += this._getElementwidth($el);
      return this._elements.push($el);
    };

    ElementRow.prototype._getElementwidth = function($el) {
      return $el.outerWidth(INCLUDE_MARGIN);
    };

    ElementRow.prototype.equalize = function() {
      var UiTools, el, max, _i, _len, _ref, _results;
      UiTools = G.Package.require('ui.Tools');
      max = UiTools.getMaxHeight(this._elements);
      _ref = this._elements;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        _results.push($(el).height(max));
      }
      return _results;
    };

    return ElementRow;

  })();

  G.Package('heightEqualizer.ElementRow', ElementRow);

}).call(this);

/*
//@ sourceMappingURL=ElementRow.js.map
*/
 /**/(function() {
  var RowCollection;

  RowCollection = (function() {
    function RowCollection() {
      this._rows = [];
    }

    RowCollection.prototype.add = function(row) {
      return this._rows.push(row);
    };

    RowCollection.prototype.getLast = function() {
      var last;
      last = this._rows.length - 1;
      return this._rows[last];
    };

    RowCollection.prototype.forEach = function(cb) {
      var row, _i, _len, _ref, _results;
      _ref = this._rows;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        _results.push(cb(row));
      }
      return _results;
    };

    return RowCollection;

  })();

  G.Package('heightEqualizer.RowCollection', RowCollection);

}).call(this);

/*
//@ sourceMappingURL=RowCollection.js.map
*/
 /**/(function() {
  var DesktopNavToggle;

  DesktopNavToggle = (function() {
    var MIN_HEIGHT;

    MIN_HEIGHT = 0;

    function DesktopNavToggle(height) {
      this.height = height;
      this.isVisible = this.height > MIN_HEIGHT;
    }

    return DesktopNavToggle;

  })();

  G.Package('interestData.DesktopNavToggle', DesktopNavToggle);

}).call(this);

/*
//@ sourceMappingURL=DesktopNavToggle.js.map
*/
 /**/(function() {
  var NavbarToggle;

  NavbarToggle = (function() {
    function NavbarToggle(_id) {
      this._id = _id;
    }

    NavbarToggle.prototype.isNavbar = function(id) {
      return id === this._id;
    };

    return NavbarToggle;

  })();

  G.Package('interestData.NavbarToggle', NavbarToggle);

}).call(this);

/*
//@ sourceMappingURL=NavbarToggle.js.map
*/
 /**/(function() {
  var TabShown;

  TabShown = (function() {
    function TabShown(el) {
      this.el = el;
    }

    TabShown.prototype.isChildOf = function(element) {
      return $.contains(element, this.el);
    };

    TabShown.prototype.isParentOf = function(element) {
      return $.contains(this.el, element);
    };

    return TabShown;

  })();

  G.Package('interestData.TabShown', TabShown);

}).call(this);

/*
//@ sourceMappingURL=TabShown.js.map
*/
 /**/(function() {
  G.Package('interests', {
    MOBILE_NAV_TOGGLE: 'MOBILE_NAV_TOGGLE',
    DESKTOP_NAV_TOGGLE: 'DESKTOP_NAV_TOGGLE',
    NAVBAR_TOGGLE: 'NAVBAR_TOGGLE',
    TAB_SHOWN: 'TAB_SHOWN',
    SLIDING_PANEL_CHANGED: 'SLIDING_PANEL_CHANGED'
  });

}).call(this);

/*
//@ sourceMappingURL=interests.js.map
*/
 /**/(function() {
  var PopupOptions;

  PopupOptions = {
    IMAGE: {
      type: 'image',
      closeOnContentClick: true,
      closeBtnInside: false,
      fixedContentPos: true,
      mainClass: 'mfp-no-margins mfp-with-zoom',
      image: {
        verticalFit: true
      },
      zoom: {
        enabled: true,
        duration: 300
      }
    },
    GALLERY: {
      delegate: 'a',
      type: 'image',
      closeOnContentClick: false,
      closeBtnInside: false,
      mainClass: 'mfp-with-zoom mfp-img-mobile',
      image: {
        verticalFit: true,
        titleSrc: function(item) {
          return item.el.attr('title') + ' &middot; <a class="image-source-link" href="' + item.el.attr('data-source') + '" target="_blank">image source</a>';
        }
      },
      gallery: {
        enabled: true
      },
      zoom: {
        enabled: true,
        duration: 300,
        opener: function(element) {
          return element.find('img');
        }
      }
    }
  };

  G.Package('lightbox.PopupOptions', PopupOptions);

}).call(this);

/*
//@ sourceMappingURL=PopupOptions.js.map
*/
 /**/(function() {
  var FLYOUT_NEXT_SELECTOR;

  FLYOUT_NEXT_SELECTOR = '[data-nav-flyout]';

  G.Package('navigation.Helper', {
    getFlyout: function($toggle) {
      return $toggle.nextAll("" + FLYOUT_NEXT_SELECTOR + ":first");
    }
  });

}).call(this);

/*
//@ sourceMappingURL=Helper.js.map
*/
 /**/(function() {
  var Spinner;

  Spinner = (function() {
    function Spinner(isCentered) {
      this._$spinner = $('<span class="spinner"></span>');
      this._$spinner.toggleClass('spinner_pos-center', isCentered);
    }

    Spinner.prototype.show = function() {
      this._$spinner.fadeTo(0, 0).addClass('spinner_state-active');
      return this._$spinner.delay(500).fadeTo(120, 1);
    };

    Spinner.prototype.hide = function() {
      this._$spinner.stop(true, true).removeAttr('style');
      return this._$spinner.removeClass('spinner_state-active');
    };

    Spinner.prototype.appendTo = function($el) {
      $el.append(this._$spinner);
      return this._$spinner.after('<span class="spinner__cover"></span>');
    };

    Spinner.prototype.after = function($el) {
      $el.after(this._$spinner);
      return this._$spinner.after('<span class="spinner__cover"></span>');
    };

    return Spinner;

  })();

  G.Package('ui.Spinner', Spinner);

}).call(this);

/*
//@ sourceMappingURL=Spinner.js.map
*/
 /**/(function() {
  var Tools;

  Tools = (function() {
    var INCLUDE_MARGINS;

    function Tools() {}

    INCLUDE_MARGINS = false;

    Tools.getMaxHeight = function(elements) {
      var el, heights;
      heights = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          _results.push($(el).outerHeight(INCLUDE_MARGINS));
        }
        return _results;
      })();
      return Math.max.apply(Math, heights);
    };

    return Tools;

  })();

  G.Package('ui.Tools', Tools);

}).call(this);

/*
//@ sourceMappingURL=Tools.js.map
*/
 /* CAUTION HOT: THIS IS NOT BOOTSTRAP !!! */
 /**/(function() {
  var BootstrapTabs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BootstrapTabs = (function(_super) {
    var BOOTSTRAP_TAB_SHOWN, Interests, TabShown;

    __extends(BootstrapTabs, _super);

    BOOTSTRAP_TAB_SHOWN = 'shown.bs.tab';

    TabShown = G.Package.require('interestData.TabShown');

    Interests = G.Package.require('interests');

    BootstrapTabs.include = ['jquery', 'interests'];

    BootstrapTabs.events = {
      'shown.bs.tab [data-toggle="tab"]': '_onTabShown'
    };

    function BootstrapTabs() {
      BootstrapTabs.__super__.constructor.apply(this, arguments);
    }

    BootstrapTabs.prototype._onTabShown = function(e) {
      var data;
      data = new TabShown(this.el);
      return this.emit(Interests.TAB_SHOWN, data);
    };

    return BootstrapTabs;

  })(G.Gizmo);

  G.add('BootstrapTabs', BootstrapTabs);

}).call(this);

/*
//@ sourceMappingURL=BootstrapTabs.js.map
*/
 /**/(function() {
  var EqualHeights,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EqualHeights = (function(_super) {
    var ElementRow, RowCollection;

    __extends(EqualHeights, _super);

    ElementRow = G.Package.require('heightEqualizer.ElementRow');

    RowCollection = G.Package.require('heightEqualizer.RowCollection');

    EqualHeights.include = ['jquery', 'respond'];

    function EqualHeights() {
      EqualHeights.__super__.constructor.apply(this, arguments);
      this._$targets = this.$el.find(this.data.targetSelector);
      this._equalize();
      this.addResizeListener(this._onResize, this);
    }

    EqualHeights.prototype._equalize = function() {
      var $el, containerWidth, currentRow, el, rows, _i, _len, _ref,
        _this = this;
      this._$targets.css({
        height: ''
      });
      rows = new RowCollection;
      containerWidth = this.$el.width();
      currentRow = this._createRow(rows, containerWidth);
      _ref = this._$targets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        $el = $(el);
        if (!currentRow.canAddElement($el)) {
          currentRow = this._createRow(rows, containerWidth);
        }
        currentRow.addElement($el);
      }
      return rows.forEach(function(row) {
        return row.equalize();
      });
    };

    EqualHeights.prototype._createRow = function(rows, width) {
      rows.add(new ElementRow(width));
      return rows.getLast();
    };

    EqualHeights.prototype._onResize = function(formatChanged) {
      return this._equalize();
    };

    return EqualHeights;

  })(G.Gizmo);

  G.add('EqualHeights', EqualHeights);

}).call(this);

/*
//@ sourceMappingURL=EqualHeights.js.map
*/
 /**/(function() {
  var Fitvids,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Fitvids = (function(_super) {
    __extends(Fitvids, _super);

    Fitvids.include = ['jquery'];

    function Fitvids() {
      Fitvids.__super__.constructor.apply(this, arguments);
      this.$el.fitVids();
    }

    return Fitvids;

  })(G.Gizmo);

  G.add('Fitvids', Fitvids);

}).call(this);

/*
//@ sourceMappingURL=Fitvids.js.map
*/
 /**/(function() {
  var Lightbox,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Lightbox = (function(_super) {
    var Options, TYPE_GALLERY, TYPE_IMAGE;

    __extends(Lightbox, _super);

    TYPE_IMAGE = 'image';

    TYPE_GALLERY = 'gallery';

    Options = G.Package.require('lightbox.PopupOptions');

    Lightbox.include = ['jquery'];

    function Lightbox() {
      var options;
      Lightbox.__super__.constructor.apply(this, arguments);
      switch (this.data.lightboxType) {
        case TYPE_IMAGE:
          options = Options.IMAGE;
          break;
        case TYPE_GALLERY:
          options = Options.GALLERY;
          break;
        default:
          options = Options.IMAGE;
      }
      this.$el.magnificPopup(options);
    }

    return Lightbox;

  })(G.Gizmo);

  G.add('Lightbox', Lightbox);

}).call(this);

/*
//@ sourceMappingURL=Lightbox.js.map
*/
 /**/(function() {
  var LinkListBrowser,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  LinkListBrowser = (function(_super) {
    var Spinner, XHR_ABORT_STATUS;

    __extends(LinkListBrowser, _super);

    XHR_ABORT_STATUS = 'abort';

    Spinner = G.Package.require('ui.Spinner');

    LinkListBrowser.include = ['jquery', 'interests'];

    LinkListBrowser.interests = {
      'TAB_SHOWN': '_onTabShown',
      'SLIDING_PANEL_CHANGED': '_onPanelChanged'
    };

    LinkListBrowser.elements = {
      '[data-link-list-items]': '_$list',
      '[data-link-list-view]': '_$view'
    };

    LinkListBrowser.events = {
      'click [data-link-list-items] a': '_onLinkClick',
      'click [data-link-list-browser-toggle="close"]': '_onCloseView'
    };

    function LinkListBrowser() {
      this._contentFailed = __bind(this._contentFailed, this);
      this._contentLoaded = __bind(this._contentLoaded, this);
      LinkListBrowser.__super__.constructor.apply(this, arguments);
      this._xhr = null;
      this._spinner = new Spinner(true);
      this._spinner.appendTo(this.$el);
    }

    LinkListBrowser.prototype._onLinkClick = function(e) {
      e.preventDefault();
      this._abortLoading();
      this._spinner.show();
      this._xhr = $.get(e.currentTarget.href);
      this._xhr.done(this._contentLoaded);
      return this._xhr.fail(this._contentFailed);
    };

    LinkListBrowser.prototype._contentLoaded = function(content) {
      this._spinner.hide();
      return this._showView(content);
    };

    LinkListBrowser.prototype._contentFailed = function(error) {
      this._spinner.hide();
      this._hideView();
      if (error.statusText !== XHR_ABORT_STATUS) {
        throw new Error(error);
      }
    };

    LinkListBrowser.prototype._showView = function(content) {
      this._$list.hide();
      return this._$view.html(content).show();
    };

    LinkListBrowser.prototype._hideView = function() {
      this._abortLoading();
      this._$list.show();
      return this._$view.empty().hide();
    };

    LinkListBrowser.prototype._onCloseView = function(e) {
      e.preventDefault();
      return this._hideView();
    };

    LinkListBrowser.prototype._onTabShown = function(tabShownData) {
      if (tabShownData.isParentOf(this.el)) {
        return this._hideView();
      }
    };

    LinkListBrowser.prototype._onPanelChanged = function() {
      return this._hideView();
    };

    LinkListBrowser.prototype._abortLoading = function() {
      var _ref;
      if ((_ref = this._xhr) != null) {
        _ref.abort();
      }
      return this._xhr = null;
    };

    return LinkListBrowser;

  })(G.Gizmo);

  G.add('LinkListBrowser', LinkListBrowser);

}).call(this);

/*
//@ sourceMappingURL=LinkListBrowser.js.map
*/
 /**/(function() {
  var Site,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Site = (function(_super) {
    var CONTENT_TOP_FLYOUT_PADDING, CSS_BODY_TOGGLED, CSS_FLYOUT_OPENED;

    __extends(Site, _super);

    CSS_BODY_TOGGLED = 'site_mobilenav-opened';

    CSS_FLYOUT_OPENED = 'site_desktopnav-opened';

    CONTENT_TOP_FLYOUT_PADDING = 50;

    Site.include = ['jquery', 'interests'];

    Site.interests = {
      'MOBILE_NAV_TOGGLE': '_onNavToggled',
      'DESKTOP_NAV_TOGGLE': '_onFlyoutToggled'
    };

    function Site() {
      this._onFlyoutToggled = __bind(this._onFlyoutToggled, this);
      this._onNavToggled = __bind(this._onNavToggled, this);
      Site.__super__.constructor.apply(this, arguments);
    }

    Site.prototype._onNavToggled = function(isEnabled) {
      return this.$el.toggleClass(CSS_BODY_TOGGLED, isEnabled);
    };

    Site.prototype._onFlyoutToggled = function(data) {
      var height;
      height = data.isVisible ? data.height - CONTENT_TOP_FLYOUT_PADDING : 0;
      if (Modernizr.csstransforms3d) {
        this.$el.css({
          transform: "translate3d(0, " + height + "px, 0)"
        });
      } else {
        this.$el.css({
          paddingTop: height
        });
      }
      return this.$el.toggleClass(CSS_FLYOUT_OPENED, data.isVisible);
    };

    return Site;

  })(G.Gizmo);

  G.add('Site', Site);

}).call(this);

/*
//@ sourceMappingURL=Site.js.map
*/
 /**/(function() {
  var Index, Slider,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Index = G.Package.require('slider.Index');

  Slider = (function(_super) {
    var CSS_DRAGGING, CSS_NEXT_INACTIVE, CSS_PREV_INACTIVE, NO_DRAG, START_INDEX, WIDTH_WITH_MARGINS;

    __extends(Slider, _super);

    START_INDEX = 0;

    WIDTH_WITH_MARGINS = true;

    NO_DRAG = 0;

    CSS_DRAGGING = 'slider_state-dragging';

    CSS_PREV_INACTIVE = 'slider__prev_state-inactive';

    CSS_NEXT_INACTIVE = 'slider__next_state-inactive';

    Slider.include = ['jquery', 'hammer', 'respond'];

    Slider.events = {
      'click [data-click-prev]': '_onPrev',
      'click [data-click-next]': '_onNext',
      'swipeleft [data-container]': '_onNext',
      'swiperight [data-container]': '_onPrev',
      'dragleft [data-container]': '_onDrag',
      'dragright [data-container]': '_onDrag',
      'dragstart [data-container]': '_onDragStart',
      'dragend [data-container]': '_onDragEnd'
    };

    Slider.elements = {
      '[data-click-prev]': '_$prev',
      '[data-click-next]': '_$next',
      '[data-container]': '_$container',
      '[data-slides]': '_$slides',
      '[data-slides] li': '_$items'
    };

    Slider.prototype._$prev = null;

    Slider.prototype._$next = null;

    Slider.prototype._$container = null;

    Slider.prototype._$slides = null;

    Slider.prototype._$items = null;

    function Slider() {
      var containerWidth, listWidth, times;
      Slider.__super__.constructor.apply(this, arguments);
      containerWidth = this._$container.width();
      listWidth = this._$slides.innerWidth();
      times = Math.ceil(listWidth / containerWidth);
      this.addResizeListener(this._onResize, this);
      this._prepareList();
    }

    Slider.prototype._prepareList = function() {
      var containerWidth, item, listWidth, times, _i, _len, _ref;
      listWidth = 0;
      _ref = this._$items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        listWidth += $(item).outerWidth(WIDTH_WITH_MARGINS);
      }
      containerWidth = this._$container.width();
      times = Math.ceil(listWidth / containerWidth);
      this._dragStartIndex = START_INDEX;
      this._index = new Index(times, START_INDEX);
      this._itemDistance = parseInt(this._$items.eq(1).css('margin-left'), 10);
      this._moveOffset = containerWidth;
      this._currentOffset = 0;
      return this._refreshList();
    };

    Slider.prototype._refreshList = function() {
      var currentPage, offset;
      currentPage = this._index.getPosition();
      offset = currentPage === START_INDEX ? 0 : -((this._moveOffset * currentPage) + this._itemDistance);
      this._currentOffset = offset;
      this._updateNav();
      return this._moveList(offset);
    };

    Slider.prototype._moveList = function(deltaX) {
      var opts;
      if (Modernizr.csstransforms3d) {
        opts = {
          'transform': "translate3d(" + deltaX + "px, 0, 0)"
        };
      } else if (Modernizr.csstransforms) {
        opts = {
          'transform': "translate(" + deltaX + "px, 0)"
        };
      } else {
        opts = {
          marginLeft: deltaX
        };
      }
      return this._$slides.css(opts);
    };

    Slider.prototype._dragList = function(deltaX) {
      var dragDelta;
      dragDelta = this._currentOffset + deltaX;
      return this._moveList(dragDelta);
    };

    Slider.prototype._onDrag = function(e) {
      var deltaX, gesture;
      e.preventDefault();
      e.stopPropagation();
      gesture = e.gesture;
      gesture.preventDefault();
      deltaX = gesture.deltaX;
      return this._dragList(deltaX);
    };

    Slider.prototype._onDragStart = function(e) {
      e.preventDefault();
      e.stopPropagation();
      this._dragStartIndex = this._index.getPosition();
      return this.$el.addClass(CSS_DRAGGING);
    };

    Slider.prototype._onDragEnd = function(e) {
      var deltaX, gesture, isEnough, isPrev, method, wasntSwiped;
      e.preventDefault();
      e.stopPropagation();
      this.$el.removeClass(CSS_DRAGGING);
      gesture = e.gesture;
      deltaX = gesture.deltaX;
      wasntSwiped = this._dragStartIndex === this._index.getPosition();
      isEnough = Math.abs(deltaX) > (this._moveOffset / 4);
      if (isEnough && wasntSwiped) {
        isPrev = deltaX > 0;
        method = isPrev ? 'prev' : 'next';
        this._index[method]();
      }
      return this._refreshList();
    };

    Slider.prototype._onResize = function() {
      return this._prepareList();
    };

    Slider.prototype._updateNav = function() {
      this._$prev.toggleClass(CSS_PREV_INACTIVE, !this._index.hasLess());
      return this._$next.toggleClass(CSS_NEXT_INACTIVE, !this._index.hasMore());
    };

    Slider.prototype._onPrev = function(e) {
      e.preventDefault();
      this._index.prev();
      return this._refreshList();
    };

    Slider.prototype._onNext = function(e) {
      e.preventDefault();
      this._index.next();
      return this._refreshList();
    };

    Slider.prototype._onSlides = function(e) {};

    return Slider;

  })(G.Gizmo);

  G.add('Slider', Slider);

}).call(this);

/*
//@ sourceMappingURL=Slider.js.map
*/
 /**/(function() {
  var SlidingPanels,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SlidingPanels = (function(_super) {
    var COLLAPSE_HIDE, COLLAPSE_SHOW, CSS_NO_TRANSITIONS, interests;

    __extends(SlidingPanels, _super);

    CSS_NO_TRANSITIONS = 'no-transition';

    COLLAPSE_SHOW = 'show';

    COLLAPSE_HIDE = 'hide';

    interests = G.Package.require('interests');

    SlidingPanels.include = ['jquery', 'interests'];

    SlidingPanels.events = {
      'click [data-panel-toggle]': '_onPanelToggleClick'
    };

    SlidingPanels.elements = {
      '[data-panel-toggle-wrapper]': '_$toggleWrappers',
      '[data-panel]': '_$panels'
    };

    function SlidingPanels() {
      SlidingPanels.__super__.constructor.apply(this, arguments);
      this._initPanels();
    }

    SlidingPanels.prototype._initPanels = function() {
      return this._$panels.collapse({
        toggle: false
      });
    };

    SlidingPanels.prototype._onPanelToggleClick = function(e) {
      var $targetPanel, $toggle, $toggleWrapper, isPanelActive,
        _this = this;
      e.preventDefault();
      $toggle = $(e.currentTarget);
      $toggleWrapper = this._getToggleWrapper($toggle);
      $targetPanel = this._getTogglePanel($toggle);
      isPanelActive = this._isActiveToggle($toggleWrapper);
      if (isPanelActive) {
        this._$panels.removeClass(CSS_NO_TRANSITIONS);
        this._$toggleWrappers.removeClass(this.data.cssPanelActive);
        this.$el.removeClass(this.data.cssPanelShow);
        setTimeout(function() {
          return _this._$panels.collapse(COLLAPSE_HIDE);
        }, 400);
      } else {
        if (this._isPanelOpened()) {
          this._$panels.addClass(CSS_NO_TRANSITIONS);
        }
        this.$el.addClass(this.data.cssPanelShow);
        this._$panels.not($targetPanel).collapse(COLLAPSE_HIDE);
        $targetPanel.collapse(COLLAPSE_SHOW);
        this._$toggleWrappers.removeClass(this.data.cssPanelActive);
        $toggleWrapper.addClass(this.data.cssPanelActive);
      }
      return this.emit(interests.SLIDING_PANEL_CHANGED);
    };

    SlidingPanels.prototype._getToggleWrapper = function($toggle) {
      return $toggle.closest('[data-panel-toggle-wrapper]');
    };

    SlidingPanels.prototype._getTogglePanel = function($toggle) {
      var id;
      id = $toggle.attr('href');
      return $(id);
    };

    SlidingPanels.prototype._isActiveToggle = function($toggleWrapper) {
      return $toggleWrapper.hasClass(this.data.cssPanelActive);
    };

    SlidingPanels.prototype._isPanelOpened = function() {
      return this.$el.hasClass(this.data.cssPanelShow);
    };

    return SlidingPanels;

  })(G.Gizmo);

  G.add('SlidingPanels', SlidingPanels);

}).call(this);

/*
//@ sourceMappingURL=SlidingPanels.js.map
*/
 /**/(function() {
  var Index, TimetablePager,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Index = G.Package.require('slider.Index');

  TimetablePager = (function(_super) {
    var CSS_ACTIVE_ITEM, CSS_DISABLED_BUTTON, START_INDEX;

    __extends(TimetablePager, _super);

    START_INDEX = 0;

    CSS_ACTIVE_ITEM = 'timetablebox__item_state-active';

    CSS_DISABLED_BUTTON = 'timetablebox__pager_state-disabled';

    TimetablePager.include = ['jquery'];

    TimetablePager.events = {
      'click [data-click-prev]': '_onPrev',
      'click [data-click-next]': '_onNext'
    };

    TimetablePager.elements = {
      '[data-click-prev]': '_$prev',
      '[data-click-next]': '_$next',
      '.timetablebox__item': '_$items'
    };

    function TimetablePager() {
      TimetablePager.__super__.constructor.apply(this, arguments);
      this._index = new Index(this._$items.length, START_INDEX);
      this._renderList();
    }

    TimetablePager.prototype._onPrev = function(e) {
      e.preventDefault();
      this._index.prev();
      return this._renderList();
    };

    TimetablePager.prototype._onNext = function(e) {
      e.preventDefault();
      this._index.next();
      return this._renderList();
    };

    TimetablePager.prototype._renderList = function() {
      var current;
      current = this._index.getPosition();
      this._$items.removeClass(CSS_ACTIVE_ITEM).eq(current).addClass(CSS_ACTIVE_ITEM);
      this._$prev.toggleClass(CSS_DISABLED_BUTTON, !this._index.hasLess());
      return this._$next.toggleClass(CSS_DISABLED_BUTTON, !this._index.hasMore());
    };

    return TimetablePager;

  })(G.Gizmo);

  G.add('TimetablePager', TimetablePager);

}).call(this);

/*
//@ sourceMappingURL=TimetablePager.js.map
*/
 /**/(function() {
  var MobileNavToggle,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MobileNavToggle = (function(_super) {
    var interests, isNavToggled;

    __extends(MobileNavToggle, _super);

    isNavToggled = false;

    interests = G.Package.require('interests');

    MobileNavToggle.include = ['jquery', 'interests'];

    MobileNavToggle.events = {
      'click': '_onClick'
    };

    function MobileNavToggle() {
      this._onClick = __bind(this._onClick, this);
      MobileNavToggle.__super__.constructor.apply(this, arguments);
    }

    MobileNavToggle.prototype._onClick = function(e) {
      e.preventDefault();
      isNavToggled = !isNavToggled;
      return this.emit(interests.MOBILE_NAV_TOGGLE, isNavToggled);
    };

    return MobileNavToggle;

  })(G.Gizmo);

  G.add('MobileNavToggle', MobileNavToggle);

}).call(this);

/*
//@ sourceMappingURL=MobileNavToggle.js.map
*/
 /**/(function() {
  var MobileNavigation,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MobileNavigation = (function(_super) {
    var CSS_TOGGLE_OPEN, Helper, SLIDE_DURATION;

    __extends(MobileNavigation, _super);

    CSS_TOGGLE_OPEN = 'mobile-toggle_state-active';

    SLIDE_DURATION = 210;

    Helper = G.Package.require('navigation.Helper');

    MobileNavigation.include = ['interests', 'respond', 'jquery'];

    MobileNavigation.interests = {
      'MOBILE_NAV_TOGGLE': '_onToggle'
    };

    MobileNavigation.events = {
      'click [data-nav-toggle]': '_onToggleLevelOne'
    };

    MobileNavigation.elements = {
      '[data-nav-toggle]': '_$toggles',
      '[data-nav-toggle="level-2"]': '_$togglesLevelTwo'
    };

    function MobileNavigation() {
      MobileNavigation.__super__.constructor.apply(this, arguments);
      this._respondObj = MobileNavigation.__respond;
      this._addToggleIcons();
      this._addToggleHeaders();
    }

    MobileNavigation.prototype._addToggleIcons = function() {
      return this._$toggles.append('<i class="fa fa-angle-down"></i> ');
    };

	MobileNavigation.prototype._addToggleHeaders = function() {
		var $flyout, $toggle, text, toggle, _i, _len, _ref, _results, href;
		_ref = this._$togglesLevelTwo;
		_results = [];
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			toggle = _ref[_i];
			$toggle = $(toggle);
			$flyout = Helper.getFlyout($toggle);
			text = $toggle.text();
			href = $toggle.attr("href");
			_results.push($flyout.prepend("<li class='nav-section__title nav-section__title_mobile-link'><a href=" + href + " tabindex=\"-1\">" + text + "</a></li>"));
		}
		return _results;
	};

    MobileNavigation.prototype._isDesktop = function() {
      var current;
      current = this._respondObj.respondCurrent;
      return current === this._respondObj.RESPOND_DESKTOP;
    };

    MobileNavigation.prototype._onToggle = function(isVisible) {
      var fn,
        _this = this;
      if (!this._isDesktop()) {
        fn = isVisible ? 'slideDown' : 'slideUp';
        return this.$el.stop()[fn](SLIDE_DURATION, function() {
          return _this.$el.css('height', '');
        });
      }
    };

      MobileNavigation.prototype._onToggleLevelOne = function(e) {
	  var $flyout, $toggle;
	  if (!this._isDesktop()) {

		  // Links within level-2 shall be directly clickable if they don´t contain links in a sublevel
		  var linkClickable = false;
		  if(!e.currentTarget.parentNode.className.match(/nav-section__level-1/)) {

			   $(e.currentTarget.parentNode.children).each(function(){
				   if($(this).is('ul')) {
					   linkClickable = true;
				   }
			   });

			  if(!linkClickable === true) {
				  return true;
			  }
		  }

		e.preventDefault();
		$toggle = $(e.currentTarget);
		$flyout = Helper.getFlyout($toggle);
		$toggle.toggleClass(CSS_TOGGLE_OPEN);

		return $flyout.stop().slideToggle(SLIDE_DURATION);
		}
	};

    return MobileNavigation;

  })(G.Gizmo);

  G.add('MobileNavigation', MobileNavigation);

}).call(this);

/*
//@ sourceMappingURL=MobileNavigation.js.map
*/
 /**/(function() {
  var Navbar,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Navbar = (function(_super) {
    var CSS_NAVBAR_ACTIVE, SCROLL_OFFSET;

    __extends(Navbar, _super);

    CSS_NAVBAR_ACTIVE = 'navigation-main__panel_state-active';

    SCROLL_OFFSET = 60;

    Navbar.include = ['jquery', 'respond', 'interests'];

    Navbar.interests = {
      'NAVBAR_TOGGLE': '_onNavbarToggle'
    };

    Navbar.elements = {
      'input:first': '_$firstInput'
    };

    function Navbar() {
      Navbar.__super__.constructor.apply(this, arguments);
    }

    Navbar.prototype._onNavbarToggle = function(eventData) {
      var isThisNavbar;
      isThisNavbar = eventData.isNavbar(this.el.id);
      this.$el.toggleClass(CSS_NAVBAR_ACTIVE, isThisNavbar);
      if (isThisNavbar) {
        this._$firstInput.focus();
      }
      if (isThisNavbar && Navbar.__respond.respondCurrent !== Navbar.__respond.RESPOND_DESKTOP) {
        return $('html, body').animate({
          scrollTop: this.$el.offset().top - SCROLL_OFFSET
        });
      }
    };

    return Navbar;

  })(G.Gizmo);

  G.add('Navbar', Navbar);

}).call(this);

/*
//@ sourceMappingURL=Navbar.js.map
*/
 /**/(function() {
  var NavbarToggle,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NavbarToggle = (function(_super) {
    var CSS_TOGGLE_ACTIVE, Interests, NavbarToggleData;

    __extends(NavbarToggle, _super);

    CSS_TOGGLE_ACTIVE = 'navigation-main__button_active';

    Interests = G.Package.require('interests');

    NavbarToggleData = G.Package.require('interestData.NavbarToggle');

    NavbarToggle.include = ['jquery', 'interests'];

    NavbarToggle.interests = {
      'NAVBAR_TOGGLE': '_onNavbarToggle'
    };

    NavbarToggle.events = {
      'click': '_onClick'
    };

    function NavbarToggle() {
      NavbarToggle.__super__.constructor.apply(this, arguments);
      this._id = this.el.getAttribute('href').replace('#', '');
    }

    NavbarToggle.prototype._onClick = function(e) {
      var data;
      e.preventDefault();
      data = new NavbarToggleData(this._id);
      return this.emit(Interests.NAVBAR_TOGGLE, data);
    };

    NavbarToggle.prototype._onNavbarToggle = function(eventData) {
      var isThisNavbar;
      isThisNavbar = eventData.isNavbar(this._id);
      return this.$el.toggleClass(CSS_TOGGLE_ACTIVE, isThisNavbar);
    };

    return NavbarToggle;

  })(G.Gizmo);

  G.add('NavbarToggle', NavbarToggle);

}).call(this);

/*
//@ sourceMappingURL=NavbarToggle.js.map
*/
 /**/(function() {
  var SiteNavObserver,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SiteNavObserver = (function(_super) {
    var CSS_DESKTOP_NAVIGATION_TOGGLED, CSS_MOBILE_NAVIGATION_TOGGLED, interests, interestsObj;

    __extends(SiteNavObserver, _super);

    CSS_MOBILE_NAVIGATION_TOGGLED = 'mobile-nav-openend';

    CSS_DESKTOP_NAVIGATION_TOGGLED = 'desktop-nav-openend';

    interests = G.Package.require('interests');

    interestsObj = {};

    interestsObj[interests.MOBILE_NAV_TOGGLE] = '_onMobileNavToggled';

    interestsObj[interests.DESKTOP_NAV_TOGGLE] = '_onDesktopNavToggled';

    SiteNavObserver.interests = interestsObj;

    SiteNavObserver.include = ['jquery', 'interests'];

    function SiteNavObserver() {
      this._onDesktopNavToggled = __bind(this._onDesktopNavToggled, this);
      this._onMobileNavToggled = __bind(this._onMobileNavToggled, this);
      SiteNavObserver.__super__.constructor.apply(this, arguments);
    }

    SiteNavObserver.prototype._onMobileNavToggled = function(isEnabled) {
      return this.$el.toggleClass(CSS_MOBILE_NAVIGATION_TOGGLED, isEnabled);
    };

    SiteNavObserver.prototype._onDesktopNavToggled = function(data) {
      return this.$el.toggleClass(CSS_DESKTOP_NAVIGATION_TOGGLED, data.isVisible);
    };

    return SiteNavObserver;

  })(G.Gizmo);

  G.add('SiteNavObserver', SiteNavObserver);

}).call(this);

/*
//@ sourceMappingURL=SiteNavObserver.js.map
*/
 /**/(function() {
  var SiteNavigation,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SiteNavigation = (function(_super) {
    var CSS_FLYOUT_ANIMATION_PAUSED, CSS_FLYOUT_SWITCHED_IN, CSS_FLYOUT_SWITCHED_OUT, CSS_TOGGLE_ACTIVE, DesktopNavToggle, Helper, NAV_HEIGHT_ORIGIN, NAV_SLIDE_DURATION, interests;

    __extends(SiteNavigation, _super);

    CSS_TOGGLE_ACTIVE = 'nav-section__toggle_state-active';

    CSS_FLYOUT_ANIMATION_PAUSED = 'nav-section__flyout_animation-paused';

    CSS_FLYOUT_SWITCHED_OUT = 'nav-section__flyout_transition-switch-out';

    CSS_FLYOUT_SWITCHED_IN = 'nav-section__flyout_transition-switch-in';

    NAV_SLIDE_DURATION = 270;

    NAV_HEIGHT_ORIGIN = 0;

    interests = G.Package.require('interests');

    Helper = G.Package.require('navigation.Helper');

    DesktopNavToggle = G.Package.require('interestData.DesktopNavToggle');

    SiteNavigation.include = ['jquery', 'respond', 'interests'];

    SiteNavigation.interests = {
      'NAVBAR_TOGGLE': '_onNavbarToggle'
    };

    SiteNavigation.elements = {
      '[data-nav-flyout]': '_$flyouts',
      '[data-nav-toggle="level-1"]': '_$toggles'
    };

    SiteNavigation.events = {
      'click [data-nav-toggle="level-1"]': '_onToggleLevelOne'
    };

    function SiteNavigation() {
      SiteNavigation.__super__.constructor.apply(this, arguments);
      this._respondObj = SiteNavigation.__respond;
    }

    SiteNavigation.prototype._onToggleLevelOne = function(e) {
      if (this._respondObj.respondCurrent === this._respondObj.RESPOND_DESKTOP) {
        e.preventDefault();
        return this._toggleFlyout($(e.currentTarget));
      }
    };

    SiteNavigation.prototype._onNavbarToggle = function(eventData) {
      var $activeToggle;
      if (this._respondObj.respondCurrent === this._respondObj.RESPOND_DESKTOP) {
        $activeToggle = this._$toggles.filter("." + CSS_TOGGLE_ACTIVE);
        return this._toggleFlyout($activeToggle);
      }
    };

    SiteNavigation.prototype._toggleFlyout = function($toggle) {
      var $activeToggle, isCurrentFlyout, isFlyoutOpened;
      $activeToggle = this._$toggles.filter("." + CSS_TOGGLE_ACTIVE);
      isCurrentFlyout = $toggle.hasClass(CSS_TOGGLE_ACTIVE);
      isFlyoutOpened = $activeToggle.length > 0;
      this._$flyouts.removeClass("" + CSS_FLYOUT_SWITCHED_OUT + " " + CSS_FLYOUT_SWITCHED_IN);
      if (isCurrentFlyout) {
        return this._closeFlyout($toggle);
      } else if (isFlyoutOpened) {
        return this._switchFlyout($activeToggle, $toggle);
      } else {
        return this._openFlyout($toggle);
      }
    };

    SiteNavigation.prototype._closeFlyout = function($toggle) {
      var $flyout;
      $toggle.removeClass(CSS_TOGGLE_ACTIVE);
      $flyout = this._getFlyout($toggle);
      this._removeTabindex($flyout);
      this._moveFlyout($flyout, NAV_HEIGHT_ORIGIN);
      return this._bubbleNavToggle(NAV_HEIGHT_ORIGIN);
    };

    SiteNavigation.prototype._switchFlyout = function($activeToggle, $toggle) {
      var $activeFlyout, $flyout, flyoutHeight, oldHeight;
      $activeFlyout = this._getFlyout($activeToggle);
      $flyout = this._getFlyout($toggle);
      oldHeight = this._getFlyoutHeight($activeFlyout);
      flyoutHeight = this._getFlyoutHeight($flyout);
      $activeFlyout.addClass(CSS_FLYOUT_SWITCHED_OUT);
      $flyout.addClass(CSS_FLYOUT_SWITCHED_IN);
      $activeToggle.removeClass(CSS_TOGGLE_ACTIVE);
      $toggle.addClass(CSS_TOGGLE_ACTIVE);
      this._removeTabindex($activeFlyout);
      this._addTabindex($flyout, this._getTabindex($toggle));
      this._moveFlyout($flyout, flyoutHeight);
      this._moveFlyout($activeFlyout, NAV_HEIGHT_ORIGIN);
      return this._bubbleNavToggle(flyoutHeight);
    };

    SiteNavigation.prototype._openFlyout = function($toggle) {
      var $flyout, flyoutHeight;
      $flyout = this._getFlyout($toggle);
      flyoutHeight = this._getFlyoutHeight($flyout);
      $toggle.addClass(CSS_TOGGLE_ACTIVE);
      this._addTabindex($flyout, this._getTabindex($toggle));
      this._moveFlyout($flyout, flyoutHeight);
      return this._bubbleNavToggle(flyoutHeight);
    };

    SiteNavigation.prototype._addTabindex = function($flyout, index) {
      var $links;
      $links = $flyout.find('a:not(.nav-section__title_mobile-link)');
      return $links.attr('tabindex', index);
    };

    SiteNavigation.prototype._removeTabindex = function($flyout) {
      var $links;
      $links = $flyout.find('a');
      return $links.attr('tabindex', -1);
    };

    SiteNavigation.prototype._getTabindex = function($toggle) {
      return $toggle.attr('tabindex');
    };

    SiteNavigation.prototype._moveFlyout = function($flyout, height) {
      if (Modernizr.csstransforms3d) {
        return $flyout.css({
          transform: "translate3d(0, " + height + "px, 0)"
        });
      } else {
        return $flyout.css({
          bottom: -height
        });
      }
    };

    SiteNavigation.prototype._bubbleNavToggle = function(height) {
      var data;
      data = new DesktopNavToggle(height);
      return this.emit(interests.DESKTOP_NAV_TOGGLE, data);
    };

    SiteNavigation.prototype._getFlyout = function($toggle) {
      return Helper.getFlyout($toggle);
    };

    SiteNavigation.prototype._getFlyoutHeight = function($flyout) {
      return $flyout.innerHeight();
    };

    return SiteNavigation;

  })(G.Gizmo);

  G.add('SiteNavigation', SiteNavigation);

}).call(this);

/*
//@ sourceMappingURL=SiteNavigation.js.map
*/
 /**/(function() {
  var SitenavToggle,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SitenavToggle = (function(_super) {
    var isNavToggled;

    __extends(SitenavToggle, _super);

    isNavToggled = false;

    SitenavToggle.include = ['jquery', 'interests'];

    SitenavToggle.events = {
      'click': '_onClick'
    };

    function SitenavToggle() {
      this._onClick = __bind(this._onClick, this);
      SitenavToggle.__super__.constructor.apply(this, arguments);
    }

    SitenavToggle.prototype._onClick = function(e) {
      e.preventDefault();
      isNavToggled = !isNavToggled;
      return this.emit('siteNavToggled', isNavToggled);
    };

    return SitenavToggle;

  })(G.Gizmo);

  G.add('SitenavToggle', SitenavToggle);

}).call(this);

/*
//@ sourceMappingURL=MobileNavToggle.js.map
*/