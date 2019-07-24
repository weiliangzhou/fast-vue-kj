//    用于压缩图片的canvas
/* eslint-disable */
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
//    瓦片canvas
var tCanvas = document.createElement('canvas');
var tctx = tCanvas.getContext('2d');
var maxsize = 2 * 1000 * 1024; // 大于多少兆的才压缩的临界值
const toBase64 = file => {
    return new Promise((resolve, reject) => {
        if (!/\/(?:jpeg|png|gif)/i.test(file.type)) {
            reject('图片格式错误');
        } else {
            var reader = new FileReader();
            reader.onload = function() {
                resolve(this.result);
            };
            reader.onerror = () => {
                reject('图片转换失败');
            };
            reader.readAsDataURL(file);
        }
    });
};
const base64toImage = base64 => {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.onload = () => {
            resolve(img);
        };
        img.onerror = () => {
            reject('转换图片失败');
        };
        img.src = base64;
    });
};
//    使用canvas对大图片进行压缩
function compress(img) {
    var initSize = img.src.length;
    var width = img.width;
    var height = img.height;
    // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    var ratio;
    if ((ratio = (width * height) / 4000000) > 1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
    } else {
        ratio = 1;
    }
    canvas.width = width;
    canvas.height = height;
    //        铺底色
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 如果图片像素大于100万则使用瓦片绘制
    var count;
    if ((count = (width * height) / 1000000) > 1) {
        count = ~~(Math.sqrt(count) + 1); // 计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        var nw = ~~(width / count);
        var nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
                tctx.drawImage(
                    img,
                    i * nw * ratio,
                    j * nh * ratio,
                    nw * ratio,
                    nh * ratio,
                    0,
                    0,
                    nw,
                    nh
                );
                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
        }
    } else {
        ctx.drawImage(img, 0, 0, width, height);
    }
    // 进行最小压缩
    var ndata = canvas.toDataURL('image/jpeg', 0.6);
    // console.log('压缩前：' + initSize);
    // console.log('压缩后：' + ndata.length);
    // console.log(
    //     '压缩率：' + ~~((100 * (initSize - ndata.length)) / initSize) + '%'
    // );
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
    return ndata;
}

//    图片上传，将base64的图片转成二进制对象，塞进formdata上传
function base64toBlob(basestr, type) {
    var byteString;
    if (basestr.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(basestr.split(',')[1]);
    } else {
        byteString = unescape(basestr.split(',')[1]);
    }
    var mimeString = basestr
        .split(',')[0]
        .split(':')[1]
        .split(';')[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {
        type: mimeString
    });
}

/**
 * 获取blob对象的兼容性写法
 * @param buffer
 * @param format
 * @returns {*}
 */
export function getBlob(buffer, format) {
    try {
        return new Blob(buffer, { type: format });
    } catch (e) {
        var bb = new (window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MSBlobBuilder)();
        buffer.forEach(function(buf) {
            bb.append(buf);
        });
        return bb.getBlob(format);
    }
}

export const tryCompressImg = file => {
    return Promise.resolve(file)
    .then(file=> {
            if (file.size <= maxsize) {
                throw new Error("无需压缩")
            } else {
                return file
            }
    }).then(file => toBase64(file))
    .then(base64 => base64.size <= maxsize ? base64 : base64toImage(base64).then(img => compress(img)))
    .then(base64 => base64toBlob(base64, file.type))
    .then(res => {
        let tempFile = new File([res], file.name, {type: res.type})
        console.log("压缩率", (file.size-tempFile.size)/file.size)
        return tempFile;
    }).catch(err => file);
};
