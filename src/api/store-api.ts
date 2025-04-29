import { Product } from "../types/productType";

export async function createItem(itemData :Product ){
    return await window.ipcRenderer.invoke('add-item', itemData)
}