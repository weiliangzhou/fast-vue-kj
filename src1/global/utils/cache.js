export const memoryCaches = () => {
    let store = {};
    let setItem = (key, value) => {
            store[key] = value
    }
    let removeItem = (key) => {
         store[key] = null
    }
    let getItem = (key) => {
        return store[key] || null;
    }
    let clearAll = () => {
        store = {}
    }
    return {
        setItem,
        removeItem,
        getItem,
        clearAll
    }
}
