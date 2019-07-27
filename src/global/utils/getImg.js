
import Axios from 'axios';
export const getImageBlob = (url) => {
    return Axios({
        method: "get",
        url,
        responseType: "blob"
    }).then(function (response) {
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("下载失败");
        }
    })
}

export function timestamp(url) {
    var getTimestamp = new Date().getTime();
    url = url + "?timestamp=" + getTimestamp;
    return url;
}

let getImg = url => {
    return new Promise((resolve, reject) => {
        if (!(url && url.substr(0, 5) === "data:")) {
            url += ``;
        }
        let img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
            resolve(img);
        };
        img.onerror = () => {
            reject(new Error("fs"))
        };
    });
};
let resolveBlobToImg = url => {
    return new Promise((resolve, reject) => {
        let shareImgUrl = URL.createObjectURL(url);
        let img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = shareImgUrl;
        img.onload = () => {
            resolve(img);
            URL.revokeObjectURL(shareImgUrl);
        };
        img.onerror = () => {
            reject(new Error("fs"))
            URL.revokeObjectURL(shareImgUrl);
        };
    });
};

export let resolveImg = url => {
    return getImg(url).catch(err => {
        return getImageBlob(timestamp(url)).then(res => {
            return resolveBlobToImg(res)
        })
    })
};