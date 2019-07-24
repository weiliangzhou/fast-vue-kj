export default (() => {
    var style=document.createElement("style");
    style.setAttribute("type", "text/css");
    var cssString = `
      @keyframes loading {
          50% {
              transform: rotate(180deg)
          }
          100% {
              transform: rotate(360deg)
          }
      }

      #refresh-container {
          position: fixed;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.4);
          top: 0;
          right: 0;
          display: flex;
          justify-content:
          center borx-sizing:
          border-box;
          padding-top: 20px;
      }
      #refresh-container span {
          animation: loading 0.8s linear infinite;
          width:10px;
          height: 10px;
          margin: 0 auto;
          padding: 10px; border: 7px dashed #000;
          border-top-color: red;
          border-bottom-color: green;
          border-radius: 50%;
       }

       #refresh-container .spinner {
        width: 60px;
        height: 60px;

        position: relative;
        margin: 50px auto;
      }

      .double-bounce1, .double-bounce2 {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #67CF22;
        opacity: 0.6;
        position: absolute;
        top: 0;
        left: 0;

        -webkit-animation: bounce-loading 2.0s infinite ease-in-out;
        animation: bounce-loading 2.0s infinite ease-in-out;
      }

      .double-bounce2 {
        -webkit-animation-delay: -1.0s;
        animation-delay: -1.0s;
      }

      @-webkit-keyframes bounce-loading {
        0%, 100% { -webkit-transform: scale(0.0) }
        50% { -webkit-transform: scale(1.0) }
      }

      @keyframes bounce-loading {
        0%, 100% {
          transform: scale(0.0);
          -webkit-transform: scale(0.0);
        } 50% {
          transform: scale(1.0);
          -webkit-transform: scale(1.0);
        }
      }
    `
    if (style.styleSheet) { // IE
      style.styleSheet.cssText = cssString;
    } else { // w3c
      var cssText = document.createTextNode(cssString);
      style.appendChild(cssText);
    }

    var heads = document.getElementsByTagName("head");
    if (heads.length) { heads[0].appendChild(style); } else { document.documentElement.appendChild(style); }
    let fun = function(e) {
        e = e || window.event;
        e.preventDefault? e.preventDefault() : e.returnValue = false
        if (e.stopPropagation) {
            e.stopPropagation();
            e.stopImmediatePropagation()
        } else {
            e.cancelBubble = true;
        }
    }
    let containers = {
       circle: "",
       default: ""
    }
    // style1
      let span = document.createElement("span");
      containers["default"] = span;
      let div1 = document.createElement("div");
      div1.setAttribute("class", "spinner");
      let div2 = document.createElement("div");
      div2.setAttribute("class", "double-bounce1")
      let div3 = document.createElement("div");
      div3.setAttribute("class", "double-bounce2")

      div1.appendChild(div2)
      div1.appendChild(div3)

      // style 2
      containers["circle"] = div1;
      let container = document.createElement("div");
      container.setAttribute("id", "refresh-container")
      // append default style
      container.appendChild(div1);
      container.onclick = fun;
      container.addEventListener('mousewheel', fun)
      container.addEventListener('touchmove', function (event) {
          event.preventDefault()
      }, {passive: false})
      let isAdded = false;
      let startY = 0;
      let currentY = 0;
      let top = 0;
      let startScroll = 0;
      let currentStyle = ""
      let touchStart = e => {
          if (isAdded) {
              fun(e)
              return;
          }
          // 记录手指触摸位置y轴位置
          if (currentY > 0) return;
          currentY = e.targetTouches[0].pageY;
          startScroll = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || 0;
          startY = currentY;
          // 开启滑动记录
      };
      let touchMove = e => {
          if (startScroll>10) {
              return
          }
          if (isAdded) {
              return;
          }
          //  获取拉取的间隔差   当前移动的y点      初始的y点        初始顶部距离
          let diff = e.targetTouches[0].pageY - startY - startScroll;
          // 如果是往上滑的话，就取消事件
          currentY = e.targetTouches[0].pageY;
          top = e.targetTouches[0].pageY - startY;
          if (diff > 0) e.preventDefault();
          if (top>150) {
              top = 150;
          }
          if (top > 0 && top < 40) {
              if (!isAdded) {
                  let tempStyle = ["circle", "default"].find(item => item==currentStyle) || "default"
                  container.replaceChild(containers[tempStyle], container.childNodes[0])
                  document.body.appendChild(container)
                  isAdded = true;
              }
          }
          e.currentTarget.style.transform = `translateY(${top}px)`;
          e.currentTarget.style.WebkitTransform = `translateY(${top}px)`
      };
      let touchEnd = e => {
          top = 0;
          e.currentTarget.style.cssText = `top: 0`;
          e.currentTarget.style.transform = `-webkit-transform 500ms translateY(${top}px)`;
          e.currentTarget.style.WebkitTransform = `-webkit-transform 500ms translateY(${top}px)`
          if (reFetch) {
              reFetch(refreshDone)
              // reFetch()
          }
      };
      let refreshDone = () => {
          startY = 0;
          currentY = 0;
          top = 0;
          if (isAdded) {
              document.body.removeChild(container)
              isAdded = false;
          }
          // 下拉刷新后，对数据还原，获取第一页数据，重新注册滚轮事件
      };
      let reFetch = null;
      return {
          // 当被绑定的元素插入到 DOM 中时……
          inserted(el, binding, vnode) {
              el.addEventListener('touchstart', touchStart)
              el.addEventListener('touchmove', touchMove)
              el.addEventListener('touchend', touchEnd)
          },
          update() {},
          componentUpdated(el, binding, vnode) {
            currentStyle = binding.arg;
              let expression = binding.expression;
              if (expression&&vnode.context[expression]) {
                  reFetch = vnode.context[expression]
              } else {
                  reFetch = null;
              }
          },
          unbind(el, binding, vnode) {
              reFetch = null
              el.removeEventListener('touchstart', touchStart)
              el.removeEventListener('touchmove', touchMove)
              el.removeEventListener('touchend', touchEnd)
          }
      };
  })();
